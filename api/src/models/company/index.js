import * as Sentry from '@sentry/node'

import ifood from 'src/ifood'

import mongoose from 'src/mongoose'

import { UserProduct } from 'src/models'
import Certificate from 'src/models/company/certificate'
import FinancialStatementCategory from 'src/models/company/financialStatementCategory'
import Ifood from 'src/models/company/ifood'
import Loggi from 'src/models/company/loggi'
import PaymentMethod from 'src/models/company/paymentMethod'
import ProductionLine from 'src/models/company/productionLine'
import PurchasePaymentMethod from 'src/models/company/purchasePaymentMethod'
import Settings from 'src/models/company/settings'
import Shopfront from 'src/models/company/shopfront'
import Subscription from 'src/models/company/subscription'
import Tax from 'src/models/company/tax'
import TeamMember from 'src/models/company/teamMember'
import { Address } from 'src/models/shared'

import ibge from 'src/services/ibge'
import map from 'src/services/map'

import {
  Conditions,
  Roles,
  DefaultPaymentMethods,
  DefaultExpenseCategories,
  DefaultIncomeCategories,
  DefaultPurchasePaymentMethods
} from 'src/utils/enums'
import logger from 'src/utils/logger'
import { getNextCompanyNumber } from 'src/utils/user'

const { ObjectId } = mongoose.Types
const { Mixed } = mongoose.Schema.Types

const CompanySchema = new mongoose.Schema(
  {
    createdBy: {
      type: ObjectId,
      index: true,
      ref: 'User',
      required: true
    },
    number: {
      type: Number,
      min: 1,
      max: 9999,
      unique: true,
      required: true
    },
    name: {
      type: String,
      default: '',
      trim: true
    },
    mobile: String,
    members: [TeamMember],
    paymentMethods: { type: [PaymentMethod], default: [] },
    purchasePaymentMethods: { type: [PurchasePaymentMethod], default: [] },
    expenseCategories: { type: [FinancialStatementCategory], default: [] },
    incomeCategories: { type: [FinancialStatementCategory], default: [] },
    productionLines: { type: [ProductionLine], default: [] },
    nationalId: String,
    stateId: String,
    description: {
      type: String,
      trim: true
    },
    banner: {
      type: String,
      set: function(banner) {
        this._banner = this.banner
        return banner
      }
    },
    picture: {
      type: String,
      set: function(picture) {
        this._picture = this.picture
        return picture
      }
    },
    certificate: {
      type: Certificate,
      set: function(certificate) {
        this._certificate = this.certificate
        return certificate
      }
    },
    stripeCustomerId: String,
    card: Mixed,
    subscription: Subscription,
    address: Address,
    ifood: { type: Ifood, default: {} },
    loggi: Loggi,
    tax: { type: Tax, default: {} },
    billableItems: [
      {
        type: Mixed,
        order: {
          type: ObjectId,
          ref: 'Order',
          required: true
        },
        totalOrder: { type: Number, required: true },
        fee: { type: Number, required: true },
        totalFee: { type: Number, required: true }
      }
    ],
    settings: { type: Settings, default: {} },
    shopfront: Shopfront
  },
  {
    timestamps: true
  }
)

CompanySchema.statics.createCompany = async function(user, input = {}) {
  const Company = this
  const data = {
    ...input,
    createdBy: user._id,
    members: [
      {
        user: user._id,
        role: Roles.BUSINESS_ADMIN
      }
    ],
    number: 1,
    paymentMethods: DefaultPaymentMethods,
    purchasePaymentMethods: DefaultPurchasePaymentMethods,
    expenseCategories: DefaultExpenseCategories,
    incomeCategories: DefaultIncomeCategories
  }

  data.number = await getNextCompanyNumber()

  const company = await new Company(data).save()
  return company
}

CompanySchema.methods.calculateDeliveryFee = async function(order) {
  let fee = 0.0
  let distance = 0.0
  const company = this
  const address = order?.delivery?.address

  logger.debug(`[calculateDeliveryFee] order address ${JSON.stringify(address)}`)
  logger.debug(`[calculateDeliveryFee] user address ${JSON.stringify(company.address)}`)

  try {
    if (!address.lat || !address.lng) {
      const geoData = await map.geocodeAddress(address)
      address.lat = geoData.lat
      address.lng = geoData.lng

      // check if this is actually an orders or we are just getting delivery details
      if (order._id) {
        order.delivery.set({ address })
        await order.save()
      }
    }

    if (!company?.address?.lat || !company?.address?.lng) {
      const geoData = await map.geocodeAddress(company.address)
      company.address.lat = geoData.lat
      company.address.lng = geoData.lng

      await company.save()
    }

    distance = map.calculateDistance(order.delivery.address, company.address)

    logger.debug(`[calculateDeliveryFee] delivery: ${JSON.stringify(order.delivery.address)}`)
    logger.debug(`[calculateDeliveryFee] address: ${JSON.stringify(company.address)}`)
    logger.debug(`[calculateDeliveryFee] distance ${distance}`)

    if (company.settings.delivery) {
      for (const rule of company.settings.delivery) {
        logger.debug(`[calculateDeliveryFee] rule ${rule}`)
        if (rule.condition === Conditions.LESS_THAN) {
          if (distance <= rule.distance) {
            fee = rule.fee
            break
          }
        } else {
          if (distance >= rule.distance) {
            fee = rule.fee
            break
          }
        }
      }
    }
  } catch (e) {
    logger.error(`[calculateDeliveryFee] ERROR: ${JSON.stringify(e)}`)
    return { fee: 0.0, distance: 0.0 }
  }

  return {
    fee,
    distance
  }
}

