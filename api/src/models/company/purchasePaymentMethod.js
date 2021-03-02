import mongoose from 'src/mongoose'

import { OperationTypes, Payments } from 'src/utils/enums'

const { ObjectId } = mongoose.Types

const PurchasePaymentMethod = new mongoose.Schema({
  name: { type: String, required: true },
  fee: { type: Number, required: true },
  operationType: {
    type: String,
    enum: Object.values(OperationTypes),
    required: true
  },
  method: {
    type: String,
    enum: Object.values(Payments),
    required: true
  },
  financialFund: { type: ObjectId, ref: 'FinancialFund' },
  /* Credit Card when you Purchase */
  closingDay: { type: Number, description: 'day of the month that the credit card closes (1-31)' },
  paymentDay: {
    type: Number,
    description: 'day of the month that you pay or need to pay your credit card (1-31)'
  }
})

export { PurchasePaymentMethod as default }
