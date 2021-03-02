import mongoose from 'src/mongoose'

import { IfoodOrderStatus } from 'src/utils/enums'

const { Mixed } = mongoose.Schema.Types

const IfoodSchema = new mongoose.Schema(
  {
    events: [
      {
        type: Mixed,
        id: String,
        code: String,
        correlationId: String,
        createdAt: Date,
        required: true
      }
    ],
    customer: Mixed,
    synced: {
      type: Boolean,
      required: true,
      default: false
    },
    reference: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(IfoodOrderStatus),
      required: true
    },
    shortReference: String,
    payments: [Mixed],
    deliveryAddress: Mixed,
    deliveryFee: Number,
    deliveryMethod: Mixed,
    items: [Mixed],
    benefits: [Mixed],
    totalPrice: Number,
    subTotal: Number
  },
  {
    timestamps: true
  }
)

export default mongoose.model('IfoodOrder', IfoodSchema, 'ifoodOrders')
