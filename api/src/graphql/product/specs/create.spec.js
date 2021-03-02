import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'

import { apolloServer } from 'src/apolloServer'

import { Company, User, Product, UserProduct } from 'src/models'

import { CREATE_PRODUCT } from 'src/graphql/product/specs/gql'

import {
  PRODUCT_INTERNAL,
  PRODUCT_EXTERNAL,
  PRODUCT_1,
  PRODUCT_2,
  USER_PRODUCT_1,
  USER_PRODUCT_2,
  PRODUCT_INTERNAL_GTIN_WRONG
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
  headers = { Authorization: generateToken({ userId: user._id, companyId: company._id }) }
})

test.afterEach.always(async (t) => {
  await Company.deleteMany({})
  await User.deleteMany({})
  await Product.deleteMany({})
  await UserProduct.deleteMany({})
})

test('should create an internal product', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = {
    input: {
      internal: true,
      name: 'Produto Test',
      price: 12.9,
      measurement: 'unit'
    }
  }
  const response = await mutate(CREATE_PRODUCT, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.createProduct, undefined)
  t.is(response.data.createProduct.gtin, PRODUCT_INTERNAL.gtin)
  t.is(response.data.createProduct.name, PRODUCT_INTERNAL.name)
  t.not(response.data.createProduct.balance, undefined)
  t.is(response.data.createProduct.price, PRODUCT_INTERNAL.price)
  t.is(response.data.createProduct.measurement, PRODUCT_INTERNAL.measurement)
  t.is(response.data.createProduct.internal, PRODUCT_INTERNAL.internal)

  /* CHECK DATABASE */
  const product = await Product.findOne({ gtin: PRODUCT_INTERNAL.gtin })
  const userProduct = await UserProduct.findOne({ company: company._id, product: product._id })

  t.not(product, null)
  t.not(userProduct, null)
  t.is(product.price, undefined)
  t.is(userProduct.price, PRODUCT_INTERNAL.price)
})

test('should create an internal product even if gtin parameter is sent', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const nextGTIN = await Product.getNextGTIN(company)

  const variables = { input: PRODUCT_INTERNAL_GTIN_WRONG }
  const response = await mutate(CREATE_PRODUCT, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.createProduct, undefined)
  t.is(response.data.createProduct.gtin, nextGTIN)
  t.is(response.data.createProduct.name, PRODUCT_INTERNAL_GTIN_WRONG.name)
  t.not(response.data.createProduct.balance, undefined)
  t.is(response.data.createProduct.price, PRODUCT_INTERNAL_GTIN_WRONG.price)
  t.is(response.data.createProduct.measurement, PRODUCT_INTERNAL_GTIN_WRONG.measurement)
  t.is(response.data.createProduct.internal, PRODUCT_INTERNAL_GTIN_WRONG.internal)

  const product = await Product.findOne({ gtin: PRODUCT_INTERNAL.gtin })
  const userProduct = await UserProduct.findOne({ company: company._id, product: product._id })

  t.not(product, null)
  t.not(userProduct, null)
  t.is(product.price, undefined)
  t.is(userProduct.price, PRODUCT_INTERNAL_GTIN_WRONG.price)
})

test('should create an external product', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = {
    input: {
      gtin: '78905351',
      internal: false,
      name: 'Cerveja Original',
      price: 8.35,
      measurement: 'unit'
    }
  }
  const response = await mutate(CREATE_PRODUCT, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.createProduct, undefined)
  t.is(response.data.createProduct.gtin, PRODUCT_EXTERNAL.gtin)
  t.is(response.data.createProduct.name, PRODUCT_EXTERNAL.name)
  t.not(response.data.createProduct.balance, undefined)
  t.is(response.data.createProduct.price, PRODUCT_EXTERNAL.price)
  t.is(response.data.createProduct.measurement, PRODUCT_EXTERNAL.measurement)
  t.is(response.data.createProduct.internal, PRODUCT_EXTERNAL.internal)

  /* CHECK DATABASE */
  const product = await Product.findOne({ gtin: PRODUCT_EXTERNAL.gtin })
  const userProduct = await UserProduct.findOne({ company: company._id, product: product._id })

  t.not(product, null)
  t.not(userProduct, null)
  t.is(product.price, undefined)
  t.is(userProduct.price, PRODUCT_EXTERNAL.price)
})

test.todo('should throw error if external product dont have valid gtin')

test.todo('should not create a new product if product exist on products collection')

/* BUNDLE */
test('should throw error if create bundle product with invalid bundle id', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = {
    input: {
      internal: true,
      name: 'Produto Test',
      price: 12.9,
      measurement: 'unit',
      bundle: [
        { product: '123', quantity: 1 },
        { product: '321', quantity: 1 }
      ]
    }
  }
  const response = await mutate(CREATE_PRODUCT, { variables })

  t.not(response.errors, null)
  t.is(response.data, null)
  t.is(response.errors[0].message, 'Id do produto 123 não é válido')
})

test('should throw error if create bundle product with bundle id not found', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = {
    input: {
      internal: true,
      name: 'Produto Test',
      price: 12.9,
      measurement: 'unit',
      bundle: [
        { product: USER_PRODUCT_1._id, quantity: 1 },
        { product: USER_PRODUCT_2._id, quantity: 1 }
      ]
    }
  }
  const response = await mutate(CREATE_PRODUCT, { variables })

  t.not(response.errors, null)
  t.is(response.data, null)
  t.is(response.errors[0].message, `Produto ${USER_PRODUCT_1._id} não existe`)
})

