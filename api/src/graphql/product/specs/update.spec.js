import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'

import { apolloServer } from 'src/apolloServer'

import { Company, User, Product, UserProduct } from 'src/models'

import { UPDATE_PRODUCT } from 'src/graphql/product/specs/gql'

import {
  PRODUCT_1,
  PRODUCT_2,
  PRODUCT_3,
  USER_PRODUCT_1,
  USER_PRODUCT_2,
  USER_PRODUCT_3
} from 'src/test/common/payloads/products'
import { userGenerator } from 'src/test/utils/generators'

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
  await new Product(PRODUCT_1).save()
  await new Product(PRODUCT_2).save()
  await new Product(PRODUCT_3).save()
  await new UserProduct({ ...USER_PRODUCT_1, company: company._id, createdBy: user._id }).save()
  await new UserProduct({ ...USER_PRODUCT_2, company: company._id, createdBy: user._id }).save()
  await new UserProduct({ ...USER_PRODUCT_3, company: company._id, createdBy: user._id }).save()

  headers = { Authorization: generateToken({ userId: user._id, companyId: company._id }) }
})

test.afterEach.always(async (t) => {
  await Company.deleteMany({})
  await User.deleteMany({})
  await Product.deleteMany({})
  await UserProduct.deleteMany({})
})

test('should update an internal product', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const input = {
    product: PRODUCT_1._id,
    name: 'Product Test Updated',
    price: 65.69
  }

  const variables = { input }
  /* CHECK GRAPQHL RESPONSE */
  const response = await mutate(UPDATE_PRODUCT, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.updateProduct, undefined)
  t.is(response.data.updateProduct.name, input.name.toLowerCase())
  t.not(response.data.updateProduct.balance, undefined)
  t.is(response.data.updateProduct.price, input.price)

  /* CHECK DATABASE */
  const userProduct = await UserProduct.findOne({ company: company._id, product: PRODUCT_1._id })

  t.not(userProduct, null)
  t.is(userProduct.price, input.price)
})

test('should update an external product', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const input = {
    product: PRODUCT_1._id.toString(),
    name: 'Product Test Updated',
    price: 65.69
  }

  const variables = { input }
  /* CHECK GRAPQHL RESPONSE */
  const response = await mutate(UPDATE_PRODUCT, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.updateProduct, undefined)
  t.is(response.data.updateProduct.name, input.name.toLowerCase())
  t.not(response.data.updateProduct.balance, undefined)
  t.is(response.data.updateProduct.price, input.price)

  /* CHECK DATABASE */
  const userProduct = await UserProduct.findOne({ company: company._id, product: PRODUCT_1._id })

  t.not(userProduct, null)
  t.is(userProduct.price, input.price)
})

/* BUNDLE */
test('should throw error if update a internal bundle product with invalid bundle id', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = {
    input: {
      product: PRODUCT_3._id,
      bundle: [
        { product: '123', quantity: 1 },
        { product: '321', quantity: 1 }
      ]
    }
  }
  const response = await mutate(UPDATE_PRODUCT, { variables })

  t.not(response.errors, null)
  t.is(response.data, null)
  t.is(response.errors[0].message, 'Id do produto 123 não é válido')
})

test('should throw error if update a internal product with bundle id not found', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = {
    input: {
      product: PRODUCT_3._id,
      bundle: [
        { product: USER_PRODUCT_1._id, quantity: 1 },
        { product: USER_PRODUCT_2._id, quantity: 1 }
      ]
    }
  }
  const response = await mutate(UPDATE_PRODUCT, { variables })

  t.not(response.errors, null)
  t.is(response.data, null)
  t.is(response.errors[0].message, `Produto ${USER_PRODUCT_1._id} não existe`)
})

