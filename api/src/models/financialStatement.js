import moment from 'moment'

import mongoose from 'src/mongoose'

import { FinancialFund } from 'src/models'
import PaymentMethod from 'src/models/company/paymentMethod'

import { FinancialOperations } from 'src/utils/enums'
import { convertUTCOffsetToString } from 'src/utils/timezone'

const { ObjectId } = mongoose.Types

const FinancialStatementSchema = new mongoose.Schema(
  {
    company: {
      type: ObjectId,
      index: true,
      ref: 'Company',
      required: true,
      es_indexed: true
    },
    // its not required because a client can created a customer on shopfront
    createdBy: {
      type: ObjectId,
      index: true,
      ref: 'User',
      es_indexed: true
    },
    order: {
      type: ObjectId,
      ref: 'Order',
      index: true
    },
    purchase: {
      type: ObjectId,
      ref: 'Purchase',
      index: true
    },
    operation: {
      type: String,
      enum: Object.values(FinancialOperations),
      required: true,
      index: true
    },
    value: { type: Number, required: true, default: 0.0 },
    paid: { type: Boolean, required: true, default: true },
    dueAt: { type: Date, required: true },
    description: { type: String, required: true },
    category: {
      type: ObjectId,
      required: true
    },
    financialFund: { type: ObjectId, ref: 'FinancialFund' },
    registerOperation: { type: ObjectId, ref: 'RegisterOperation' },
    paymentMethod: PaymentMethod
  },
  {
    timestamps: true
  }
)

FinancialStatementSchema.statics.createMovement = async function(
  input,
  companyId,
  userId,
  operation
) {
  const FinancialStatement = this

  const today = moment()
  const paid = moment(input.dueAt).isSameOrBefore(today)

  if (!ObjectId.isValid(companyId)) throw new Error('Id da empresa é inválido')
  if (!Object.values(FinancialOperations).find((op) => op === operation)) {
    throw new Error('Operação financeira inexistente!')
  }

  switch (operation) {
    case FinancialOperations.INCOME:
      input.value = Math.abs(input.value)
      break
    case FinancialOperations.EXPENSE:
      input.value = -Math.abs(input.value)
      break
    default:
      throw new Error('Operação financeira inválida')
  }

  const statement = new FinancialStatement({
    ...input,
    paid,
    operation,
    company: companyId,
    createdBy: userId
  })

  await statement.save()

  await FinancialStatement.adjustBalance(statement)

  return statement
}

FinancialStatementSchema.statics.adjustBalance = async function(statement) {
  const today = moment()

  if (statement.financialFund && moment(statement.dueAt).isSameOrBefore(today)) {
    // set new balance to fund
    const fund = await FinancialFund.findOne({ _id: statement.financialFund })
    if (!fund) throw new Error('Fundo financeiro não existe')

    fund.balance += statement.value
    await fund.save()
  }
}

/**
 * Calculate total, totalSales, and totals by payment method
 * @param  {[type]} start   [description]
 * @param  {[type]} end     [description]
 * @param  {[type]} company [description]
 * @return {[type]}         [description]
 */
FinancialStatementSchema.statics.getTotals = async function(
  key = 'dueAt',
  start,
  end,
  company,
  groupBy,
  utcOffset,
  tz = 'America/Sao_Paulo'
) {
  const FinancialStatement = this

  // we need to do this transformation for $match. Otherwise it wont work
  // https://stackoverflow.com/questions/55996580/mongo-aggregation-ignoring-date-range-filter-in-match
  const startDate = start.toDate()
  const endDate = end.toDate()

  /**
   * Date aggregation functions on MongoDB
   * $millisecond ; $second ; $minute ; $hour ; $dayOfMonth ; $month ; $year ; $isoWeek
   * $dateFromParts - define every element to compose the date
   */

  let format = '%d/%m/%Y'

  if (groupBy === 'day') {
    format = '%d/%m/%Y'
  } else if (groupBy === 'week') {
    format = '%V'
  } else if (groupBy === 'month') {
    format = '%m'
  }

  const total = await FinancialStatement.aggregate([
    {
      $match: {
        operation: FinancialOperations.INCOME,
        company: company._id,
        [key]: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: { year: { $year: '$date' } },
        total: { $sum: '$value' }
      }
    }
  ])

  const totalSales = await FinancialStatement.aggregate([
    {
      $match: {
        operation: FinancialOperations.INCOME,
        company: company._id,
        order: { $exists: true },
        [key]: { $gte: startDate, $lte: endDate }
      }
    },
    { $group: { _id: { year: { $year: '$date' } }, total: { $sum: '$value' } } }
  ])

  /* Total Expenses and Incomes */
  const totalIncomes = await FinancialStatement.aggregate([
    {
      $match: {
        operation: FinancialOperations.INCOME,
        company: company._id,
        [key]: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format,
              date: `$${key}`,
              timezone: utcOffset ? convertUTCOffsetToString(utcOffset) : tz
            }
          }
        },
        total: { $sum: '$value' }
      }
    },
    {
      $sort: { '_id.date': 1 }
    }
  ])

  const totalExpenses = await FinancialStatement.aggregate([
    {
      $match: {
        operation: FinancialOperations.EXPENSE,
        company: company._id,
        [key]: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format,
              date: `$${key}`,
              timezone: utcOffset ? convertUTCOffsetToString(utcOffset) : tz
            }
          }
        },
        total: { $sum: '$value' }
      }
    },
    {
      $sort: { '_id.date': 1 }
    }
  ])

  const totalPaymentMethods = await FinancialStatement.aggregate([
    {
      $match: {
        company: company._id,
        purchase: null,
        paymentMethod: { $exists: true },
        [key]: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          method: '$paymentMethod.method',
          date: {
            $dateToString: {
              format,
              date: `$${key}`,
              timezone: utcOffset ? convertUTCOffsetToString(utcOffset) : tz
            }
          }
        },
        total: { $sum: '$value' }
      }
    },
    {
      $sort: { '_id.date': 1 }
    }
  ])

  return {
    total: total.length > 0 ? total[0].total : 0.0,
    totalSales: totalSales.length > 0 ? totalSales[0].total : 0.0,
    totalIncomes: totalIncomes,
    totalExpenses: totalExpenses,
    totalPaymentMethods
  }
}

export default mongoose.model('FinancialStatement', FinancialStatementSchema, 'financialStatements')
