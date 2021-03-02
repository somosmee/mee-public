import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'

import { apolloServer } from 'src/apolloServer'

import { User, Product, UserProduct, Inventory } from 'src/models'

import {
  INCREASE_INVENTORY,
  DECREASE_INVENTORY,
  INVENTORY_ADJUSTMENT,
  GET_INVENTORY_MOVEMENTS
} from 'src/graphql/inventory/specs/gql'

import {
  PRODUCT,
  USER_PRODUCT,
  INVENTORY,
  INVENTORY_MOVEMENTS_INPUT,
  PRODUCT_ACQUISITION,
  PRODUCT_RETURN,
  PRODUCT_INCREASE_MANUAL_ADJUSTMENT,
  PRODUCT_DRECREASE_MANUAL_ADJUSTMENT,
  PRODUCT_EXPIRED,
  PRODUCT_DAMAGED,
  MANUAL_ADJUSTMENT_PRODUCT_DAMAGED,
  INVALID_PRODUCT_ACQUISITION_PRODUCT_ID
} from 'src/test/common/payloads/inventory'
import { inventoryGenerator, userGenerator } from 'src/test/utils/generators'

import {
  MAX_PAGINATION_LIMIT,
  PAGINATION_FIRST_DEFAULT,
  PAGINATION_SKIP_DEFAULT
} from 'src/utils/constants'
import { generateToken } from 'src/utils/token'

let headers = null
let user = null
let company = null
let inventory = null

const setUserAndCompany = async () => {
  const { user: newUser, company: newCompany } = await userGenerator()
  user = newUser
  company = newCompany
}

test.beforeEach(async (t) => {
  await User.deleteMany({})
  await Product.deleteMany({})
  await UserProduct.deleteMany({})
  await Inventory.deleteMany({})

  await setUserAndCompany()
  headers = { Authorization: generateToken({ userId: user._id, companyId: company._id }) }

  await new Product(PRODUCT).save()
  await new UserProduct({ ...USER_PRODUCT, company: company._id, createdBy: user._id }).save()
  inventory = await new Inventory({
    ...INVENTORY,
    company: company._id,
    createdBy: user._id
  }).save()
})

test.afterEach.always(async (t) => {
  await User.deleteMany({})
  await Product.deleteMany({})
  await UserProduct.deleteMany({})
  await Inventory.deleteMany({})
})

test('should increase product balance in inventory in case of acquisition', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = { input: PRODUCT_ACQUISITION }
  const response = await mutate(INCREASE_INVENTORY, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.increaseInventory, undefined)
  t.is(response.data.increaseInventory.quantity, PRODUCT_ACQUISITION.quantity)
  t.is(response.data.increaseInventory.reason, PRODUCT_ACQUISITION.reason)
  t.is(response.data.increaseInventory.product._id, PRODUCT_ACQUISITION.product)
  t.is(response.data.increaseInventory.balance, inventory.balance + PRODUCT_ACQUISITION.quantity)
  t.is(response.data.increaseInventory.company._id, company._id.toString())
  t.not(response.data.increaseInventory.createdAt, null)
  t.not(response.data.increaseInventory.updatedAt, null)
})

test('should increase product balance in inventory in case of return', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = { input: PRODUCT_RETURN }
  const response = await mutate(INCREASE_INVENTORY, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.increaseInventory, undefined)
  t.is(response.data.increaseInventory.quantity, PRODUCT_RETURN.quantity)
  t.is(response.data.increaseInventory.reason, PRODUCT_RETURN.reason)
  t.is(response.data.increaseInventory.product._id, PRODUCT_RETURN.product)
  t.is(response.data.increaseInventory.balance, inventory.balance + PRODUCT_RETURN.quantity)
  t.is(response.data.increaseInventory.company._id, company._id.toString())
  t.not(response.data.increaseInventory.createdAt, null)
  t.not(response.data.increaseInventory.updatedAt, null)
})

