import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'
import moment from 'moment'

import { enviarDadosVendaSuccess } from 'src/SAT/specs/payload'

import { apolloServer } from 'src/apolloServer'

import { Company, User, Customer, Product, UserProduct, Inventory, Order } from 'src/models'

import {
  CREATE_ORDER,
  GET_ORDERS,
  ADD_PAYMENT,
  CLOSE_ORDER,
  CANCEL_ORDER,
  UPDATE_ORDER_INVOICE
} from 'src/graphql/order/specs/gql'

import { OPEN_ORDER, CLOSED_ORDER, INVENTORY } from 'src/test/common/payloads/orders'
import {
  PRODUCT_1,
  PRODUCT_2,
  PRODUCT_3,
  PRODUCT_4,
  USER_PRODUCT_1,
  USER_PRODUCT_2,
  USER_PRODUCT_3,
  USER_PRODUCT_4
} from 'src/test/common/payloads/products'
import { orderGenerator, userGenerator } from 'src/test/utils/generators'
import { createOrderMutation } from 'src/test/utils/mutations'

import { Reasons, OrderStatus, SalesInvoiceStatus } from 'src/utils/enums'
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

test('should create order and move inventory', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const { response, variables } = await createOrderMutation(mutate)

  t.is(response.errors, undefined)
  t.not(response.data, null)

  const { status, total, subtotal, totalPaid, shortID } = response.data.createOrder

  t.is(status, OrderStatus.OPEN)
  t.not(shortID, null)
  t.is(total, 139.68)
  t.is(subtotal, 139.68)
  t.is(totalPaid, 0)

  /* CHECK DATABASE */
  for (const item of variables.input.items) {
    const lastMovement = await Inventory.findOne({
      company: company._id,
      product: item.product
    }).sort({ createdAt: -1 })

    t.not(lastMovement, null)
    t.is(lastMovement.quantity, -item.quantity)
    t.is(lastMovement.product.toString(), item.product.toString())
    t.is(lastMovement.reason, Reasons.SALE)
    t.is(lastMovement.balance, -item.quantity)
    t.is(lastMovement.company.toString(), company._id.toString())
    t.not(lastMovement.createdAt, null)
    t.not(lastMovement.updatedAt, null)
  }
})

test('should create order and move inventory with bundle', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const gtin = await Product.getNextGTIN(company)

  await new Product({ ...PRODUCT_4, gtin }).save()
  await new UserProduct({ ...USER_PRODUCT_4, company: company._id, createdBy: user._id }).save()

  const variables = {
    input: {
      items: [
        {
          product: PRODUCT_4._id,
          gtin,
          name: PRODUCT_4.name,
          price: USER_PRODUCT_4.price,
          measurement: PRODUCT_4.measurement,
          quantity: 2
        }
      ]
    }
  }

  const response = await mutate(CREATE_ORDER, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)

  const { status, total, subtotal, totalPaid, shortID } = response.data.createOrder

  t.is(status, OrderStatus.OPEN)
  t.not(shortID, null)
  t.is(total, 24.6)
  t.is(subtotal, 24.6)
  t.is(totalPaid, 0)

  const [firstItem] = variables.input.items
  const lastMovement = await Inventory.findOne({
    company: company._id,
    product: firstItem.product
  }).sort({ createdAt: -1 })

  t.not(lastMovement, null)
  t.is(lastMovement.quantity, -firstItem.quantity)
  t.is(lastMovement.product.toString(), firstItem.product)
  t.is(lastMovement.reason, Reasons.SALE)
  t.is(lastMovement.balance, -firstItem.quantity)
  t.is(lastMovement.company.toString(), company._id.toString())

  const lastMovementFirstBundle = await Inventory.findOne({
    company: company._id,
    product: USER_PRODUCT_4.bundle[0].product
  }).sort({ createdAt: -1 })

  t.not(lastMovementFirstBundle, null)
  t.is(lastMovementFirstBundle.quantity, -(firstItem.quantity * USER_PRODUCT_4.bundle[0].quantity))
  t.is(lastMovementFirstBundle.product.toString(), USER_PRODUCT_4.bundle[0].product)
  t.is(lastMovementFirstBundle.reason, Reasons.SALE)
  t.is(lastMovementFirstBundle.balance, -(firstItem.quantity * USER_PRODUCT_4.bundle[0].quantity))
  t.is(lastMovementFirstBundle.company.toString(), company._id.toString())

  const lastMovementSecondBundle = await Inventory.findOne({
    company: company._id,
    product: USER_PRODUCT_4.bundle[1].product
  }).sort({ createdAt: -1 })
  t.not(lastMovementSecondBundle, null)
  t.is(lastMovementSecondBundle.quantity, -(firstItem.quantity * USER_PRODUCT_4.bundle[1].quantity))
  t.is(lastMovementSecondBundle.product.toString(), USER_PRODUCT_4.bundle[1].product)
  t.is(lastMovementSecondBundle.reason, Reasons.SALE)
  t.is(lastMovementSecondBundle.balance, -(firstItem.quantity * USER_PRODUCT_4.bundle[1].quantity))
  t.is(lastMovementSecondBundle.company.toString(), company._id.toString())
})

