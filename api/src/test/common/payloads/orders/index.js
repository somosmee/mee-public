import { PRODUCT_1, USER_PRODUCT_1 } from 'src/test/common/payloads/products'
import { USER } from 'src/test/common/payloads/users'

import { Reasons, SalesInvoiceStatus } from 'src/utils/enums'

export const ORDER = {
  _id: '5e5062782ff2be5c9e4ea593',
  ifood: { reference: '6024262506375066', status: 'CONFIRMED' },
  __v: '0',
  createdAt: '2020-02-21T23:06:32.250+00:00',
  delivery: {
    address: {
      street: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari',
      number: '100',
      complement: null,
      district: 'Bujari',
      city: 'Bujari',
      state: 'AC',
      postalCode: '00000000'
    }
  },
  createdBy: '5e76238844bdd0be816a460f',
  items: [
    {
      gtin: '2000001000014',
      name: 'PEDIDO DE TESTE - Teste item promobomb',
      price: 10,
      measurement: 'unit',
      quantity: 1
    }
  ],
  origin: 'ifood',
  payments: [],
  status: 'open',
  total: 20,
  subtotal: 20,
  totalPaid: 20,
  updatedAt: '2020-02-21T23:08:32.204+00:00'
}

export const OPEN_ORDER = {
  _id: '5e7420a50fa32d0176a49e8d',
  ifood: { payments: [] },
  invoice: { status: SalesInvoiceStatus.PENDING },
  items: [
    {
      product: PRODUCT_1._id,
      gtin: PRODUCT_1.gtin,
      name: PRODUCT_1.name,
      description: null,
      price: USER_PRODUCT_1.price,
      measurement: PRODUCT_1.measurement,
      ncm: PRODUCT_1.ncm,
      quantity: 2,
      note: ''
    }
  ],
  payments: [],
  status: 'open',
  origin: 'mee',
  createdBy: USER._id,
  total: 100,
  subtotal: 100,
  totalPaid: 0,
  createdAt: '2020-03-20T01:47:17.229+00:00',
  updatedAt: '2020-03-20T01:47:17.229+00:00',
  __v: 0
}

export const CLOSED_ORDER = {
  _id: '5e7420a50fa32d0176a49e8e',
  ifood: { payments: [] },
  items: [
    {
      product: PRODUCT_1._id,
      gtin: PRODUCT_1.gtin,
      name: PRODUCT_1.name,
      description: null,
      price: USER_PRODUCT_1.price,
      measurement: PRODUCT_1.measurement,
      ncm: PRODUCT_1.ncm,
      quantity: 2,
      note: ''
    }
  ],
  payments: [{ received: true, method: 'cash', value: 100 }],
  status: 'closed',
  origin: 'mee',
  createdBy: USER._id,
  total: 100,
  subtotal: 100,
  totalPaid: 100,
  createdAt: '2020-03-20T01:47:17.229+00:00',
  updatedAt: '2020-03-20T01:47:17.229+00:00',
  __v: 0
}

export const INVENTORY = {
  _id: '5e73e40f2e56e007df0663c7',
  quantity: 10,
  reason: Reasons.ACQUISITION,
  product: PRODUCT_1._id,
  balance: 10,
  createdBy: USER._id,
  createdAt: '2020-03-19T21:28:47.851+00:00',
  updatedAt: '2020-03-19T21:28:47.851+00:00',
  __v: 0
}
