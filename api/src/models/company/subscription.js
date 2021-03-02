import mongoose from 'src/mongoose'

import { StripePaymentStatus, StripeSubscriptionStatus } from 'src/utils/enums'

const { Mixed } = mongoose.Schema.Types

const Subscription = new mongoose.Schema(
  {
    type: Mixed,
    stripeSubscriptionId: String,
    code: { type: String, maxlength: 32, default: null },
    plan: {
      type: Mixed,
      id: String,
      amount: Number,
      product: String,
      interval: String,
      currency: String
    },
    canceledAt: Date,
    canceltAtPeriodEnd: Boolean,
    currentPeriodEnd: Date,
    currentPeriodStart: Date,
    // https://stripe.com/docs/payments/intents#intent-statuses
    paymentStatus: { type: String, enum: Object.values(StripePaymentStatus) },
    // https://stripe.com/docs/billing/lifecycle#subscription-states
    status: {
      type: String,
      enum: Object.values(StripeSubscriptionStatus),
      maxlength: 32,
      default: StripeSubscriptionStatus.INCOMPLETE
    }
  },
  { _id: false }
)

export { Subscription as default }
