import moment from 'moment'

import { RegisterOperation, FinancialFund, FinancialStatement } from 'src/models'

import { isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import {
  RegisterOperationTypes,
  IncomeCategories,
  FinancialOperations,
  ExpenseCategories,
  DefaultPaymentMethods
} from 'src/utils/enums'
import { createPaginationPayload, enforcePaginationParams } from 'src/utils/pagination'

export const registerOperations = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { user, company }, info) => {
    const { first, skip } = enforcePaginationParams({ ...input })
    const options = { skip, limit: first }
    const conditions = { company: company._id }

    const registerOperations = await RegisterOperation.find(conditions, null, options).sort({
      createdAt: -1
    })

    const count = await RegisterOperation.countDocuments(conditions)

    return { registerOperations, pagination: createPaginationPayload({ first, skip, count }) }
  }
)

export const createRegisterOperation = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { user, company }, info) => {
    const registerOperation = new RegisterOperation({
      ...input,
      company: company._id,
      createdBy: user._id
    })
    await registerOperation.save()

    // adjust register balances
    for (const register of registerOperation.registers) {
      if (register.balance !== register.realBalance) {
        await FinancialFund.adjust(register.register, register.realBalance, false, company, user)
      }
    }

    if (registerOperation.operationType === RegisterOperationTypes.CLOSE) {
      for (const payment of registerOperation.paymentMethods) {
        if (payment.total !== payment.realTotal) {
          const value = payment.realTotal - payment.total

          const paymentMethod = DefaultPaymentMethods.find((pay) => pay.method === payment.method)

          await FinancialStatement.createMovement(
            {
              value,
              paid: true,
              category: value >= 0 ? IncomeCategories.ADJUSTMENT : ExpenseCategories.ADJUSTMENT,
              description: `ajuste gerado pelo fechamento de caixa ${moment().format('DD/MM/YY')}`,
              paymentMethod: paymentMethod,
              registerOperation: registerOperation._id,
              dueAt: new Date()
            },
            company?._id,
            user?._id,
            value >= 0 ? FinancialOperations.INCOME : FinancialOperations.EXPENSE
          )
        }
      }
    }

    return registerOperation
  }
)

export const deleteRegisterOperation = isAuthenticatedResolver.createResolver(
  async (parent, { input: { id } }, { user, company }, info) => {
    const registerOperation = await RegisterOperation.findOne({ _id: id, company: company._id })

    if (!registerOperation) throw new Error('Operação não existe')

    await RegisterOperation.deleteOne({ _id: registerOperation._id, company: company._id })

    await FinancialStatement.deleteMany({
      registerOperation: registerOperation._id,
      company: company._id
    })

    return registerOperation
  }
)
