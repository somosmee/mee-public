import mongoose from 'src/mongoose'

import { Payments, IncomeCategories } from 'src/utils/enums'

const { ObjectId } = mongoose.Types

const Payment = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: Object.values(Payments),
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    received: {
      type: Number,
      required: true,
      default: function() {
        return this.get('value')
      }
    },
    fee: {
      type: Number,
      required: true,
      default: 0.0
    },
    prepaid: {
      type: Boolean,
      required: true,
      default: false
    },
    pending: {
      type: Boolean,
      required: true,
      default: false
    },
    financialFund: { type: ObjectId, ref: 'FinancialFund', default: undefined },
    paymentMethod: { type: ObjectId, default: undefined },
    category: {
      type: ObjectId,
      required: true,
      default: IncomeCategories.SALE
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
)

export default Payment
