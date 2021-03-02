import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'
import moment from 'moment'

import { apolloServer } from 'src/apolloServer'

import { User, Purchase, Product, Supplier, UserProduct, FinancialStatement } from 'src/models'

import { GET_PURCHASES, ADD_MANUAL_PURCHASE } from 'src/graphql/purchase/specs/gql'

import {
  PRODUCT_1,
  PRODUCT_2,
  PRODUCT_3,
  USER_PRODUCT_1,
  USER_PRODUCT_2,
  USER_PRODUCT_3
} from 'src/test/common/payloads/products'
import { GET_PURCHASES_INPUT } from 'src/test/common/payloads/purchases'
import { SUPPLIER } from 'src/test/common/payloads/suppliers'
import { purchaseGenerator, userGenerator } from 'src/test/utils/generators'

import {
  MAX_PAGINATION_LIMIT,
  PAGINATION_FIRST_DEFAULT,
  PAGINATION_SKIP_DEFAULT
} from 'src/utils/constants'
import { ExpenseCategories, FinancialOperations } from 'src/utils/enums'
import { generateToken } from 'src/utils/token'

let headers = null
let user = null
let company = null
let supplier = null

const setUserAndCompany = async () => {
  const { user: newUser, company: newCompany } = await userGenerator()
  user = newUser
  company = newCompany
}

test.before(async (t) => {
  await User.deleteMany({})
  await Purchase.deleteMany({})
  await Product.deleteMany({})
  await UserProduct.deleteMany({})
  await Supplier.deleteMany({})
  await FinancialStatement.deleteMany({})

  await setUserAndCompany()
  headers = { Authorization: generateToken({ userId: user._id, companyId: company._id }) }

  await new Product(PRODUCT_1).save()
  await new Product(PRODUCT_2).save()
  await new Product(PRODUCT_3).save()
  await new UserProduct({ ...USER_PRODUCT_1, company: company._id, createdBy: user._id }).save()
  await new UserProduct({ ...USER_PRODUCT_2, company: company._id, createdBy: user._id }).save()
  await new UserProduct({ ...USER_PRODUCT_3, company: company._id, createdBy: user._id }).save()
  supplier = await new Supplier({ ...SUPPLIER, company: company._id, createdBy: user._id }).save()
})

test.afterEach(async (t) => {
  await Purchase.deleteMany({})
  await FinancialStatement.deleteMany({})
})

test.after(async (t) => {
  await User.deleteMany({})
  await Purchase.deleteMany({})
  await Product.deleteMany({})
  await UserProduct.deleteMany({})
  await Supplier.deleteMany({})
  await FinancialStatement.deleteMany({})
})

test.skip('should query purchases for a given user with max length allowed per page', async (t) => {
  const { query } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const totalItems = 51
  await Purchase.insertMany(
    purchaseGenerator(user._id.toString(), company._id.toString(), totalItems)
  )

  const variables = { input: GET_PURCHASES_INPUT }
  const response = await query(GET_PURCHASES, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.purchases, undefined)
  t.not(response.data.purchases.purchases, undefined)
  t.is(response.data.purchases.purchases.length, MAX_PAGINATION_LIMIT)
  t.not(response.data.purchases.pagination, undefined)
  t.is(response.data.purchases.pagination.page, GET_PURCHASES_INPUT.pagination.skip)
  t.is(response.data.purchases.pagination.offset, MAX_PAGINATION_LIMIT)
  t.not(response.data.purchases.pagination.totalPages, undefined)
  t.not(response.data.purchases.pagination.totalItems, undefined)
})

test.skip('should query purchases with default pagination', async (t) => {
  const { query } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const totalItems = 10
  await Purchase.insertMany(
    purchaseGenerator(user._id.toString(), company._id.toString(), totalItems)
  )

  const response = await query(GET_PURCHASES)

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.purchases, undefined)
  t.not(response.data.purchases.purchases, undefined)
  t.is(response.data.purchases.purchases.length, PAGINATION_FIRST_DEFAULT)
  t.not(response.data.purchases.pagination, undefined)
  t.is(response.data.purchases.pagination.page, PAGINATION_SKIP_DEFAULT)
  t.is(response.data.purchases.pagination.offset, PAGINATION_FIRST_DEFAULT)
  t.not(response.data.purchases.pagination.totalPages, undefined)
  t.not(response.data.purchases.pagination.totalItems, undefined)
})

test('should create manual purchase with valid payload', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = {
    input: {
      supplier: supplier._id.toString(),
      items: [
        {
          product: PRODUCT_1._id,
          gtin: PRODUCT_1.gtin,
          name: PRODUCT_1.name,
          unitPrice: USER_PRODUCT_1.price,
          totalPrice: USER_PRODUCT_1.price * 1,
          measurement: PRODUCT_1.measurement,
          ncm: PRODUCT_1.ncm,
          quantity: 1
        },
        {
          product: PRODUCT_2._id,
          gtin: PRODUCT_2.gtin,
          name: PRODUCT_2.name,
          unitPrice: USER_PRODUCT_2.price,
          totalPrice: USER_PRODUCT_2.price * 1,
          measurement: PRODUCT_2.measurement,
          ncm: PRODUCT_2.ncm,
          quantity: 1
        },
        {
          product: PRODUCT_3._id,
          gtin: PRODUCT_3.gtin,
          name: PRODUCT_3.name,
          unitPrice: USER_PRODUCT_3.price,
          totalPrice: USER_PRODUCT_3.price * 1,
          measurement: PRODUCT_3.measurement,
          ncm: PRODUCT_3.ncm,
          quantity: 1
        }
      ]
    }
  }

  const response = await mutate(ADD_MANUAL_PURCHASE, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)

  const { addManualPurchase } = response.data

  t.is(addManualPurchase.items.length, 3)
  t.is(addManualPurchase.supplier._id, variables.input.supplier)
  t.is(addManualPurchase.company._id, company._id.toString())

  // check expense financial statement
  const statements = await FinancialStatement.find({ company: company._id })

  t.is(statements.length, 1)

  const [firstIncome] = statements

  t.is(moment(firstIncome.dueAt).format('DD/MM/YYYY'), moment().format('DD/MM/YYYY'))
  t.is(firstIncome.paid, true)
  t.is(firstIncome.company.toString(), company._id.toString())
  t.is(firstIncome.operation, FinancialOperations.EXPENSE)
  t.is(firstIncome.purchase.toString(), addManualPurchase._id.toString())
  t.is(firstIncome.category.toString(), ExpenseCategories.INVENTORY_PURCHASE.toString())
  t.is(firstIncome.description, `compra realizada no ${supplier.displayName}`)
  t.is(firstIncome.value, -addManualPurchase.total)
})
