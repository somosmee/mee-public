import * as Sentry from '@sentry/node'

import { OrderStatus, IfoodOrderStatus } from 'src/utils/enums'
import logger from 'src/utils/logger'

const status = (status) => {
  switch (status) {
    case IfoodOrderStatus.PLACED:
      return OrderStatus.OPEN
    case IfoodOrderStatus.INTEGRATED:
      return OrderStatus.OPEN
    case IfoodOrderStatus.DISPATCHED:
      return OrderStatus.OPEN
    case IfoodOrderStatus.CONFIRMED:
      return OrderStatus.OPEN
    case IfoodOrderStatus.CANCELLATION_REQUESTED:
      return OrderStatus.OPEN
    case IfoodOrderStatus.CANCELLATION_REQUEST_FAILED:
      return OrderStatus.OPEN
    case IfoodOrderStatus.REJECTION:
      return OrderStatus.CANCELED
    case IfoodOrderStatus.CANCELLED:
      return OrderStatus.CANCELED
    case IfoodOrderStatus.DELIVERED:
      return OrderStatus.OPEN
    case IfoodOrderStatus.CONCLUDED:
      return OrderStatus.CLOSED
    default:
      logger.error('[ifood payments mapper] Status doesn`t exist', status)
      Sentry.captureException(new Error('Status doesn`t exist'))
      break
  }
}

export { status as default }
