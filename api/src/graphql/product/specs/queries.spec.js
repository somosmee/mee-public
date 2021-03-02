import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'

import { apolloServer } from 'src/apolloServer'

import { Company, User, Product, UserProduct } from 'src/models'

import { GET_PRODUCTS } from 'src/graphql/product/specs/gql'

import { GET_PRODUCTS_INPUT } from 'src/test/common/payloads/products'
import { productGenerator, userProductGenerator, userGenerator } from 'src/test/utils/generators'

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

test.beforeEach(async (t) => {
  await Company.deleteMany({})
  await User.deleteMany({})
  await Product.deleteMany({})
  await UserProduct.deleteMany({})

  await setUserAndCompany()
  headers = { Authorization: generateToken({ userId: user._id, companyId: company._id }) }
})

test.afterEach.always(async (t) => {
  await User.deleteMany({})
  await Product.deleteMany({})
  await UserProduct.deleteMany({})
})

test.todo('should query product by gtin')

test('should query products for a given user with max length allowed per page', async (t) => {
  const { query } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const totalItems = 51
  const products = await Product.insertMany(productGenerator(totalItems))

  const userProducts = userProductGenerator(user._id.toString(), company._id.toString(), products)
  await UserProduct.insertMany(userProducts)

  const variables = { input: GET_PRODUCTS_INPUT }
  const response = await query(GET_PRODUCTS, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.products, undefined)
  t.not(response.data.products.products, undefined)
  t.is(response.data.products.products.length, MAX_PAGINATION_LIMIT)
  t.not(response.data.products.pagination, undefined)
  t.is(response.data.products.pagination.page, GET_PRODUCTS_INPUT.pagination.skip)
  t.is(response.data.products.pagination.offset, MAX_PAGINATION_LIMIT)
  t.not(response.data.products.pagination.totalPages, undefined)
  t.not(response.data.products.pagination.totalItems, undefined)
})

test('should query products with default pagination', async (t) => {
  const { query } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const totalItems = 10
  const products = await Product.insertMany(productGenerator(totalItems))

  const userProducts = userProductGenerator(user._id.toString(), company._id.toString(), products)
  await UserProduct.insertMany(userProducts)

  const response = await query(GET_PRODUCTS)

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.products, undefined)
  t.not(response.data.products.products, undefined)
  t.not(response.data.products.products.length, undefined)
  t.not(response.data.products.pagination, undefined)
  t.is(response.data.products.products.length, PAGINATION_FIRST_DEFAULT)
  t.is(response.data.products.pagination.page, PAGINATION_SKIP_DEFAULT)
  t.is(response.data.products.pagination.offset, PAGINATION_FIRST_DEFAULT)
  t.not(response.data.products.pagination.totalPages, undefined)
  t.not(response.data.products.pagination.totalItems, undefined)
})

test('should query products with default pagination if skip is null', async (t) => {
  const { query } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const totalItems = 100
  const products = await Product.insertMany(productGenerator(totalItems))

  const userProducts = userProductGenerator(user._id.toString(), company._id.toString(), products)
  await UserProduct.insertMany(userProducts)

  const response = await query(GET_PRODUCTS, {
    variables: {
      input: {
        pagination: {
          skip: null
        }
      }
    }
  })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.products, undefined)
  t.not(response.data.products.products, undefined)
  t.not(response.data.products.products.length, undefined)
  t.not(response.data.products.pagination, undefined)
  t.is(response.data.products.products.length, PAGINATION_FIRST_DEFAULT)
  t.is(response.data.products.pagination.page, PAGINATION_SKIP_DEFAULT)
  t.is(response.data.products.pagination.offset, PAGINATION_FIRST_DEFAULT)
  t.not(response.data.products.pagination.totalPages, undefined)
  t.not(response.data.products.pagination.totalItems, undefined)
})