test('should increase product balance in inventory in case of manual adjustment', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = { input: PRODUCT_INCREASE_MANUAL_ADJUSTMENT }
  const response = await mutate(INCREASE_INVENTORY, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.increaseInventory, undefined)
  t.is(response.data.increaseInventory.quantity, PRODUCT_INCREASE_MANUAL_ADJUSTMENT.quantity)
  t.is(response.data.increaseInventory.reason, PRODUCT_INCREASE_MANUAL_ADJUSTMENT.reason)
  t.is(response.data.increaseInventory.product._id, PRODUCT_INCREASE_MANUAL_ADJUSTMENT.product)
  t.is(
    response.data.increaseInventory.balance,
    inventory.balance + PRODUCT_INCREASE_MANUAL_ADJUSTMENT.quantity
  )
  t.is(response.data.increaseInventory.company._id, company._id.toString())
  t.not(response.data.increaseInventory.createdAt, null)
  t.not(response.data.increaseInventory.updatedAt, null)
})

test('should throw error if product id is invalid', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = { input: INVALID_PRODUCT_ACQUISITION_PRODUCT_ID }
  const response = await mutate(INCREASE_INVENTORY, { variables })

  t.not(response.errors, undefined)
  t.is(response.data, null)
})

test.todo('should throw error if not possible increase product balance in inventory')

test('should decrease product balance in inventory in case of manual adjustment', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = { input: PRODUCT_DRECREASE_MANUAL_ADJUSTMENT }
  const response = await mutate(DECREASE_INVENTORY, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.decreaseInventory, undefined)
  t.is(response.data.decreaseInventory.quantity, -PRODUCT_DRECREASE_MANUAL_ADJUSTMENT.quantity)
  t.is(response.data.decreaseInventory.reason, PRODUCT_DRECREASE_MANUAL_ADJUSTMENT.reason)
  t.is(response.data.decreaseInventory.product._id, PRODUCT_DRECREASE_MANUAL_ADJUSTMENT.product)
  t.is(
    response.data.decreaseInventory.balance,
    inventory.balance - PRODUCT_DRECREASE_MANUAL_ADJUSTMENT.quantity
  )
  t.is(response.data.decreaseInventory.company._id, company._id.toString())
  t.not(response.data.decreaseInventory.createdAt, null)
  t.not(response.data.decreaseInventory.updatedAt, null)
})

test('should decrease product balance in inventory in case of expired', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = { input: PRODUCT_EXPIRED }
  const response = await mutate(DECREASE_INVENTORY, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.decreaseInventory, undefined)
  t.is(response.data.decreaseInventory.quantity, -PRODUCT_EXPIRED.quantity)
  t.is(response.data.decreaseInventory.reason, PRODUCT_EXPIRED.reason)
  t.is(response.data.decreaseInventory.product._id, PRODUCT_EXPIRED.product)
  t.is(response.data.decreaseInventory.balance, inventory.balance - PRODUCT_EXPIRED.quantity)
  t.is(response.data.decreaseInventory.company._id, company._id.toString())
  t.not(response.data.decreaseInventory.createdAt, null)
  t.not(response.data.decreaseInventory.updatedAt, null)
})

test('should decrease product balance in inventory in case of damage', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = { input: PRODUCT_DAMAGED }
  const response = await mutate(DECREASE_INVENTORY, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.decreaseInventory, undefined)
  t.is(response.data.decreaseInventory.quantity, -PRODUCT_DAMAGED.quantity)
  t.is(response.data.decreaseInventory.reason, PRODUCT_DAMAGED.reason)
  t.is(response.data.decreaseInventory.product._id, PRODUCT_DAMAGED.product)
  t.is(response.data.decreaseInventory.balance, inventory.balance - PRODUCT_DAMAGED.quantity)
  t.is(response.data.decreaseInventory.company._id, company._id.toString())
  t.not(response.data.decreaseInventory.createdAt, null)
  t.not(response.data.decreaseInventory.updatedAt, null)
})

test.todo('should throw error if not possible decrease product balance in inventory')

