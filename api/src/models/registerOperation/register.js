import mongoose from 'src/mongoose'

const { ObjectId } = mongoose.Types

const Register = new mongoose.Schema({
  register: {
    type: ObjectId,
    ref: 'FinancialFund',
    required: true
  },
  name: { type: String, required: true },
  balance: {
    type: Number,
    required: true,
    default: 0.0,
    description: 'current balance'
  },
  realBalance: {
    type: Number,
    required: true,
    default: 0.0,
    description: 'real balance registered by the user'
  },
  financialStatements: [
    {
      type: ObjectId,
      ref: 'FinancialStatement'
    }
  ]
})

export { Register as default }
