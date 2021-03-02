import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'

import { apolloServer } from 'src/apolloServer'

import { Company, User, Order, Product } from 'src/models'

import {
  TOGGLE_OPEN_STATUS,
  UPDATE_IFOOD_CREDENTIALS,
  GET_MY_COMPANY,
  CONFIRM_IFOOD_ORDER
} from 'src/graphql/ifood/specs/gql'

import { ifood } from 'src/test/common/mocks'
import { IFOOD_CREDENTIALS } from 'src/test/common/payloads/ifood'
import { ORDER } from 'src/test/common/payloads/orders'
import { PRODUCT_INTERNAL } from 'src/test/common/payloads/products'
import { userGenerator } from 'src/test/utils/generators'

import { SalesInvoiceStatus } from 'src/utils/enums'
import { generateToken } from 'src/utils/token'

let headers = null
let user = null
let company = null

const setUserAndCompany = async () => {
  const { user: newUser, company: newCompany } = await userGenerator()
  user = newUser
  company = newCompany
}

test.before(async (t) => {
  await Company.deleteMany({})
  await User.deleteMany({})
  await Order.deleteMany({})
  await Product.deleteMany({})

  await setUserAndCompany()
  headers = { Authorization: generateToken({ userId: user._id, companyId: company._id }) }

  await new Order({ ...ORDER, company: company._id, createdBy: user._id }).save()
  await new Product(PRODUCT_INTERNAL).save()
})

test.after(async (t) => {
  await Company.deleteMany({})
  await User.deleteMany({})
  await Order.deleteMany({})
  await Product.deleteMany({})
})

test('should throw error if ifood credentials is not filled when toggle status', async (t) => {
  const { mutate } = createTestClient({
    apolloServer,
    extendMockRequest: { headers }
  })

  const variables = { input: { open: true } }
  const response = await mutate(TOGGLE_OPEN_STATUS, { variables })

  t.not(response.errors, undefined)
})

test('should update ifood credentials', async (t) => {
  const { mutate } = createTestClient({
    apolloServer,
    extendMockRequest: { headers }
  })

  const variables = { input: IFOOD_CREDENTIALS }
  const response = await mutate(UPDATE_IFOOD_CREDENTIALS, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.updateIfoodCredentials, undefined)
  t.is(response.data.updateIfoodCredentials._id, company._id.toString())
  t.not(response.data.updateIfoodCredentials.ifood, undefined)
  t.is(response.data.updateIfoodCredentials.ifood.merchant, IFOOD_CREDENTIALS.merchant)
  t.is(response.data.updateIfoodCredentials.ifood.username, IFOOD_CREDENTIALS.username)
  t.is(response.data.updateIfoodCredentials.ifood.password, IFOOD_CREDENTIALS.password)
})

test('should toggle merchant`s status after update credentials', async (t) => {
  const { mutate } = createTestClient({
    apolloServer,
    extendMockRequest: { headers }
  })

  const variables = { input: { open: true } }
  const response = await mutate(TOGGLE_OPEN_STATUS, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.toggleOpenStatus, undefined)
  t.is(response.data.toggleOpenStatus._id, company._id.toString())
  t.not(response.data.toggleOpenStatus.ifood, undefined)
  t.is(response.data.toggleOpenStatus.ifood.open, true)
})

test('should get ifood status and credentials', async (t) => {
  const { query, mutate } = createTestClient({
    apolloServer,
    extendMockRequest: { headers }
  })

  const variables = { input: IFOOD_CREDENTIALS }
  await mutate(UPDATE_IFOOD_CREDENTIALS, { variables })

  const response = await query(GET_MY_COMPANY)

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.myCompany, undefined)
  t.is(response.data.myCompany._id, company._id.toString())
  t.not(response.data.myCompany.ifood, undefined)
  t.not(response.data.myCompany.ifood.open, undefined)
  t.is(response.data.myCompany.ifood.merchant, IFOOD_CREDENTIALS.merchant)
  t.is(response.data.myCompany.ifood.username, IFOOD_CREDENTIALS.username)
  t.is(response.data.myCompany.ifood.password, IFOOD_CREDENTIALS.password)
})

test('should confirm an ifood order', async (t) => {
  const mockedSubscribe = ifood.mockIfood(1, 'post', { statusCode: 200 })

  const { mutate } = createTestClient({
    apolloServer,
    extendMockRequest: { headers }
  })

  const variables = { input: { id: ORDER._id } }
  const response = await mutate(CONFIRM_IFOOD_ORDER, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.confirmIfoodOrder, undefined)
  t.is(response.data.confirmIfoodOrder._id, ORDER._id.toString())

  mockedSubscribe.verify()

  mockedSubscribe.restore()
})

// This business logic is disabled right now
test.skip('should confirm ifood order and send NFe info to SAT', async (t) => {
  const mockedSubscribe = ifood.mockIfood(1, 'post', { statusCode: 200 })

  const { mutate } = createTestClient({
    apolloServer,
    extendMockRequest: { headers }
  })

  const variables = { input: { id: ORDER._id } }
  const response = await mutate(CONFIRM_IFOOD_ORDER, { variables })

  mockedSubscribe.verify()

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.confirmIfoodOrder, undefined)
  t.is(response.data.confirmIfoodOrder._id, ORDER._id.toString())

  // check if we are generating invoice data to send to SAT
  const order = await Order.findOne({ _id: ORDER._id })
  t.not(order, null)
  t.not(order.invoice, undefined)
  t.is(order.invoice.status, SalesInvoiceStatus.PENDING)
  t.not(order.invoice.dataJS, undefined)
  t.not(order.invoice.dataXML, undefined)

  mockedSubscribe.restore()
})
