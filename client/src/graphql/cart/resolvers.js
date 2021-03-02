import defaults from 'src/graphql/cart/defaults'
import { GET_CART } from 'src/graphql/cart/queries'

export const initCart = (_, variables, { cache }) => {
  try {
    const previous = cache.readQuery({ query: GET_CART })

    variables.input.items = variables.input.items.map((item) => {
      item.subtotal = parseFloat((item.quantity * item.price).toFixed(2))
      return item
    })

    const data = {
      cart: {
        ...previous.cart,
        _id: variables.input._id,
        items: variables.input.items,
        payments: variables.input.payments
      }
    }

    cache.writeQuery({ query: GET_CART, data })
    return data
  } catch ({ message }) {
    console.error('ERROR:', message)
  }
}

export const resetCart = (_, variables, { cache }) => {
  cache.writeData({ data: { cart: { ...defaults } } })
}

export const addItemToCart = (_, variables, { cache }) => {
  const { input } = variables

  try {
    const previous = cache.readQuery({ query: GET_CART })

    const index = previous.cart.items.findIndex((item) => item.gtin === input.gtin)

    let item
    if (index === -1) {
      item = input
    } else {
      const [first] = previous.cart.items.splice(index, 1)
      item = first
      item.quantity += input.quantity
    }

    item.subtotal = parseFloat((item.quantity * item.price).toFixed(2))

    const items = [{ ...item, __typename: 'Item' }, ...previous.cart.items]
    const total = parseFloat(
      items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
    )
    const data = { cart: { ...previous.cart, items, total } }

    cache.writeData({ data })
  } catch ({ message }) {
    console.error('ERROR:', message)
  }
}

export const removeItemFromCart = (_, variables, { cache }) => {
  const { index } = variables

  try {
    const previous = cache.readQuery({ query: GET_CART })
    const items = previous.cart.items.filter((_, currentIndex) => currentIndex !== index)
    const total = parseFloat(
      items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
    )
    const data = { cart: { ...previous.cart, items, total } }

    cache.writeData({ data })
  } catch ({ message }) {
    console.error('ERROR:', message)
  }
}

export const addNoteItem = (_, variables, { cache }) => {
  const {
    index,
    input: { note }
  } = variables

  try {
    const previous = cache.readQuery({ query: GET_CART })

    const items = previous.cart.items.map((item, currentIndex) => {
      if (currentIndex === index) item.note = note
      return item
    })

    const data = { cart: { ...previous.cart, items } }
    cache.writeData({ data })
  } catch ({ message }) {
    console.error('ERROR:', message)
  }
}

export const addCustomerToCart = (_, { nationalId }, { cache }) => {
  try {
    const previous = cache.readQuery({ query: GET_CART })
    const data = { cart: { ...previous.cart, nationalId } }

    cache.writeData({ data })
  } catch ({ message }) {
    console.error('ERROR:', message)
  }
}

export const increaseQuantity = (_, variables, { cache }) => {
  const { index } = variables

  try {
    const previous = cache.readQuery({ query: GET_CART })

    const items = previous.cart.items.map((item, currentIndex) => {
      if (currentIndex === index) item.quantity += 1
      return item
    })

    const data = { cart: { ...previous.cart, items } }
    cache.writeData({ data })
  } catch ({ message }) {
    console.error('ERROR:', message)
  }
}

export const decreaseQuantity = (_, variables, { cache }) => {
  const { index } = variables

  try {
    const previous = cache.readQuery({ query: GET_CART })

    const items = previous.cart.items.map((item, currentIndex) => {
      if (currentIndex === index && item.quantity > 1) item.quantity -= 1
      return item
    })

    const data = { cart: { ...previous.cart, items } }
    cache.writeData({ data })
  } catch ({ message }) {
    console.error('ERROR:', message)
  }
}

export const setQuantity = (_, variables, { cache }) => {
  const { index, quantity } = variables

  try {
    const previous = cache.readQuery({ query: GET_CART })

    const items = previous.cart.items.map((item, currentIndex) => {
      if (currentIndex === index) item.quantity = parseFloat(quantity)
      return item
    })

    const data = { cart: { ...previous.cart, items } }
    cache.writeData({ data })
  } catch ({ message }) {
    console.error('ERROR:', message)
  }
}
