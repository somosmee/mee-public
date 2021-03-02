import { Reasons } from 'src/utils/enums'

export const USER = {
  _id: '5e7297e92402d0003e6972ac',
  permissions: {
    orders: {
      create: true,
      edit: true,
      list: true,
      closeOrder: true,
      addPayment: true,
      addItem: true
    },
    myStore: true,
    reports: true,
    billing: true,
    sales: true,
    products: true,
    customers: true,
    accountant: true,
    tags: true,
    purchases: true,
    suppliers: true,
    deliveries: true
  },
  employees: [],
  proxies: [],
  email: 'user@email.com',
  name: 'User Name',
  picture:
    'https://lh3.googleusercontent.com/a-/AOh14GjOLoIDI3AC4HBNfnuB7H_jNPbBEYk9s87jZ6MCEA=s96-c',
  role: 'employer',
  companyNumber: 1,
  ifood: { open: false },
  createdAt: '2020-03-18T21:51:37.238+00:00',
  updatedAt: '2020-03-18T21:51:37.238+00:00',
  __v: 0
}

export const PRODUCT = {
  _id: '5e7173b0752e43003da170cd',
  internal: false,
  deleted: false,
  gtin: '7894900015126',
  name: 'coca cola ls 1l cx-12',
  measurement: 'unit',
  ncm: '22021000',
  createdAt: '2020-03-18T01:04:48.564+00:00',
  updatedAt: '2020-03-18T01:04:48.564+00:00',
  __v: 0
}

export const USER_PRODUCT = {
  _id: '5e72b949ca4a020317c0bafb',
  _completion: ['coca cola ls cx', 'cola ls cx', 'ls cx', 'cx'],
  deleted: false,
  grocery: USER._id,
  product: PRODUCT._id,
  name: 'coca cola ls 1l cx-12',
  price: 5,
  createdAt: '2020-03-19T00:14:01.483+00:00',
  updatedAt: '2020-03-19T00:14:01.483+00:00',
  __v: 0
}

export const INVENTORY = {
  _id: '5e73e40f2e56e007df0663c7',
  quantity: 10,
  reason: Reasons.ACQUISITION,
  product: PRODUCT._id,
  balance: 10,
  grocery: USER._id,
  createdAt: '2020-03-19T21:28:47.851+00:00',
  updatedAt: '2020-03-19T21:28:47.851+00:00',
  __v: 0
}

export const INVENTORY_MOVEMENTS_INPUT = {
  product: PRODUCT._id,
  pagination: {
    first: 51,
    skip: 0
  }
}

export const PRODUCT_ACQUISITION = {
  product: PRODUCT._id,
  quantity: 3,
  reason: Reasons.ACQUISITION
}

export const PRODUCT_RETURN = {
  product: PRODUCT._id,
  quantity: 1,
  reason: Reasons.RETURN
}

export const INVALID_PRODUCT_ACQUISITION_PRODUCT_ID = {
  product: '123',
  quantity: 3,
  reason: Reasons.ACQUISITION
}

export const PRODUCT_INCREASE_MANUAL_ADJUSTMENT = {
  product: PRODUCT._id,
  quantity: 1,
  reason: Reasons.MANUAL_ADJUSTMENT
}

export const PRODUCT_DRECREASE_MANUAL_ADJUSTMENT = {
  product: PRODUCT._id,
  quantity: 1,
  reason: Reasons.MANUAL_ADJUSTMENT
}

export const PRODUCT_EXPIRED = {
  product: PRODUCT._id,
  quantity: 1,
  reason: Reasons.EXPIRED
}

export const PRODUCT_DAMAGED = {
  product: PRODUCT._id,
  quantity: 1,
  reason: Reasons.DAMAGED
}

export const MANUAL_ADJUSTMENT_PRODUCT_DAMAGED = {
  product: PRODUCT._id,
  balance: 10,
  reason: Reasons.MANUAL_ADJUSTMENT
}
