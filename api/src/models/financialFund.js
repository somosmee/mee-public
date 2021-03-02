import mongoose from 'src/mongoose'

import { FinancialStatement } from 'src/models'

import {
  FinancialFundCategories,
  IncomeCategories,
  FinancialOperations,
  ExpenseCategories
} from 'src/utils/enums'

const { ObjectId } = mongoose.Types

const FinancialFundSchema = new mongoose.Schema(
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
    name: { type: String, required: true },
    balance: { type: Number, required: true, default: 0.0 },
    category: {
      type: String,
      enum: Object.values(FinancialFundCategories),
      required: true
    }
  },
  {
    timestamps: true
  }
)

const FinancialFundModel = mongoose.model('FinancialFund', FinancialFundSchema, 'financialFunds')

FinancialFundModel.adjust = async function(
  fundId,
  balance,
  shouldCreateFinancialStatement,
  company,
  user
) {
  let fund = await FinancialFundModel.findOne({ _id: fundId, company: company._id })

  if (!fund) throw new Error('Conta não existe')

  const value = balance - fund.balance

  if (shouldCreateFinancialStatement) {
    await FinancialStatement.createMovement(
      {
        value,
        paid: true,
        category: value >= 0 ? IncomeCategories.ADJUSTMENT : ExpenseCategories.ADJUSTMENT,
        description: `ajuste do fundo financeiro ${fund.name}`,
        dueAt: new Date(),
        financialFund: fund._id
      },
      company?._id,
      user?._id,
      value >= 0 ? FinancialOperations.INCOME : FinancialOperations.EXPENSE
    )
  } else {
    fund.balance = balance
    await fund.save()
  }

  // get new value from financial statement operation
  fund = await FinancialFundModel.findOne({ _id: fundId, company: company._id })

  return fund
}

export default FinancialFundModel
