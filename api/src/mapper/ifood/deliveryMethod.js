import * as Sentry from '@sentry/node'

import { DeliveryMethods, IfoodDeliveryMode } from 'src/utils/enums'
import logger from 'src/utils/logger'

const deliveryMethod = (mode) => {
  switch (mode) {
    case IfoodDeliveryMode.DELIVERY:
      return DeliveryMethods.DELIVERY
    case IfoodDeliveryMode.TAKEOUT:
      return DeliveryMethods.TAKEOUT
    case IfoodDeliveryMode.INDOOR:
      return DeliveryMethods.INDOOR
    default:
      logger.error('[ifood delivery mode mapper] Mode doesn`t exist', mode)
      Sentry.captureException(new Error('Mode doesn`t exist'))
      break
  }
}

export { deliveryMethod as default }
