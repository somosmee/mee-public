import mapIfoodCategory from 'src/mapper/ifood/category'
import mapIfoodComplement from 'src/mapper/ifood/complement'
import deliveryMethod from 'src/mapper/ifood/deliveryMethod'
import items from 'src/mapper/ifood/items'
import mapIfoodOption from 'src/mapper/ifood/option'
import payments from 'src/mapper/ifood/payments'
import mapIfoodSku from 'src/mapper/ifood/sku'
import status from 'src/mapper/ifood/status'

import { Origins } from 'src/utils/enums'

const mapIfoodOrderToOrder = (data) => {
  const payload = {
    ifood: {
      reference: data.reference,
      status: data.status,
      payments: data.payments,
      customer: data.customer,
      benefits: data.benefits
    },
    shortID: data.shortReference,
    origin: Origins.IFOOD,
    delivery: {
      fee: data.deliveryFee,
      address: {
        street: data.deliveryAddress.streetName,
        number: data.deliveryAddress.streetNumber,
        complement: data.deliveryAddress.complement,
        district: data.deliveryAddress.neighborhood,
        city: data.deliveryAddress.city,
        state: data.deliveryAddress.state,
        postalCode: data.deliveryAddress.postalCode
      },
      method: deliveryMethod(data?.deliveryMethod?.mode || data.type)
    },
    items: items(data.items),
    payments: payments(data.payments, status(data.status)),
    status: status(data.status),
    total: data.totalPrice,
    subtotal: data.subTotal,
    totalPaid: data.totalPrice
  }

  return payload
}

export {
  mapIfoodOrderToOrder as default,
  mapIfoodCategory,
  mapIfoodSku,
  mapIfoodComplement,
  mapIfoodOption
}
