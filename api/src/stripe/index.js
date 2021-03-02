import Stripe from 'stripe'

import { Company } from 'src/models'

import { UserBillStatus } from 'src/utils/enums'
import logger from 'src/utils/logger'

const api = Stripe(process.env.STRIPE_API_KEY)

export const processEvent = async (event) => {
  if (event.type === 'payment_method.attached') {
    await saveCard(event.data.object)
  } else if (event.type === 'customer.subscription.created') {
    await saveSubscription(event.data.object)
  }
}

export const saveCard = async (card) => {
  if (!card) throw new Error('Card object is missing!')

  let company = await Company.findOne({ stripeCustomerId: card.customer })

  if (!company) {
    company = await Company.findOne({ email: card.billing_details.email })

    if (!company) throw new Error('Company not found to attach card info!')
  }

  await company.saveCard(card)
}

export const retryBillCharge = async (company, bill) => {
  if (!bill.paymentIntent && !bill.paymentIntent.id) {
    throw new Error('Ainda não houve tentativa de pagamento nessa cobrança')
  }

  const currentPaymentIntent = await api.paymentIntents.retrieve(bill.paymentIntent.id)

  if (currentPaymentIntent.status === 'success') {
    throw new Error(
      'A tentativa de pagamento nessa cobrança foi bem sucedida. Qualquer dúvida entre em contato com oi@somosmee.com'
    )
  }

  // cancel previous payment intent
  await api.paymentIntents.cancel(currentPaymentIntent.id)

  // try again
  await chargeCustomer(company, bill)
}

/**
 * Charge customer with outstaind value. Check: https://stripe.com/docs/testing
 * - 4242 4242 4242 4242 (visa no auth)
 * - 5555555555554444 (mastercard no auth)
 * - 4000 0027 6000 3184 (visa auth required)
 * - fail responses: https://stripe.com/docs/testing#cards-responses
 * - 4000 0082 6000 3178 (success on attach card but fails every other charge attempt)
 * - 4000 0027 6000 3184 (3d secure)
 * @param  {Company}  company    database company
 * @param  {Float}  amount amout to be charged
 * @return {Promise}
 */

export const chargeCustomer = async (company, bill) => {
  logger.debug(
    `[chargeCustomer] ${JSON.stringify(company, null, 2)} ${JSON.stringify(bill, null, 2)}`
  )
  if (!company) throw new Error('You need a user to create a new session.')
  if (!company.stripeCustomerId) throw new Error('Company must have a stripe customer id.')
  if (!company.card) throw new Error('Company dont have an default payment method')

  const paymentMethods = await api.paymentMethods.list({
    customer: company.stripeCustomerId,
    type: 'card'
  })

  // get default payment method
  const defaultPaymentMethod = paymentMethods.data.find((pm) => pm.id === company.card.id)
  if (!defaultPaymentMethod) {
    throw new Error(`No default payment method found for company ${company.id}`)
  }

  let paymentIntent

  try {
    paymentIntent = await api.paymentIntents.create({
      amount: bill.total.toFixed(2).replace('.', ''),
      currency: 'brl',
      customer: company.stripeCustomerId,
      payment_method: defaultPaymentMethod.id,
      off_session: true,
      confirm: true
    })

    bill.paymentIntent = paymentIntent
    bill.status = UserBillStatus.SUCCESS
    bill.markModified('paymentIntent')
    await bill.save()

    return paymentIntent
  } catch (err) {
    /*
      Error code will be authentication_required if authentication is needed
      Check errors handling:
      - https://stripe.com/docs/api/errors/handling
      - https://stripe.com/docs/api/payment_intents/object#payment_intent_object-last_payment_error-decline_code
      - https://stripe.com/docs/upgrades#2019-02-11
     */
    logger.error(`[chargeCustomer] PAYMENT_INTENT_ERROR: ${JSON.stringify(err, null, 2)}`)

    if (err?.raw?.payment_intent?.id) {
      const paymentIntentRetrieved = await api.paymentIntents.retrieve(err.raw.payment_intent.id)

      bill.paymentIntent = paymentIntentRetrieved
      bill.status = UserBillStatus.FAILED
      bill.markModified('paymentIntent')
      await bill.save()
    }

    throw err
  }
}

