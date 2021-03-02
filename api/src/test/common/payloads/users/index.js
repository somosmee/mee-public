import { ICMSTaxRegimes, ICMSTaxGroup, IncidenceRegimes } from 'src/utils/enums'

export const USER = {
  _id: '5e76238844bdd0be816a460f',
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
    sales: false,
    products: true,
    customers: true,
    accountant: true,
    tags: false,
    purchases: false,
    suppliers: false,
    deliveries: false
  },
  nationalId: '35725558000119',
  stateId: '11111111111',
  tax: {
    icmsRegime: ICMSTaxRegimes.NORMAL,
    icmsTaxGroup: ICMSTaxGroup.INTEGRAL,
    incidenceRegime: IncidenceRegimes.CUMULATIVE
  },
  employees: [],
  proxies: [],
  email: 'user@email.com',
  name: 'User Name',
  picture: '',
  role: 'employer',
  companyNumber: 1,
  address: {
    street: 'Rua Benedito Caim',
    number: '92',
    complement: 'Apto 1',
    district: 'Vila Mariana',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '04121-070',
    lat: -23.598533,
    lng: -46.6243687
  },
  ifood: { open: false },
  settings: {
    priceRules: [
      {
        _id: '5ed1926036e7dc010fd05199',
        name: 'Comissão',
        amount: 1,
        operationType: 'percentage',
        channels: ['ifood'],
        active: true
      }
    ]
  },
  shopfront: {
    _id: '5f68b1e1ba458e003d6803bd',
    products: ['5e7e648f64402dd1303f0f45']
  },

  createdAt: '2020-03-18T21:51:37.238+00:00',
  updatedAt: '2020-03-18T21:51:37.238+00:00',
  __v: 0
}

export const NEW_USER = {
  googleIdToken:
    'eyJhbGciOiJSUzI1NiIsImtpZCI6ImMxNzcxODE0YmE2YTcwNjkzZmI5NDEyZGEzYzZlOTBjMmJmNWI5MjciLCJ0eXAiOiJKV1QifQ'
}

export const NEW_USER_REFERRAL = {
  googleIdToken:
    'eyJhbGciOiJSUzI1NiIsImtpZCI6ImMxNzcxODE0YmE2YTcwNjkzZmI5NDEyZGEzYzZlOTBjMmJmNWI5MjciLCJ0eXAiOiJKV1QifQ',
  referral: 'LSX3'
}

export const NEW_PRICE_RULE = {
  rules: [
    {
      name: 'Comissão',
      amount: 1,
      operationType: 'percentage',
      channels: ['ifood'],
      active: true
    }
  ]
}

export const PRICE_RULE_UPDATE = {
  id: '5ed1926036e7dc010fd05199',
  name: 'Comissão',
  amount: 1.8,
  operationType: 'percentage',
  channels: ['ifood'],
  active: false
}

export const PRICE_RULE = {
  id: '5ed1926036e7dc010fd05199'
}
