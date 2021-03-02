import { serial as test } from 'ava'
import moment from 'moment'

import { FinancialStatement, User } from 'src/models'

import { userGenerator } from 'src/test/utils/generators'

import { FinancialOperations, ExpenseCategories, IncomeCategories } from 'src/utils/enums'

test.beforeEach(async (t) => {
  await FinancialStatement.deleteMany({})
  await User.deleteMany({})
})

test.afterEach(async (t) => {
  await FinancialStatement.deleteMany({})
  await User.deleteMany({})
})

test('should create income operation correctly', async (t) => {
  const { user, company } = await userGenerator()

  await FinancialStatement.createMovement(
    {
      value: 150.69,
      paid: true,
      category: IncomeCategories.SALE,
      description: 'sale',
      dueAt: new Date()
    },
    company._id,
    user._id,
    FinancialOperations.INCOME
  )

  const statements = await FinancialStatement.find({ company: company._id })

  t.is(statements.length, 1)

  const [firstIncome] = statements

  t.is(moment(firstIncome.dueAt).format('DD/MM/YYYY'), moment().format('DD/MM/YYYY'))
  t.is(firstIncome.paid, true)
  t.is(firstIncome.category.toString(), IncomeCategories.SALE.toString())
  t.is(firstIncome.description, 'sale')
  t.is(firstIncome.value, 150.69)
})

test('should create expense operation correctly', async (t) => {
  const { user, company } = await userGenerator()

  await FinancialStatement.createMovement(
    {
      value: 150.69,
      paid: true,
      category: ExpenseCategories.GENERAL_EXPENSE,
      description: 'aluguel',
      dueAt: new Date()
    },
    company._id,
    user._id,
    FinancialOperations.EXPENSE
  )

  const statements = await FinancialStatement.find({ company: company._id })

  t.is(statements.length, 1)

  const [firstIncome] = statements

  t.is(moment(firstIncome.dueAt).format('DD/MM/YYYY'), moment().format('DD/MM/YYYY'))
  t.is(firstIncome.paid, true)
  t.is(firstIncome.category.toString(), ExpenseCategories.GENERAL_EXPENSE.toString())
  t.is(firstIncome.description, 'aluguel')
  t.is(firstIncome.value, -150.69)
})