CompanySchema.statics.fetchIBGECityCode = async function(id, address) {
  const User = this

  const user = await User.findOne({ _id: id })

  if (address?.state) {
    const cities = await ibge.getCitiesFromUF(address.state)

    const city = cities.find((c) => c.nome === address.city)

    if (!city) {
      logger.error(`[fetchIBGECityCode] CIDADE NÃO ENCONTRADA: ${JSON.stringify(address.city)}`)
    } else {
      logger.debug(`[fetchIBGECityCode] city ${address.city} found ${city.id.toString()}`)
      user.tax.ibgeCityCode = city.id.toString()
      await user.save()
    }
  } else {
    logger.error('[fetchIBGECityCode] user has no address.state')
  }
}

CompanySchema.methods.refreshIfoodToken = async function() {
  const company = this

  logger.debug(`[refreshIfoodToken] REFRESHING USER { _id: ${company._id} } IFOOD TOKEN`)

  if (!company.ifood) {
    throw new Error(`Company { _id: ${company._id} dont have necessary ifood credentials }`)
  }
  if (!company.ifood.username || !company.ifood.password) {
    throw new Error(`Company { _id: ${company._id} dont have necessary ifood credentials }`)
  }

  try {
    const response = await ifood.getToken(company.ifood.username, company.ifood.password)
    const latestToken = `${response.data.token_type} ${response.data.access_token}`
    company.ifood.set({ latestToken })

    await company.save()
    logger.debug(`[refreshIfoodToken]: NEW TOKEN ${company.ifood.latestToken.slice(0, 20)}`)
  } catch (error) {
    logger.error(
      `[refreshIfoodToken] user: { _id: ${company._id}, username: ${company.ifood.username}, password: ${company.ifood.password} } `,
      error
    )
    Sentry.captureException(error)
  }
}

CompanySchema.statics.populateShopfrontData = async function(company) {
  const userProductIds = company.shopfront.products

  const userProductsData = await UserProduct.find({ _id: { $in: userProductIds } })

  company.shopfront.products = userProductsData

  return {
    _id: company.shopfront._id,
    merchant: company._id,
    products: company.shopfront.products,
    picture: company.picture,
    banner: company.banner,
    name: company.name,
    address: company.address,
    delivery: company.settings.delivery
  }
}

CompanySchema.methods.saveCard = async function(paymentMethod) {
  logger.debug(`[saveCard] CARD: ${JSON.stringify(paymentMethod, null, 2)}`)
  const company = this

  const {
    card,
    billing_details: { address, email, name, phone }
  } = paymentMethod

  company.card = {
    id: paymentMethod.id,
    billingDetails: {
      address: {
        city: address.city,
        country: address.country,
        line1: address.line1,
        line2: address.line2,
        postalCode: address.postal_code,
        state: address.state
      },
      email,
      name,
      phone
    },
    brand: card.brand,
    checks: {
      addressLine1Check: card.checks.address_line1_check,
      postalCodeCheck: card.checks.address_postal_code_check,
      cvcCheck: card.checks.cvc_check
    },
    country: card.country,
    expMonth: card.exp_month,
    expYear: card.exp_year,
    fingerprint: card.fingerprint,
    funding: card.funding,
    generatedFrom: card.generated_from,
    last4: card.last4,
    threeDSecureUsage: {
      supported: card.three_d_secure_usage.supported
    },
    wallet: card.wallet,
    created: paymentMethod.created,
    livemode: paymentMethod.livemode
  }

  await company.save()
}

CompanySchema.methods.saveSubscription = async function(sub) {
  logger.debug(`[saveSubscription] STRIPE_SUB: ${JSON.stringify(sub, null, 2)}`)
  const company = this

  company.subscription = {
    status: sub.status,
    stripeSubscriptionId: sub.id,
    canceledAt: sub.canceled_at,
    canceltAtPeriodEnd: sub.cancel_at_period_end,
    currentPeriodEnd: sub.current_period_end,
    currentPeriodStart: sub.current_period_start,
    paymentStatus: sub.latest_invoice.payment_intent.status
  }

  if (sub && sub.plan) {
    const plan = sub.plan
    company.subscription.plan = {
      id: plan.id,
      amount: plan.amount,
      product: plan.product,
      interval: plan.interval,
      currency: plan.currency
    }
  }

  await company.save()
}

export default mongoose.model('Company', CompanySchema)
