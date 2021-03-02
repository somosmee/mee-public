import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'

import { apolloServer } from 'src/apolloServer'

import { Company, User, Customer, Product, UserProduct, Inventory, Order } from 'src/models'

import { UPDATE_ORDER } from 'src/graphql/order/specs/gql'

import { OPEN_ORDER, CLOSED_ORDER } from 'src/test/common/payloads/orders'
import {
  PRODUCT_1,
  PRODUCT_2,
  PRODUCT_3,
  USER_PRODUCT_1,
  USER_PRODUCT_2,
  USER_PRODUCT_3
} from 'src/test/common/payloads/products'
import { userGenerator } from 'src/test/utils/generators'

import { Conditions, OrderStatus } from 'src/utils/enums'
import { generateToken } from 'src/utils/token'

let headers = null
let user = null
let company = null

const setUserAndCompany = async () => {
  const { user: newUser, company: newCompany } = await userGenerator()
  user = newUser
  company = newCompany
}

test.beforeEach(async (t) => {
  await Company.deleteMany({})
  await User.deleteMany({})
  await Product.deleteMany({})
  await UserProduct.deleteMany({})
  await Order.deleteMany({})
  await Inventory.deleteMany({})
  await Customer.deleteMany({})

  await setUserAndCompany()
  await new Product(PRODUCT_1).save()
  await new Product(PRODUCT_2).save()
  await new Product(PRODUCT_3).save()
  await new UserProduct({ ...USER_PRODUCT_1, company: company._id, createdBy: user._id }).save()
  await new UserProduct({ ...USER_PRODUCT_2, company: company._id, createdBy: user._id }).save()
  await new UserProduct({ ...USER_PRODUCT_3, company: company._id, createdBy: user._id }).save()
  await new Order({ ...OPEN_ORDER, company: company._id, createdBy: user._id }).save()
  await new Order({ ...CLOSED_ORDER, company: company._id, createdBy: user._id }).save()
  headers = { Authorization: generateToken({ userId: user._id, companyId: company._id }) }
})

test.afterEach.always(async (t) => {
  await Company.deleteMany({})
  await User.deleteMany({})
  await Product.deleteMany({})
  await UserProduct.deleteMany({})
  await Inventory.deleteMany({})
  await Customer.deleteMany({})
  await Order.deleteMany({})
})

test('should update order', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = {
    id: OPEN_ORDER._id,
    input: {
      items: [
        {
          product: PRODUCT_1._id,
          gtin: PRODUCT_1.gtin,
          name: PRODUCT_1.name,
          description: PRODUCT_1.description,
          price: USER_PRODUCT_1.price,
          measurement: PRODUCT_1.measurement,
          ncm: PRODUCT_1.ncm,
          quantity: 4,
          note: ''
        },
        {
          product: PRODUCT_2._id,
          gtin: PRODUCT_2.gtin,
          name: PRODUCT_2.name,
          description: PRODUCT_2.description,
          price: USER_PRODUCT_2.price,
          measurement: PRODUCT_2.measurement,
          ncm: PRODUCT_2.ncm,
          quantity: 1,
          note: ''
        },
        {
          product: PRODUCT_3._id,
          gtin: PRODUCT_3.gtin,
          name: PRODUCT_3.name,
          description: PRODUCT_3.description,
          price: USER_PRODUCT_3.price,
          measurement: PRODUCT_3.measurement,
          ncm: PRODUCT_3.ncm,
          quantity: 6,
          note: ''
        }
      ]
    }
  }

  const response = await mutate(UPDATE_ORDER, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)

  const { status, total, subtotal, totalPaid } = response.data.updateOrder

  t.is(status, OrderStatus.OPEN)
  t.is(total.toFixed(2), (300.19).toFixed(2))
  t.is(subtotal.toFixed(2), (300.19).toFixed(2))
  t.is(totalPaid, 0)
})

test('should update delivery info order', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = {
    id: OPEN_ORDER._id,
    input: {
      delivery: {
        method: 'delivery',
        address: {
          _id: '5e79f47d831fdd006b6e8e9d',
          street: 'Rua Benedito Caim',
          number: '92',
          complement: 'apto 01',
          district: 'Vila Mariana',
          city: 'São Paulo',
          state: 'SP',
          postalCode: '04121-070'
        }
      }
    }
  }

  const response = await mutate(UPDATE_ORDER, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)

  const { status, delivery, total, subtotal, totalPaid } = response.data.updateOrder
  const {
    address: { __typename, ...addressData },
    fee
  } = delivery

  const { _id, ...data } = variables.input.delivery.address

  t.is(status, OrderStatus.OPEN)
  t.is(total, 100)
  t.is(subtotal, 100)
  t.is(totalPaid, 0)
  t.deepEqual(addressData, data)
  t.is(fee, 0.0)
})

test('should update order and set delivery fee to 0.0 if user dont have address and rules setup', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = {
    id: OPEN_ORDER._id,
    input: {
      delivery: {
        method: 'delivery',
        address: {
          _id: '5e79f47d831fdd006b6e8e9d',
          street: 'Rua Benedito Caim',
          number: '92',
          complement: 'apto 01',
          district: 'Vila Mariana',
          city: 'São Paulo',
          state: 'SP',
          postalCode: '04121-070'
        }
      }
    }
  }

  const response = await mutate(UPDATE_ORDER, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)

  const { status, delivery, total, subtotal, totalPaid } = response.data.updateOrder
  const {
    address: { __typename, ...addressData },
    fee
  } = delivery

  const { _id, ...data } = variables.input.delivery.address

  t.is(status, OrderStatus.OPEN)
  t.is(total, 100)
  t.is(subtotal, 100)
  t.is(totalPaid, 0)
  t.deepEqual(addressData, data)
  t.is(fee, 0.0)
})

test('should update order and calculate delivery fee if user has address and rules setup', async (t) => {
  const { user, company } = await userGenerator({
    address: {
      street: 'Rua Benedito Caim',
      number: '92',
      complement: 'Apto 1',
      district: 'Vila Mariana',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '04121-070'
    },
    settings: {
      delivery: [
        {
          fee: 3.5,
          condition: Conditions.LESS_THAN,
          distance: 3
        },
        {
          fee: 10.99,
          condition: Conditions.GREATER_THAN,
          distance: 3
        }
      ]
    }
  })

  await Order.update(
    { _id: OPEN_ORDER._id },
    { $set: { company: company._id, createdBy: user._id } }
  )

  const headers = { Authorization: generateToken({ userId: user._id, companyId: company._id }) }

  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = {
    id: OPEN_ORDER._id,
    input: {
      delivery: {
        method: 'delivery',
        fee: 3.5,
        address: {
          _id: '5e79f47d831fdd006b6e8e9d',
          street: 'Rua Benedito Caim',
          number: '92',
          complement: 'apto 01',
          district: 'Vila Mariana',
          city: 'São Paulo',
          state: 'SP',
          postalCode: '04121-070'
        }
      }
    }
  }

  const response = await mutate(UPDATE_ORDER, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)

  const { status, delivery, total, subtotal, totalPaid } = response.data.updateOrder
  const {
    address: { __typename, ...addressData },
    fee
  } = delivery

  const { _id, ...data } = variables.input.delivery.address

  t.is(status, OrderStatus.OPEN)
  t.is(total, 103.5)
  t.is(subtotal, 100)
  t.is(totalPaid, 0)
  t.deepEqual(addressData, data)
  t.is(fee, 3.5)
})
