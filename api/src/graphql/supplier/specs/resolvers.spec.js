import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'

import { apolloServer } from 'src/apolloServer'

import { User, Supplier } from 'src/models'

import { GET_SUPPLIERS } from 'src/graphql/supplier/specs/gql'

import { GET_SUPPLIERS_INPUT } from 'src/test/common/payloads/suppliers'
import { supplierGenerator, userGenerator } from 'src/test/utils/generators'

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
  await Supplier.deleteMany({})

  await setUserAndCompany()
  headers = { Authorization: generateToken({ userId: user._id, companyId: company._id }) }
})

test.afterEach(async (t) => {
  await Supplier.deleteMany({})
})

test.after(async (t) => {
  await User.deleteMany({})
  await Supplier.deleteMany({})
})

test.skip('should query suppliers for a given user with max length allowed per page', async (t) => {
  const { query } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const totalItems = 51
  await Supplier.insertMany(supplierGenerator(user._id.toString(), totalItems))

  const variables = { input: GET_SUPPLIERS_INPUT }
  const response = await query(GET_SUPPLIERS, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.suppliers, undefined)
  t.not(response.data.suppliers.suppliers, undefined)
  t.is(response.data.suppliers.suppliers.length, MAX_PAGINATION_LIMIT)
  t.not(response.data.suppliers.pagination, undefined)
  t.is(response.data.suppliers.pagination.page, GET_SUPPLIERS_INPUT.pagination.skip)
  t.is(response.data.suppliers.pagination.offset, MAX_PAGINATION_LIMIT)
  t.not(response.data.suppliers.pagination.totalPages, undefined)
  t.not(response.data.suppliers.pagination.totalItems, undefined)
})

test.skip('should query suppliers with default pagination', async (t) => {
  const { query } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const totalItems = 10
  await Supplier.insertMany(supplierGenerator(user._id.toString(), totalItems))

  const response = await query(GET_SUPPLIERS)

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.suppliers, undefined)
  t.not(response.data.suppliers.suppliers, undefined)
  t.is(response.data.suppliers.suppliers.length, PAGINATION_FIRST_DEFAULT)
  t.not(response.data.suppliers.pagination, undefined)
  t.is(response.data.suppliers.pagination.page, PAGINATION_SKIP_DEFAULT)
  t.is(response.data.suppliers.pagination.offset, PAGINATION_FIRST_DEFAULT)
  t.not(response.data.suppliers.pagination.totalPages, undefined)
  t.not(response.data.suppliers.pagination.totalItems, undefined)
})