test.todo('should add item to order')

test.todo('should delete item to order')

test('should add full payment and close order', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = {
    id: OPEN_ORDER._id,
    input: {
      method: 'cash',
      value: 100,
      received: 100
    }
  }

  const response = await mutate(ADD_PAYMENT, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)

  const { status, total, subtotal, totalPaid } = response.data.addPayment

  t.is(status, OrderStatus.CLOSED)
  t.is(total, 100)
  t.is(subtotal, 100)
  t.is(totalPaid, 100)
})

test('should add payment and order status go to PARTIALLY_PAID', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = {
    id: OPEN_ORDER._id,
    input: {
      method: 'cash',
      value: 5,
      received: 5
    }
  }

  const response = await mutate(ADD_PAYMENT, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)

  const { status, total, subtotal, totalPaid } = response.data.addPayment

  t.is(status, OrderStatus.PARTIALLY_PAID)
  t.is(total, 100)
  t.is(subtotal, 100)
  t.is(totalPaid, 5)
})

test.todo('should throw error if close order with invalid status')

test.todo('should cancel an open order')

test.todo('should cancel a closed order')

test('should cancel a closed order by return and increase product balance in inventory', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  await new Inventory({ ...INVENTORY, company: company._id, createdBy: user._id }).save()

  const variables = { input: { id: CLOSED_ORDER._id } }
  const response = await mutate(CANCEL_ORDER, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)

  /* CHECK DATABASE */
  for (const item of CLOSED_ORDER.items) {
    const lastMovement = await Inventory.findOne({
      company: company._id,
      product: item.product
    }).sort({ createdAt: -1 })

    t.not(lastMovement, null)
    t.is(lastMovement.quantity, item.quantity)
    t.is(lastMovement.product.toString(), item.product.toString())
    t.is(lastMovement.reason, Reasons.RETURN)
    t.is(lastMovement.balance, INVENTORY.quantity + item.quantity)
    t.is(lastMovement.company.toString(), company._id.toString())
    t.not(lastMovement.createdAt, null)
    t.not(lastMovement.updatedAt, null)
  }
})

test.todo('should throw error if cancel order with invalid status')

test.todo('should query an order for a given user')

