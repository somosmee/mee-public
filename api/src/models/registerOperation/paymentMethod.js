import mongoose from 'src/mongoose'

import { Payments } from 'src/utils/enums'

const PaymentMethod = new mongoose.Schema({
  method: {
    type: String,
    enum: Object.values(Payments),
    required: true
  },
  total: {
    type: Number,
    required: true,
    default: 0.0,
    description: 'sum of total amount of payments on that payment method'
  },
  realTotal: {
    type: Number,
    required: true,
    default: 0.0,
    description: 'real sum of total amount of payments registered on that payment method'
  }
})

export { PaymentMethod as default }
