import { Inventory } from 'src/models'

import { isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import { Operations } from 'src/utils/enums'
import { createPaginationPayload, enforcePaginationParams } from 'src/utils/pagination'

export const increaseInventory = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { user, company }, info) => {
    const inventory = await Inventory.createMovement({
      data: input,
      companyId: company._id,
      userId: user._id,
      operation: Operations.INCREASE
    })
    if (!inventory) throw new Error('Não foi possível salvar a movimentação no estoque')

    return inventory
  }
)

export const decreaseInventory = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { user, company }, info) => {
    const inventory = await Inventory.createMovement({
      data: input,
      companyId: company._id,
      userId: user._id,
      operation: Operations.DECREASE
    })
    if (!inventory) throw new Error('Não foi possível salvar a movimentação no estoque')

    return inventory
  }
)

export const inventoryAdjustment = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { user, company }, info) => {
    const lastMovement = await Inventory.lastMovementByProductId(input.product, company._id)
    const quantity = lastMovement?.balance ? input.balance - lastMovement.balance : input.balance
    const operation = quantity > 0 ? Operations.INCREASE : Operations.DECREASE
    const data = { quantity, product: input.product, reason: input.reason }

    const inventory = await Inventory.createMovement({
      data,
      companyId: company._id,
      userId: user._id,
      operation
    })
    if (!inventory) throw new Error('Não foi possível salvar a movimentação no estoque')

    return inventory
  }
)

export const inventoryMovements = isAuthenticatedResolver.createResolver(
  async (parent, { input: { product, pagination } }, { company }, info) => {
    const { first, skip } = enforcePaginationParams(pagination)

    const conditions = { product, company: company._id }
    const options = { skip, limit: first }
    const movements = await Inventory.find(conditions, null, options).sort({ createdAt: -1 })
    if (!movements) throw new Error('Error while fetch inventory movements')

    const count = await Inventory.countDocuments({ product, company: company._id })

    const inventoryMovementsPayload = {
      movements,
      pagination: createPaginationPayload({ first, skip, count })
    }

    return inventoryMovementsPayload
  }
)