export const saveSubscription = async (sub) => {
  console.log('SUB:', sub)
  if (!sub) throw new Error('Subscription object is missing!')

  const company = await Company.findOne({ stripeCustomerId: sub.customer })

  if (!company) throw new Error('Company not found with that stripe customer:', sub.customer)

  const updatedSub = await api.subscriptions.retrieve(sub.id, {
    expand: ['latest_invoice.payment_intent']
  })

  await company.saveSubscription(updatedSub)
}

/**
 * Get stripe customer for given company. If company dont have a customer it will create a new one.
 * @param  {Company}  company
 * @return {Promise} stripe customer object
 */
export const ensureCustomer = async (user, company) => {
  let customer = null
  if (!company.stripeCustomerId) {
    customer = await api.customers.create({
      email: user.email
    })

    company.stripeCustomerId = customer.id
    await company.save()
  } else {
    customer = await api.customers.retrieve(company.stripeCustomerId)
  }

  return customer
}

/**
 * [resyncStripeData description]
 * @param  {Company}  company company to be resynced
 * @return {Promise}      [description]
 */
export const resyncStripeData = async (company) => {
  if (!company.stripeCustomerId) throw Error('Company dont have an Customer ID')

  const customer = await api.customers.retrieve(company.stripeCustomerId)

  const paymentMethods = await api.paymentMethods.list({
    customer: company.stripeCustomerId,
    type: 'card'
  })

  logger.debug(
    `[resyncStripeData] CUSTOMER: ${JSON.stringify(customer, null, 2)} PMs: ${JSON.stringify(
      paymentMethods,
      null,
      2
    )}`
  )

  if (!customer.default_source) {
    await company.saveCard(paymentMethods.data[0])
  } else {
    const defaultPaymentMethod = paymentMethods.data.find((pm) => pm.id === customer.default_source)
    if (defaultPaymentMethod) {
      await company.saveCard(defaultPaymentMethod)
    }
    logger.error(
      `NO PAYMENT METHOD FOUND CUSTOMER: ${JSON.stringify(customer, null, 2)} PMs: ${JSON.stringify(
        paymentMethods,
        null,
        2
      )}`
    )
  }
}

export const createSupportCheckoutSession = async (company, planType) => {
  if (!company) throw new Error('You need a company to create a new session.')
  if (!company.stripeCustomerId) throw new Error('Company must have a stripe customer id.')
  if (!planType) throw new Error('Plan type is required.')

  const data = {
    customer: company.stripeCustomerId,
    payment_method_types: ['card'],
    mode: 'subscription',
    subscription_data: {
      items: [
        {
          plan:
            planType === 'standard'
              ? process.env.STRIPE_STANDARD_PLAN
              : process.env.STRIPE_PREMIUM_PLAN
        }
      ]
    },
    success_url: `${process.env.APP_URL}/support?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_URL}/support`
  }

  const session = await api.checkout.sessions.create(data)

  return { session: session.id }
}

export const createSetupSession = async (company, screen) => {
  if (!company) throw new Error('You need a user to create a new session.')
  if (!company.stripeCustomerId) throw new Error('Company must have a stripe customer id.')

  let successUrl = `${process.env.APP_URL}/billing?session_id={CHECKOUT_SESSION_ID}`
  let cancelUrl = `${process.env.APP_URL}/billing`

  if (screen === 'ifood') {
    successUrl = `${process.env.APP_URL}/deliveries/ifood/setup?session_id={CHECKOUT_SESSION_ID}`
    cancelUrl = `${process.env.APP_URL}/deliveries/ifood/setup`
  }

  if (screen === 'loggi') {
    successUrl = `${process.env.APP_URL}/deliveries/loggi/setup?session_id={CHECKOUT_SESSION_ID}`
    cancelUrl = `${process.env.APP_URL}/deliveries/loggi/setup`
  }

  const data = {
    customer: company.stripeCustomerId,
    payment_method_types: ['card'],
    mode: 'setup',
    success_url: successUrl,
    cancel_url: cancelUrl
  }

  const session = await api.checkout.sessions.create(data)

  return { session: session.id }
}

export default {
  processEvent,
  chargeCustomer,
  ensureCustomer,
  retryBillCharge,
  resyncStripeData,
  createSetupSession,
  createSupportCheckoutSession
}
