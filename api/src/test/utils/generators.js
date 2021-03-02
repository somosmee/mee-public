import { v4 as uuidv4 } from 'uuid'

import { User, Company, Order } from 'src/models'

import { OrderStatus } from 'src/utils/enums'
import { generate } from 'src/utils/gtin'

export const orderGenerator = (companyId, userId, length, status = OrderStatus.OPEN, createdAt) => {
  const result = []

  for (let index = 0; index < length; index++) {
    const order = {
      company: companyId,
      createdBy: userId,
      items: [
        {
          gtin: '10',
          name: 'PEDIDO DE TESTE - Teste item promobomb',
          price: 10,
          measurement: 'unit',
          quantity: 1
        }
      ],
      origin: 'ifood',
      payments: [],
      status,
      total: 20,
      subtotal: 20,
      totalPaid: 20,
      createdAt,
      updatedAt: createdAt
    }

    if (createdAt) order.createdAt = createdAt

    result.push(order)
  }

  return result
}

export const inventoryGenerator = (userId, companyId, productId, length) => {
  const result = []

  for (let index = 0; index < length; index++) {
    result.push({
      quantity: 10,
      reason: 'acquisition',
      product: productId,
      balance: 10,
      createdBy: userId,
      company: companyId
    })
  }

  return result
}

const pad = (n, width, z) => {
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

export const customerGenerator = (userId, companyId, length) => {
  const result = []

  for (let index = 0; index < length; index++) {
    result.push({
      company: companyId,
      createdBy: userId,
      firstName: 'First',
      lastName: 'Last',
      mobile: `9298425${pad(index, 4)}`
    })
  }

  return result
}

export const productGenerator = (length, names) => {
  const result = []
  let lastGTIN = null

  for (let index = 0; index < length; index++) {
    const name = names && names.length > index ? names[index] : 'pastel de carne'
    const gtin = generate(1, lastGTIN)
    lastGTIN = gtin

    result.push({
      internal: true,
      name,
      description: 'muito suculento',
      measurement: 'unit',
      gtin: lastGTIN,
      price: 1,
      balance: 1
    })
  }

  return result
}

export const userProductGenerator = (userId, companyId, products) => {
  const result = []

  for (const product of products) {
    result.push({
      company: companyId,
      createdBy: userId,
      product: product._id,
      name: product.name,
      price: 0.0,
      balance: 0
    })
  }

  return result
}

export const supplierGenerator = (userId, length) => {
  const result = []

  for (let index = 0; index < length; index++) {
    result.push({
      grocery: userId,
      nationalId: '',
      displayName: 'Display Name',
      name: 'Name'
    })
  }

  return result
}

export const purchaseGenerator = (userId, companyId, length) => {
  const result = []

  for (let index = 0; index < length; index++) {
    result.push({
      companyId: companyId,
      createdBy: userId,
      accessKey: '',
      status: 'fetching'
    })
  }

  return result
}

export const userGenerator = async (input = {}) => {
  if (!input.email) input.email = `${uuidv4()}@gmail.com`
  const { address, ifood, ...userData } = input

  const user = await User.createUser(userData)
  const company = await Company.createCompany(user, { address, ifood })

  return { user, company }
}

export const createOrder = async (input, company) => {
  // update to latest object
  company = await Company.findById(company._id)

  const o = new Order(input)
  o.recalculateFees(company)
  o.recalculateTotals(company)
  await o.close(null, company)
  o.closedAt = o.createdAt
  await o.save()

  return o
}
