import { USER } from 'src/test/common/payloads/users'

export const PRODUCT_INTERNAL = {
  gtin: '2000001000014',
  name: 'produto test',
  price: 12.9,
  measurement: 'unit',
  internal: true
}

export const PRODUCT_INTERNAL_GTIN_WRONG = {
  gtin: '12.9',
  name: 'produto test',
  price: 12.9,
  measurement: 'unit',
  internal: true
}

export const PRODUCT_EXTERNAL = {
  gtin: '78905351',
  name: 'cerveja original',
  price: 8.35,
  measurement: 'unit',
  internal: false
}

export const PRODUCT_1 = {
  _id: '5e7173b0752e43003da170cd',
  gtin: '7894900015126',
  name: 'coca cola ls 1l cx-12',
  measurement: 'unit',
  ncm: '22021000',
  internal: false,
  deleted: false
}

export const PRODUCT_2 = {
  _id: '5e7905fd0ca555002f0f2096',
  gtin: '2000001000021',
  name: 'produto 2',
  description: 'descrição',
  measurement: 'unit',
  ncm: '22021000',
  internal: true,
  deleted: false
}

export const PRODUCT_3 = {
  _id: '5e7905e30ca555002f0f2093',
  gtin: '2000001000014',
  name: 'produto 1',
  description: null,
  measurement: 'unit',
  ncm: '22021000',
  internal: true,
  deleted: false
}

export const PRODUCT_4 = {
  _id: '5a25f528702ded00142d276f',
  gtin: '2000001000014',
  name: 'produto 4',
  description: null,
  measurement: 'unit',
  internal: true
}

export const USER_PRODUCT_1 = {
  _id: '5e7e648f64402dd1303f0f45',
  deleted: false,
  createdBy: USER._id,
  product: PRODUCT_1._id,
  name: PRODUCT_1.name,
  price: 50,
  _completion: ['coca cola ls cx', 'cola ls cx', 'ls cx', 'cx']
}

export const USER_PRODUCT_2 = {
  _id: '5e7e649be1e2271b66e60dfb',
  deleted: false,
  createdBy: USER._id,
  product: PRODUCT_2._id,
  name: PRODUCT_2.name,
  price: 26.39,
  _completion: ['produto'],
  createdAt: '2020-03-27T18:08:10.211+00:00',
  updatedAt: '2020-03-27T18:08:58.142+00:00'
}

export const USER_PRODUCT_3 = {
  _id: '5e7e64a58818793bb705dc52',
  deleted: false,
  createdBy: USER._id,
  product: PRODUCT_3._id,
  name: PRODUCT_3.name,
  price: 12.3,
  _completion: ['produto']
}

export const USER_PRODUCT_4 = {
  _id: '5d2beb72195cff00121cff4d',
  createdBy: USER._id,
  product: PRODUCT_4._id,
  name: PRODUCT_4.name,
  price: 12.3,
  bundle: [
    {
      product: PRODUCT_1._id,
      quantity: 1
    },
    {
      product: PRODUCT_2._id,
      quantity: 2
    }
  ],
  _completion: ['produto']
}

export const GET_PRODUCTS_INPUT = {
  pagination: {
    first: 51,
    skip: 0
  }
}
