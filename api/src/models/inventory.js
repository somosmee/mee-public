import mongoose from 'src/mongoose'

import { UserProduct } from 'src/models'

import { Reasons, Operations } from 'src/utils/enums'

const { ObjectId } = mongoose.Types

const InventorySchema = new mongoose.Schema(
  {
    company: {
      type: ObjectId,
      index: true,
      ref: 'Company',
      required: true,
      es_indexed: true
    },
    // its not required because a client can created a customer on shopfront
    createdBy: {
      type: ObjectId,
      index: true,
      ref: 'User',
      es_indexed: true
    },
    product: {
      type: ObjectId,
      ref: 'Product',
      required: true,
      index: true
    },
    purchase: { type: ObjectId, ref: 'Purchase' },
    reason: {
      type: String,
      enum: Object.values(Reasons),
      required: true,
      index: true
    },
    quantity: { type: Number, required: true },
    balance: { type: Number, required: true },
    deletedAt: Date
  },
  {
    timestamps: true
  }
)

InventorySchema.index({ createdAt: -1 })

InventorySchema.statics.lastMovementByProductId = function(product, companyId) {
  const Inventory = this
  return Inventory.findOne({ company: companyId, product }).sort({ createdAt: -1 })
}

InventorySchema.statics.createMovement = async function({
  data,
  userId,
  companyId,
  operation,
  // If true, calls recursively inventory movement for a product bundle
  propagate = false
} = {}) {
  const Inventory = this

  if (userId && !ObjectId.isValid(userId)) throw new Error('Id do usuário inválido')
  if (!ObjectId.isValid(data.product)) throw new Error('Id do produto inválido')

  const userProduct = await UserProduct.findOneWithDeleted({
    company: companyId,
    product: data.product
  })

  if (!userProduct) {
    throw new Error('O produto não existe mais. Não é possível mudar o balanço de estoque')
  }

  if (userProduct.deleted) {
    await userProduct.restore()
  }

  switch (operation) {
    case Operations.INCREASE:
      data.quantity = Math.abs(data.quantity)
      break
    case Operations.DECREASE:
      data.quantity = -Math.abs(data.quantity)
      break
    default:
      throw new Error('Operação de estoque inválida')
  }

  if (userProduct.bundle?.length && propagate) {
    for (const product of userProduct.bundle) {
      await Inventory.createMovement({
        data: {
          product: product.product,
          quantity: data.quantity * product.quantity,
          reason: data.reason
        },
        userId,
        companyId,
        operation
      })
    }
  }

  const lastMovement = await Inventory.lastMovementByProductId(data.product, companyId)

  const inventory = new Inventory(data)
  const balance =
    lastMovement && lastMovement.balance ? lastMovement.balance + data.quantity : data.quantity

  inventory.balance = balance
  inventory.company = companyId
  inventory.createdBy = userId

  await inventory.save()

  userProduct.balance = balance
  await userProduct.save()

  return inventory
}

export default mongoose.model('Inventory', InventorySchema, 'inventory')
