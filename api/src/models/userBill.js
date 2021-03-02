import stripe from 'src/stripe'

import mongoose from 'src/mongoose'

import { User } from 'src/models'

import { COMISSION_FEE_PERCENT } from 'src/utils/constants'
import { UserBillStatus } from 'src/utils/enums'
import logger from 'src/utils/logger'

const { ObjectId } = mongoose.Types
const { Mixed } = mongoose.Schema.Types

const UserBillSchema = new mongoose.Schema(
  {
    company: {
      type: ObjectId,
      index: true,
      ref: 'Company',
      required: true,
      es_indexed: true
    },
    createdBy: {
      type: ObjectId,
      index: true,
      ref: 'User',
      required: true,
      es_indexed: true
    },
    items: [
      {
        type: Mixed,
        order: {
          type: ObjectId,
          ref: 'Order',
          required: true
        },
        totalOrder: { type: Number, required: true },
        fee: { type: Number, required: true },
        totalFee: { type: Number, required: true }
      }
    ],
    status: {
      type: String,
      enum: Object.values(UserBillStatus),
      default: UserBillStatus.PENDING,
      required: true
    },
    total: { type: Number, required: true },
    paymentIntent: Mixed
  },
  {
    timestamps: true
  }
)

UserBillSchema.statics.addBillableItem = async function(order) {
  const user = await User.findById(order.company)
  if (!user) {
    logger.error(`[addBillableItem] User not found ${order._id}`)
    return
  }

  if (!user.billableItems) user.billableItems = []

  user.billableItems.push({
    order: order._id,
    totalOrder: order.total,
    fee: COMISSION_FEE_PERCENT,
    totalFee: order.total * COMISSION_FEE_PERCENT
  })
  user.markModified('billableItems')

  await user.save()
}

UserBillSchema.statics.chargeBillableItems = async function(user) {
  const UserBill = this
  if (!user.billableItems) {
    logger.error(`[chargeBillableItems] no billableItems attributes on USER: ${user.email}`)
    return
  }

  if (user.billableItems.length === 0) {
    logger.error(`[chargeBillableItems] billableItems is empty on USER: ${user.email}`)
    return
  }

  const bill = new UserBill({
    user: user._id,
    status: UserBillStatus.PENDING,
    items: user.billableItems,
    total: user.billableItems.reduce((a, b) => a + (b.totalFee || 0), 0)
  })
  await bill.save()

  user.billableItems = []
  await user.save()

  // try to charge user
  try {
    await stripe.chargeCustomer(user, bill)
  } catch (e) {
    logger.error('[chargeBillableItems/chargeCustomer] ERROR:', e)
  }
}

const UserBillModel = mongoose.model('UserBill', UserBillSchema, 'userBill')

export default UserBillModel
