import stripe from 'src/stripe'

import { UserBill } from 'src/models'

import { isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import logger from 'src/utils/logger'

// setup payment method
export const createSetupSession = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { user, company }, info) => {
    // ensure that our user has a stripe customer
    await stripe.ensureCustomer(user, company)

    const session = await stripe.createSetupSession(company, input && input.screen)

    return session
  }
)

// support subscription session
export const createSupportCheckoutSession = isAuthenticatedResolver.createResolver(
  async (parent, { input: { planType } }, { user, company }, info) => {
    // ensure that our user has a stripe customer
    await stripe.ensureCustomer(user, company)

    const session = await stripe.createSupportCheckoutSession(company, planType)

    return session
  }
)

export const retryBillPayment = isAuthenticatedResolver.createResolver(
  async (parent, { userBillId }, { user, company }, info) => {
    // ensure that our user has a stripe customer
    await stripe.ensureCustomer(user, company)

    if (!user.card) throw new Error('Usuário não tem um método de pagamento configurado')

    const bill = await UserBill.findOne({
      user: user._id,
      _id: userBillId
    })

    if (!bill) {
      logger.error(
        `[retryBillPayment] Bill not found for this user. USER: ${user.email} BILL: ${userBillId}`
      )
      throw new Error('Cobrança não encontrada para esse usuário')
    }

    await stripe.retryBillCharge(company, bill)

    return user
  }
)
