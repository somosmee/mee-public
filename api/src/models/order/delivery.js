import mongoose from 'src/mongoose'

import { Address } from 'src/models/shared'

import { Payments, DeliveryMethods } from 'src/utils/enums'

const Delivery = new mongoose.Schema(
  {
    fee: { type: Number, default: 0.0 },
    address: Address,
    paymentType: {
      type: String,
      enum: Object.values(Payments)
    },
    method: {
      required: true,
      type: String,
      enum: Object.values(DeliveryMethods),
      default: DeliveryMethods.DELIVERY
    }
  },
  { _id: true }
)

export default Delivery