test('should create a bundle product with external product', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  await new Product(PRODUCT_1).save()
  await new Product(PRODUCT_2).save()
  await new UserProduct({ ...USER_PRODUCT_1, company: company._id, createdBy: user._id }).save()
  await new UserProduct({ ...USER_PRODUCT_2, company: company._id, createdBy: user._id }).save()

  const variables = {
    input: {
      ...PRODUCT_EXTERNAL,
      bundle: [
        {
          product: PRODUCT_1._id,
          quantity: 1
        },
        {
          product: PRODUCT_2._id,
          quantity: 1
        }
      ]
    }
  }

  const response = await mutate(CREATE_PRODUCT, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.createProduct, undefined)
  t.is(response.data.createProduct.gtin, variables.input.gtin)
  t.is(response.data.createProduct.name, PRODUCT_EXTERNAL.name)
  t.is(response.data.createProduct.balance, 0)
  t.is(response.data.createProduct.price, PRODUCT_EXTERNAL.price)
  t.is(response.data.createProduct.measurement, PRODUCT_EXTERNAL.measurement)
  t.is(response.data.createProduct.internal, PRODUCT_EXTERNAL.internal)
  t.not(response.data.createProduct.bundle, null)
  t.is(response.data.createProduct.bundle.length, 2)
  const [firstProduct, secondProduct] = response.data.createProduct.bundle

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

test('should create a bundle product with internal product', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  await new Product(PRODUCT_1).save()
  await new Product(PRODUCT_2).save()
  await new UserProduct({ ...USER_PRODUCT_1, company: company._id, createdBy: user._id }).save()
  await new UserProduct({ ...USER_PRODUCT_2, company: company._id, createdBy: user._id }).save()

  const variables = {
    input: {
      internal: true,
      name: 'Produto Test',
      price: 12.9,
      measurement: 'unit',
      bundle: [
        { product: PRODUCT_1._id, quantity: 1 },
        { product: PRODUCT_2._id, quantity: 1 }
      ]
    }
  }
  const nextGTIN = await Product.getNextGTIN(company)
  const response = await mutate(CREATE_PRODUCT, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.createProduct, undefined)
  t.is(response.data.createProduct.gtin, nextGTIN)
  t.is(response.data.createProduct.name, PRODUCT_INTERNAL.name)
  t.is(response.data.createProduct.balance, 0)
  t.is(response.data.createProduct.price, PRODUCT_INTERNAL.price)
  t.is(response.data.createProduct.measurement, PRODUCT_INTERNAL.measurement)
  t.is(response.data.createProduct.internal, PRODUCT_INTERNAL.internal)
  t.not(response.data.createProduct.bundle, null)
  t.is(response.data.createProduct.bundle.length, 2)
  const [firstProduct, secondProduct] = response.data.createProduct.bundle

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

/* DELETE */
test.todo('should delete a product')

/* MODIFIERS */
test('should create an internal product with modifiers', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = {
    input: {
      internal: true,
      name: 'Produto Test',
      price: 12.9,
      measurement: 'unit',
      modifiers: [
        {
          name: 'Bacon',
          price: 3
        },
        {
          name: 'Queijo',
          price: 2.5
        }
      ]
    }
  }
  /* CHECK GRAPQHL RESPONSE */
  const response = await mutate(CREATE_PRODUCT, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.createProduct, undefined)

  const { input } = variables
  const { createProduct } = response.data

  t.is(createProduct.gtin, PRODUCT_INTERNAL.gtin)
  t.is(createProduct.name, input.name.toLowerCase())
  t.not(createProduct.balance, undefined)
  t.is(createProduct.balance, 0)
  t.is(createProduct.price, input.price)
  t.is(createProduct.measurement, input.measurement)
  t.is(createProduct.internal, input.internal)

  let modifiers = createProduct.modifiers.map(({ id, ...modifier }) => {
    t.not(id, undefined)
    return modifier
  })

  t.deepEqual(modifiers, input.modifiers)

  /* CHECK DATABASE */
  const product = await Product.findOne({ gtin: PRODUCT_INTERNAL.gtin })
  const userProduct = await UserProduct.findOne({ company: company._id, product: product._id })

  t.not(product, null)
  t.not(userProduct, null)
  t.is(product.price, undefined)
  t.is(userProduct.price, PRODUCT_INTERNAL.price)

  modifiers = userProduct.toObject().modifiers.map(({ _id, ...modifier }) => modifier)

  t.deepEqual(modifiers, input.modifiers)
})

test('should create an external product with modifiers', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = {
    input: {
      gtin: '78905351',
      internal: false,
      name: 'Cerveja Original',
      price: 8.35,
      measurement: 'unit',
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
  }
  /* CHECK GRAPQHL RESPONSE */
  const response = await mutate(CREATE_PRODUCT, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.createProduct, undefined)

  const { input } = variables
  const { createProduct } = response.data

  t.is(createProduct.gtin, PRODUCT_EXTERNAL.gtin)
  t.is(createProduct.name, input.name.toLowerCase())
  t.not(createProduct.balance, undefined)
  t.is(createProduct.balance, 0)
  t.is(createProduct.price, input.price)
  t.is(createProduct.measurement, input.measurement)
  t.is(createProduct.internal, input.internal)

  let modifiers = createProduct.modifiers.map(({ id, ...modifier }) => {
    t.not(id, undefined)
    return modifier
  })

  t.deepEqual(modifiers, input.modifiers)

  /* CHECK DATABASE */
  const product = await Product.findOne({ gtin: PRODUCT_EXTERNAL.gtin })
  const userProduct = await UserProduct.findOne({ company: company._id, product: product._id })

  t.not(product, null)
  t.not(userProduct, null)
  t.is(product.price, undefined)
  t.is(userProduct.price, PRODUCT_EXTERNAL.price)

  modifiers = userProduct.toObject().modifiers.map(({ _id, ...modifier }) => modifier)

  t.deepEqual(modifiers, input.modifiers)
})
