import defaults from 'src/graphql/shopfrontCart/defaults'
import { GET_CART } from 'src/graphql/shopfrontCart/queries'

import { Payments } from 'src/utils/enums'

const recalculateTotals = (items) => {
  items.map((item) => (item.subtotal = parseFloat((item.quantity * item.price).toFixed(2))))

  const subtotal = parseFloat(items.reduce((total, item) => total + item.subtotal, 0).toFixed(2))

  return { items, subtotal }
}

export const resetSFCart = (_, variables, { cache }) => {
  const data = { shopfrontCart: defaults }
  cache.writeData({ data })
}

export const addItemCart = (_, { input }, { cache }) => {
  try {
    const previous = cache.readQuery({ query: GET_CART })

    const index = previous.shopfrontCart.items.findIndex((item) => item._id === input._id)

    let item
    if (index === -1) {
      item = input
    } else {
      const [first] = previous.shopfrontCart.items.splice(index, 1)
      item = first
      item.quantity += input.quantity
      item.note = input.note
    }

    item.subtotal = parseFloat((item.quantity * item.price).toFixed(2))

    const items = [{ ...item, __typename: 'Item' }, ...previous.shopfrontCart.items]

    const { subtotal } = recalculateTotals(items)

    const data = { shopfrontCart: { ...previous.shopfrontCart, payments: [], items, subtotal } }

    cache.writeData({ data })
  } catch ({ message }) {
    console.error('ERROR:', message)
  }
}

export const removeItemCart = (_, variables, { cache }) => {
  const { input } = variables

  try {
    const previous = cache.readQuery({ query: GET_CART })
    const index = previous.shopfrontCart.items.findIndex((item) => item._id === input._id)
    const items = previous.shopfrontCart.items.filter((_, currentIndex) => currentIndex !== index)

    const { subtotal } = recalculateTotals(items)

    const data = { shopfrontCart: { ...previous.shopfrontCart, payments: [], items, subtotal } }

    cache.writeData({ data })
  } catch ({ message }) {
    console.error('ERROR:', message)
  }
}

export const addPaymentCart = (_, { input }, { cache }) => {
  const previous = cache.readQuery({ query: GET_CART })

  let { method, received, deliveryFee } = input

  if (method === Payments.cash.type) {
    if (!received || isNaN(received)) throw new Error('Valor recebido não é válido')
  } else {
    received = previous.shopfrontCart.subtotal + deliveryFee
  }

  const payments = [{ method, received, __typename: 'Payment' }]
  const data = { shopfrontCart: { ...previous.shopfrontCart, payments } }
  cache.writeData({ data })
}

export const addFederalTaxNumberCart = (_, { input }, { cache }) => {
  const { nationalId } = input

  try {
    const previous = cache.readQuery({ query: GET_CART })
    const data = {
      shopfrontCart: { ...previous.shopfrontCart, nationalId }
    }

    cache.writeData({ data })
  } catch ({ message }) {
    console.error('ERROR:', message)
  }
}

export const deleteFederalTaxNumberCart = (_, variables, { cache }) => {
  try {
    const previous = cache.readQuery({ query: GET_CART })
    const data = {
      shopfrontCart: { ...previous.shopfrontCart, nationalId: '' }
    }

    cache.writeData({ data })
  } catch ({ message }) {
    console.error('ERROR:', message)
  }
}

export const increaseItemCart = (_, variables, { cache }) => {
  const { index } = variables

  try {
    const previous = cache.readQuery({ query: GET_CART })

    const items = previous.shopfrontCart.items.map((item, currentIndex) => {
      if (currentIndex === index) item.quantity += 1
      return item
    })

    const data = { shopfrontCart: { ...previous.shopfrontCart, payments: [], items } }
    cache.writeData({ data })
  } catch ({ message }) {
    console.error('ERROR:', message)
  }
}

export const decreaseItemCart = (_, variables, { cache }) => {
  const { index } = variables

  try {
    const previous = cache.readQuery({ query: GET_CART })

    const items = previous.shopfrontCart.items.map((item, currentIndex) => {
      if (currentIndex === index && item.quantity > 1) item.quantity -= 1
      return item
    })

    const data = { shopfrontCart: { ...previous.shopfrontCart, payments: [], items } }
    cache.writeData({ data })
  } catch ({ message }) {
    console.error('ERROR:', message)
  }
}

export const updateQuantityItemCart = (_, { input }, { cache }) => {
  const { _id, quantity } = input

  try {
    const previous = cache.readQuery({ query: GET_CART })

    const index = previous.shopfrontCart.items.findIndex((item) => item._id === _id)

    const items = previous.shopfrontCart.items.map((item, currentIndex) => {
      if (currentIndex === index) item.quantity = parseFloat(quantity)
      return item
    })

    const { items: newItems, subtotal } = recalculateTotals(items)

    const data = {
      shopfrontCart: { ...previous.shopfrontCart, payments: [], items: newItems, subtotal }
    }
    cache.writeData({ data })
  } catch ({ message }) {
    console.error('ERROR:', message)
  }
}

export const updateDeliveryCart = (_, { input }, { cache }) => {
  try {
    const previous = cache.readQuery({ query: GET_CART })

    const { items, subtotal } = recalculateTotals(previous.shopfrontCart.items)
    const delivery = {
      ...previous.shopfrontCart.delivery,
      ...input,
      address: {
        ...previous.shopfrontCart.delivery.address,
        ...input.address
      }
    }

    const data = {
      shopfrontCart: {
        ...previous.shopfrontCart,
        payments: [],
        items,
        subtotal,
        delivery
      }
    }
    cache.writeData({ data })
  } catch ({ message }) {
    console.error('ERROR:', message)
  }
}
