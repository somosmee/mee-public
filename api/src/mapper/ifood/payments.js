import * as Sentry from '@sentry/node'

import {
  Payments,
  OrderStatus,
  IncomeCategories,
  VOUCHERS,
  CREDIT_CARDS,
  DEBT_CARDS,
  CASH
} from 'src/utils/enums'
import logger from 'src/utils/logger'

const payments = (payments, status) => {
  const payloads = []
  let payload

  for (const payment of payments) {
    if (VOUCHERS.includes(payment.code)) {
      payload = { method: Payments.VOUCHER, received: payment.changeFor }
    } else if (CREDIT_CARDS.includes(payment.code)) {
      payload = { method: Payments.CREDIT, received: payment.value }
    } else if (DEBT_CARDS.includes(payment.code)) {
      payload = { method: Payments.DEBT, received: payment.value }
    } else if (CASH.includes(payment.code)) {
      payload = { method: Payments.CASH, received: payment.value }
    } else {
      logger.error('[ifood payments mapper] Payment method doesn`t exist', payment)
      Sentry.captureException(new Error('Payment method doesn`t exist'))
    }

    payload.value = payment.value
    payload.prepaid = payment.prepaid
    if (!payment.prepaid && status === !OrderStatus.CLOSED) {
      payload.pending = true
      payload.createdAt = null
    } else {
      payload.pending = false
      payload.createdAt = Date.now()
    }

    payload.category = IncomeCategories.SALE

    payloads.push(payload)
  }

  return payloads
}

export { payments as default }
