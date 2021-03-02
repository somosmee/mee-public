import { FinancialStatement, FinancialFund, Order, Purchase } from 'src/models'

import { isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import { FinancialOperations } from 'src/utils/enums'
import logger from 'src/utils/logger'
import { createPaginationPayload, enforcePaginationParams } from 'src/utils/pagination'

export const financialStatements = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    const { first, skip } = enforcePaginationParams(input && input.pagination)

    const conditions = { company: company._id }
    const options = { skip: skip, limit: first }
    const financialStatements = await FinancialStatement.find(conditions, null, options).sort({
      dueAt: -1
    })
    if (!financialStatements) throw new Error('Error while fetch customers')

    const count = await FinancialStatement.countDocuments(conditions)

    const customersPayload = {
      financialStatements,
      pagination: createPaginationPayload({ first, skip, count })
    }

    return customersPayload
  }
)

export const createFinancialStatement = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { user, company }, info) => {
    if (input.financialFund) {
      const fund = await FinancialFund.findOne({ _id: input.financialFund })
      if (!fund) throw Error('Fundo financeiro não existe!')
    }

    if (input.operation === FinancialOperations.EXPENSE) {
      const found = company.expenseCategories.find(
        (category) => category._id.toString() === input.category
      )

      if (found) input.category = found._id
    }

    if (input.operation === FinancialOperations.INCOME) {
      const found = company.incomeCategories.find(
        (category) => category._id.toString() === input.category
      )

      if (found) input.category = found._id
    }

    const statement = await FinancialStatement.createMovement(
      input,
      company._id,
      user._id,
      input.operation
    )

    return statement
  }
)

export const deleteFinancialStatement = isAuthenticatedResolver.createResolver(
  async (parent, { input: { id } }, { user, company }, info) => {
    const statement = await FinancialStatement.findOne({ _id: id, company: company._id })
    if (!statement) throw new Error('Movimentação financeira não existe!')

    if (statement.order) {
      const order = await Order.findOne({ _id: statement.order, company: company._id })

      if (!order) {
        logger.error(
          `[deleteFinancialStatement] Pedido vinculado a essa movimentação não existe mais! ${JSON.stringify(
            statement
          )}`
        )

        await FinancialStatement.deleteOne({ _id: statement._id })
      }

      await order.cancel(company, user)
    } else if (statement.purchase) {
      const purchase = await Purchase.findOne({ _id: statement.purchase, company: company._id })

      if (!purchase) {
        logger.error(
          `[deleteFinancialStatement] Compra vinculado a essa movimentação não existe mais! ${JSON.stringify(
            statement
          )}`
        )

        await FinancialStatement.deleteOne({ _id: statement._id })
      }

      await FinancialStatement.deleteOne({ _id: statement._id })
      await Purchase.deleteOne({ _id: purchase._id })
    } else {
      await FinancialStatement.deleteOne({ _id: statement._id })
    }

    return statement
  }
)
