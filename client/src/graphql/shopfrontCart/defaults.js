import { DeliveryTypes } from 'src/utils/enums'

const defaults = {
  items: [],
  payments: [],
  nationalId: null,
  delivery: {
    method: DeliveryTypes.indoor.type,
    fee: 0.0,
    address: {
      street: null,
      number: null,
      complement: null,
      district: null,
      city: null,
      state: null,
      postalCode: null,
      lat: null,
      lng: null,
      __typename: 'Address'
    },
    __typename: 'Delivery'
  },
  subtotal: 0,
  __typename: 'ShopfrontCart'
}

export { defaults as default }
