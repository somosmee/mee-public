import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'

import { apolloServer } from 'src/apolloServer'

import { User, Product, UserProduct } from 'src/models'

import { PRODUCT_1, USER_PRODUCT_1 } from 'src/test/common/payloads/products'
import { USER } from 'src/test/common/payloads/users'
import { userGenerator } from 'src/test/utils/generators'

import { generateToken } from 'src/utils/token'

import { GET_SHOPPFRONTS, GET_SHOPPFRONT } from './gql'

let headers = null
let user = null
let company = null

const setUserAndCompany = async () => {
  const { user: newUser, company: newCompany } = await userGenerator()
  user = newUser
  company = newCompany
}

test.beforeEach(async (t) => {
  await User.deleteMany({})
  await Product.deleteMany({})
  await UserProduct.deleteMany({})

  await setUserAndCompany()
  headers = { Authorization: generateToken({ userId: user._id, companyId: company._id }) }

  await new Product(PRODUCT_1).save()
  await new UserProduct({ ...USER_PRODUCT_1, company: company._id, createdBy: user._id }).save()
})

test.afterEach(async (t) => {
  await User.deleteMany({})
  await Product.deleteMany({})
  await UserProduct.deleteMany({})
})

test.skip('should query shopfront on public mode', async (t) => {
  const { query } = createTestClient({ apolloServer })

  const variables = {
    id: USER.shopfront._id
  }

  const response = await query(GET_SHOPPFRONTS, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)

  t.is(response.data.shopfronts._id, USER.shopfront._id)
  t.is(response.data.shopfronts.merchant, USER._id)
  t.is(response.data.shopfronts.products[0]._id, PRODUCT_1._id)
  t.is(response.data.shopfronts.products[0].name, PRODUCT_1.name)
  t.is(response.data.shopfronts.products[0].price, USER_PRODUCT_1.price)
})

test.skip('should query shopfront on private mode', async (t) => {
  const { query } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = {
    id: USER.shopfront._id
  }

  const response = await query(GET_SHOPPFRONT, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.is(response.data.shopfront._id, USER.shopfront._id)
  t.is(response.data.shopfront.merchant, USER._id)
  t.is(response.data.shopfront.products[0]._id, PRODUCT_1._id)
  t.is(response.data.shopfront.products[0].name, PRODUCT_1.name)
  t.is(response.data.shopfront.products[0].price, USER_PRODUCT_1.price)
})

test.todo('should add product to shopfront')
test.todo('should remove product from shopfront')
test.todo('should create delivery shopfront order')
test.todo('should create take out shopfront order')
test.todo('should create in place shopfront order')
test.todo('should create shopfront order with CPF')
test.todo('should create shopfront order with payment in cash')
test.todo('should create shopfront order with payment in debit')
test.todo('should create shopfront order with payment in credit')
test.todo('should create shopfront order with payment in voucher')
test.todo('should create shopfront order and create customer and address')
