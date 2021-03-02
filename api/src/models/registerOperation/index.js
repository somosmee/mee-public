import mongoose from 'src/mongoose'

import PaymentMethod from 'src/models/registerOperation/paymentMethod'
import Register from 'src/models/registerOperation/register'

import { RegisterOperationTypes } from 'src/utils/enums'

const { ObjectId } = mongoose.Types

const RegisterOperationSchema = new mongoose.Schema(
  {
    company: {
      type: ObjectId,
      index: true,
      ref: 'Company',
      required: true
    },
    createdBy: {
      type: ObjectId,
      index: true,
      ref: 'User'
    },
    operationType: {
      type: String,
      enum: Object.values(RegisterOperationTypes),
      required: true
    },
    totalSales: {
      type: Number,
      required: true,
      default: 0.0,
      description: 'sum of total amount of sales on that day'
    },
    realTotalSales: {
      type: Number,
      required: true,
      default: 0.0,
      description: 'real sum of total amount of sales registered by the user'
    },
    paymentMethods: [PaymentMethod],
    registers: [Register]
  },
  {
    timestamps: true
  }
)

export default mongoose.model('RegisterOperation', RegisterOperationSchema, 'registerOperations')
