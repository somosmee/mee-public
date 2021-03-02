import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'

import { apolloServer } from 'src/apolloServer'

import { User, Customer } from 'src/models'

import { GET_CUSTOMERS } from 'src/graphql/customer/specs/gql'

import { GET_CUSTOMERS_INPUT } from 'src/test/common/payloads/customers'
import { customerGenerator, userGenerator } from 'src/test/utils/generators'

import {
  MAX_PAGINATION_LIMIT,
  PAGINATION_FIRST_DEFAULT,
  PAGINATION_SKIP_DEFAULT
} from 'src/utils/constants'
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
  await User.deleteMany({})
  await Customer.deleteMany({})

  await setUserAndCompany()
  headers = { Authorization: generateToken({ userId: user._id, companyId: company._id }) }
})

test.afterEach(async (t) => {
  await Customer.deleteMany({})
})

test.after(async (t) => {
  await User.deleteMany({})
  await Customer.deleteMany({})
})

test('should query customers for a given user with max length allowed per page', async (t) => {
  const { query } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const totalItems = 51
  await Customer.insertMany(
    customerGenerator(user._id.toString(), company._id.toString(), totalItems)
  )

  const variables = { input: GET_CUSTOMERS_INPUT }
  const response = await query(GET_CUSTOMERS, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.customers, undefined)
  t.not(response.data.customers.customers, undefined)
  t.is(response.data.customers.customers.length, MAX_PAGINATION_LIMIT)
  t.not(response.data.customers.pagination, undefined)
  t.is(response.data.customers.pagination.page, GET_CUSTOMERS_INPUT.pagination.skip)
  t.is(response.data.customers.pagination.offset, MAX_PAGINATION_LIMIT)
  t.not(response.data.customers.pagination.totalPages, undefined)
  t.not(response.data.customers.pagination.totalItems, undefined)
})

test('should query customers with default pagination', async (t) => {
  const { query } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const totalItems = 10
  await Customer.insertMany(
    customerGenerator(user._id.toString(), company._id.toString(), totalItems)
  )

  const response = await query(GET_CUSTOMERS)

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.customers, undefined)
  t.not(response.data.customers.customers, undefined)
  t.is(response.data.customers.customers.length, PAGINATION_FIRST_DEFAULT)
  t.not(response.data.customers.pagination, undefined)
  t.is(response.data.customers.pagination.page, PAGINATION_SKIP_DEFAULT)
  t.is(response.data.customers.pagination.offset, PAGINATION_FIRST_DEFAULT)
  t.not(response.data.customers.pagination.totalPages, undefined)
  t.not(response.data.customers.pagination.totalItems, undefined)
})

test.todo('should update an order invoice')