test('should update an external product as bundle', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const input = {
    product: PRODUCT_1._id,
    name: 'coca cola ls 1l',
    price: 75.69,
    bundle: [
      { product: PRODUCT_2._id, quantity: 1 },
      { product: PRODUCT_3._id, quantity: 1 }
    ]
  }

  const variables = { input }
  const response = await mutate(UPDATE_PRODUCT, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.updateProduct, undefined)
  t.is(response.data.updateProduct.gtin, PRODUCT_1.gtin)
  t.is(response.data.updateProduct.name, input.name)
  t.is(response.data.updateProduct.balance, 0)
  t.is(response.data.updateProduct.price, input.price)
  t.is(response.data.updateProduct.measurement, PRODUCT_1.measurement)
  t.is(response.data.updateProduct.internal, PRODUCT_1.internal)
  t.not(response.data.updateProduct.bundle, null)
  t.is(response.data.updateProduct.bundle.length, 2)
  const [firstProduct, secondProduct] = response.data.updateProduct.bundle

  t.not(firstProduct, null)
  t.is(firstProduct.product, PRODUCT_2._id)
  t.is(firstProduct.quantity, variables.input.bundle[0].quantity)
  t.is(firstProduct.gtin, PRODUCT_2.gtin)
  t.is(firstProduct.name, USER_PRODUCT_2.name)

  t.not(secondProduct, null)
  t.is(secondProduct.product, PRODUCT_3._id)
  t.is(secondProduct.quantity, variables.input.bundle[1].quantity)
  t.is(secondProduct.gtin, PRODUCT_3.gtin)
  t.is(secondProduct.name, USER_PRODUCT_3.name)
})

test('should update an internal product as bundle', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const input = {
    product: PRODUCT_3._id,
    name: 'Product Test Updated',
    price: 65.69,
    bundle: [
      { product: PRODUCT_1._id, quantity: 1 },
      { product: PRODUCT_2._id, quantity: 1 }
    ]
  }

  const variables = { input }
  const response = await mutate(UPDATE_PRODUCT, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.updateProduct, undefined)
  t.is(response.data.updateProduct.name, input.name.toLowerCase())
  t.not(response.data.updateProduct.balance, undefined)
  t.is(response.data.updateProduct.price, input.price)

  t.not(response.data.updateProduct.bundle, null)
  t.is(response.data.updateProduct.bundle.length, 2)
  const [firstProduct, secondProduct] = response.data.updateProduct.bundle

  t.not(firstProduct, null)
  t.is(firstProduct.product, PRODUCT_1._id)
  t.is(firstProduct.quantity, variables.input.bundle[0].quantity)
  t.is(firstProduct.gtin, PRODUCT_1.gtin)
  t.is(firstProduct.name, USER_PRODUCT_1.name)

  t.not(secondProduct, null)
  t.is(secondProduct.product, PRODUCT_2._id)
  t.is(secondProduct.quantity, variables.input.bundle[1].quantity)
  t.is(secondProduct.gtin, PRODUCT_2.gtin)
  t.is(secondProduct.name, USER_PRODUCT_2.name)
})

/* MODIFIERS */
test('should update an internal product adding modifiers', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const input = {
    product: PRODUCT_1._id,
    modifiers: [
      {
        name: 'Embalagem',
        price: 2.5
      },
      {
        name: 'Porta copo',
        price: 0
      }
    ]
  }

  const variables = { input }
  /* CHECK GRAPQHL RESPONSE */
  const response = await mutate(UPDATE_PRODUCT, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.updateProduct, undefined)

  const { updateProduct } = response.data

  t.is(updateProduct.name, PRODUCT_1.name.toLowerCase())
  t.not(updateProduct.balance, null)
  t.is(updateProduct.balance, 0)
  t.is(updateProduct.price, USER_PRODUCT_1.price)

  let modifiers = updateProduct.modifiers.map(({ id, ...modifier }) => {
    t.not(id, null)
    return modifier
  })

  t.deepEqual(modifiers, input.modifiers)

  /* CHECK DATABASE */
  const userProduct = await UserProduct.findOne({ company: company._id, product: PRODUCT_1._id })

  t.not(userProduct, null)
  t.is(userProduct.price, USER_PRODUCT_1.price)

  modifiers = userProduct.toObject().modifiers.map(({ _id, ...modifier }) => modifier)

  t.deepEqual(modifiers, input.modifiers)
})
