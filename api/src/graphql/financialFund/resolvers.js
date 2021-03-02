import { FinancialFund, FinancialStatement } from 'src/models'

import { isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import { IncomeCategories, FinancialOperations } from 'src/utils/enums'

export const financialFunds = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { user, company }, info) => {
    const conditions = { company: company._id }

    if (input?.category) conditions.category = input.category

    const funds = await FinancialFund.find(conditions)

    return funds
  }
)

export const createFinancialFund = isAuthenticatedResolver.createResolver(
  async (
    parent,
    { input: { shouldCreateFinancialStatement, ...data } },
    { user, company },
    info
  ) => {
    let fund = new FinancialFund({
      ...data,
      company: company._id,
      createdBy: user._id,
      balance: 0.0
    })

    if (!shouldCreateFinancialStatement && data.balance) {
      fund.balance = data.balance
    }

    await fund.save()

    if (shouldCreateFinancialStatement) {
      // create initial financial statement
      await FinancialStatement.createMovement(
        {
          value: data.balance || 0.0,
          paid: true,
          category: IncomeCategories.ADJUSTMENT,
          description: `criação do fundo financeiro ${data.name}`,
          dueAt: new Date(),
          financialFund: fund._id
        },
        company?._id,
        user?._id,
        fund.balance >= 0 ? FinancialOperations.INCOME : FinancialOperations.EXPENSE
      )
    }

    fund = await FinancialFund.findOne({ _id: fund._id, company: company._id })

    return fund
  }
)

export const deleteFinancialFund = isAuthenticatedResolver.createResolver(
  async (parent, { input: { id } }, { user, company }, info) => {
    const fund = await FinancialFund.findOne({ _id: id, company: company._id })

    if (!fund) throw new Error('Conta não existe')

    await FinancialFund.deleteOne({ _id: fund._id, company: company._id })

    await FinancialStatement.deleteMany({ financialFund: fund._id, company: company._id })

    return fund
  }
)

export const updateFinancialFund = isAuthenticatedResolver.createResolver(
  async (parent, { input: { id, ...data } }, { user, company }, info) => {
    const fund = await FinancialFund.findOne({ _id: id, company: company._id })

    if (!fund) throw new Error('Conta não existe')

    fund.set(data)
    await fund.save()

    return fund
  }
)

export const adjustFinancialFund = isAuthenticatedResolver.createResolver(
  async (
    parent,
    { input: { id, balance, shouldCreateFinancialStatement } },
    { user, company },
    info
  ) => {
    const fund = await FinancialFund.adjust(
      id,
      balance,
      shouldCreateFinancialStatement,
      company,
      user
    )

    return fund
  }
)