test('should query orders for a given filter input', async (t) => {
  const { query } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  await Order.insertMany(
    orderGenerator(company._id.toString(), user._id.toString(), 10, OrderStatus.OPEN)
  )
  await Order.insertMany(
    orderGenerator(company._id.toString(), user._id.toString(), 10, OrderStatus.CLOSED)
  )
  await Order.insertMany(
    orderGenerator(company._id.toString(), user._id.toString(), 10, OrderStatus.CANCELED)
  )

  const start = moment()
    .startOf('day')
    .toISOString()
  const end = moment()
    .endOf('day')
    .toISOString()

  const input = { filter: { first: 0, skip: 0, start, end } }
  const response = await query(GET_ORDERS, { variables: { input } })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.orders, undefined)
  t.not(response.data.orders.orders, undefined)
  t.not(response.data.orders.orders.length, 32)
  t.deepEqual(
    response.data.orders.orders.every((order) => {
      return moment(order.createdAt).isBetween(start, end)
    }),
    true
  )
  t.deepEqual(
    response.data.orders.orders.every((order) => {
      return [OrderStatus.OPEN, OrderStatus.CLOSED, OrderStatus.CANCELED].includes(order.status)
    }),
    true
  )
  t.not(response.data.orders.pagination, undefined)
  t.is(response.data.orders.pagination.page, 0)
  t.is(response.data.orders.pagination.offset, 0)
  t.is(response.data.orders.pagination.totalPages, 1)
  t.is(response.data.orders.pagination.totalItems, 30)
})

test('should query orders with customer information', async (t) => {
  const { query } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const customer = new Customer({
    company: company._id,
    createdBy: user._id,
    mobile: '92981233668',
    firstName: 'Guilherme',
    lastName: 'Kodama'
  })
  await customer.save()

  const order = new Order({
    company: company._id,
    createdBy: user._id,
    customer: customer._id,
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
    status: 'open',
    total: 20,
    subtotal: 20,
    totalPaid: 20
  })
  await order.save()

  const response = await query(GET_ORDERS)

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.orders, undefined)
  t.not(response.data.orders.orders, undefined)
  t.is(response.data.orders.orders.length, 3)

  const [firstOrder] = response.data.orders.orders
  t.is(firstOrder.customer._id, customer._id.toString())
  t.is(firstOrder.customer.mobile, customer.mobile)
  t.is(firstOrder.customer.firstName, customer.firstName)
  t.is(firstOrder.customer.lastName, customer.lastName)
})

test('should close order by sale and decrease product balance in inventory', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = { id: OPEN_ORDER._id }
  const response = await mutate(CLOSE_ORDER, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
})

test('should parse SAT response and save CFeSAT attributes', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = {
    id: OPEN_ORDER._id,
    status: SalesInvoiceStatus.SUCCESS,
    message: enviarDadosVendaSuccess
  }

  const response = await mutate(UPDATE_ORDER_INVOICE, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.updateOrderInvoice, null)

  const { invoice } = response.data.updateOrderInvoice
  t.is(invoice.accessKey, 'CFe35200327412532000192590006956290000228323407')
  t.is(
    invoice.QRCode,
    'Bm8qXRd1Ls9cMWcuajWZxBUk3zWIiQUX8dAJcOFXgmfT34KSQyzsxVbfmCuG/x7JF+hCE9V77XzRk55Yg8uIKNrP7HhJ8UUrLLahOuI+v/3D4lV4MSfgNv+0Vdr0mi9xbHFihyaE9kaYtitjJzsNyUtNJd5Az2kKz8l9X+9DZO6hc2xJ5il0YnUjlnfVXAnhzEUST8d7RJAdpMwwljSQuKBIENT6gnYBZ0fuIEXoLAdoiEUcFa+wb+XKyFDrsNXjPXRokbqbr6lTnyGj+J2uleugNDVcGZaWKRrFIeAw8lR5GKgCZU2JFVuIwM4e/+o5s8mH+qQgmW/k6m100O5a6Q=='
  )
})

test.todo('should update an order invoice')

// inventory
test.todo('should decrease balance on order update')
test.todo('should increase balance on order update')
test.todo('should decrease balance when add item to existing order')
test.todo('should increase balance when remove item to existing order')
