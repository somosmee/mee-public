import { FinancialStatement } from 'src/models'

import { isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import { ExpenseCategories, IncomeCategories } from 'src/utils/enums'

export const createFinancialStatementCategory = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { user, company }, info) => {}
)

export const updateFinancialStatementCategory = isAuthenticatedResolver.createResolver(
  async (parent, { input: { id, ...data } }, { user, company }, info) => {}
)

export const deleteFinancialStatementCategory = isAuthenticatedResolver.createResolver(
  async (parent, { input: { id } }, { user, company }, info) => {
    const categoryExpense = company.expenseCategories.find(
      (category) => category._id.toString() === id
    )
    const categoryIncome = company.incomeCategories.find(
      (category) => category._id.toString() === id
    )

    if (!categoryIncome && !categoryExpense) throw new Error('Categoria não encontrada')

    let key = null
    const category = categoryIncome || categoryExpense

    if (categoryIncome) key = 'incomeCategories'
    if (categoryExpense) key = 'expenseCategories'

    const filtered = company[key].filter((c) => c._id.toString() !== category._id.toString())
    company[key] = filtered

    await company.save()

    // change all transaction to a general category
    await FinancialStatement.updateMany(
      {
        category: category._id
      },
      {
        $set: {
          category: categoryIncome
            ? IncomeCategories.GENERAL_INCOME
            : ExpenseCategories.GENERAL_EXPENSE
        }
      }
    )

    return company
  }
)
