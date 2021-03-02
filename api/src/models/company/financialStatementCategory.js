import mongoose from 'src/mongoose'

const FinancialStatementCategory = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true }
})

export { FinancialStatementCategory as default }