test('should change manually balance in inventory', async (t) => {
  const { query, mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const inventoryMovementsResponse = await query(GET_INVENTORY_MOVEMENTS, {
    variables: { input: INVENTORY_MOVEMENTS_INPUT }
  })

  t.is(inventoryMovementsResponse.errors, undefined)
  t.not(inventoryMovementsResponse.data, null)
  t.not(inventoryMovementsResponse.data.inventoryMovements, undefined)

  const lastIventoryMovement = inventoryMovementsResponse.data.inventoryMovements.movements[0]

  const quantity = lastIventoryMovement?.balance
    ? MANUAL_ADJUSTMENT_PRODUCT_DAMAGED.balance - lastIventoryMovement.balance
    : MANUAL_ADJUSTMENT_PRODUCT_DAMAGED.balance

  const variables = { input: MANUAL_ADJUSTMENT_PRODUCT_DAMAGED }
  const response = await mutate(INVENTORY_ADJUSTMENT, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.inventoryAdjustment, undefined)
  t.is(response.data.inventoryAdjustment.quantity, quantity)
  t.is(response.data.inventoryAdjustment.reason, MANUAL_ADJUSTMENT_PRODUCT_DAMAGED.reason)
  t.is(response.data.inventoryAdjustment.product._id, MANUAL_ADJUSTMENT_PRODUCT_DAMAGED.product)
  t.is(response.data.inventoryAdjustment.balance, MANUAL_ADJUSTMENT_PRODUCT_DAMAGED.balance)
  t.is(response.data.inventoryAdjustment.company._id, company._id.toString())
  t.not(response.data.inventoryAdjustment.createdAt, null)
  t.not(response.data.inventoryAdjustment.updatedAt, null)
})

test('should query inventory movements for a given product', async (t) => {
  const { query } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = { input: INVENTORY_MOVEMENTS_INPUT }
  const response = await query(GET_INVENTORY_MOVEMENTS, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.inventoryMovements, undefined)
  t.not(response.data.inventoryMovements.movements[0]._id, undefined)
  t.not(response.data.inventoryMovements.movements[0].reason, undefined)
  t.not(response.data.inventoryMovements.movements[0].quantity, undefined)
  t.not(response.data.inventoryMovements.movements[0].product, undefined)
  t.not(response.data.inventoryMovements.movements[0].purchase, undefined)
  t.not(response.data.inventoryMovements.movements[0].company, undefined)
  t.not(response.data.inventoryMovements.movements[0].deletedAt, undefined)
  t.not(response.data.inventoryMovements.movements[0].createdAt, undefined)
  t.not(response.data.inventoryMovements.movements[0].updatedAt, undefined)
  t.not(response.data.inventoryMovements.pagination, undefined)
  t.is(response.data.inventoryMovements.pagination.page, INVENTORY_MOVEMENTS_INPUT.pagination.skip)
  t.is(response.data.inventoryMovements.pagination.offset, MAX_PAGINATION_LIMIT)
  t.not(response.data.inventoryMovements.pagination.totalPages, undefined)
  t.not(response.data.inventoryMovements.pagination.totalItems, undefined)
})

test('should query inventory movements for a given product with max length allowed per page', async (t) => {
  const { query } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const totalItems = 51
  await Inventory.insertMany(
    inventoryGenerator(user._id.toString(), company._id.toString(), PRODUCT._id, totalItems)
  )

  const variables = { input: INVENTORY_MOVEMENTS_INPUT }
  const response = await query(GET_INVENTORY_MOVEMENTS, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.inventoryMovements, undefined)
  t.not(response.data.inventoryMovements.movements, undefined)
  t.is(response.data.inventoryMovements.movements.length, MAX_PAGINATION_LIMIT)
  t.not(response.data.inventoryMovements.pagination, undefined)
  t.is(response.data.inventoryMovements.pagination.page, INVENTORY_MOVEMENTS_INPUT.pagination.skip)
  t.is(response.data.inventoryMovements.pagination.offset, MAX_PAGINATION_LIMIT)
  t.not(response.data.inventoryMovements.pagination.totalPages, undefined)
  t.not(response.data.inventoryMovements.pagination.totalItems, undefined)
})

test('should query inventory movements with default pagination', async (t) => {
  const { query } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const totalItems = 10
  await Inventory.insertMany(
    inventoryGenerator(user._id.toString(), company._id.toString(), PRODUCT._id, totalItems)
  )

  const variables = { input: { product: INVENTORY_MOVEMENTS_INPUT.product } }
  const response = await query(GET_INVENTORY_MOVEMENTS, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.inventoryMovements, undefined)
  t.not(response.data.inventoryMovements.movements, undefined)
  t.is(response.data.inventoryMovements.movements.length, PAGINATION_FIRST_DEFAULT)
  t.not(response.data.inventoryMovements.pagination, undefined)
  t.is(response.data.inventoryMovements.pagination.page, PAGINATION_SKIP_DEFAULT)
  t.is(response.data.inventoryMovements.pagination.offset, PAGINATION_FIRST_DEFAULT)
  t.not(response.data.inventoryMovements.pagination.totalPages, undefined)
  t.not(response.data.inventoryMovements.pagination.totalItems, undefined)
})
