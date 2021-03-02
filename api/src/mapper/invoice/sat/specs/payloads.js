import { IncidenceRegimes } from 'src/utils/enums'

export const orderProduction = {
  _id: 'production',
  items: [
    {
      product: {
        _id: 'prod1',
        internal: true
      },
      gtin: '2000001000021',
      measurement: 'unit',
      name: 'Refeição',
      price: 17.9,
      quantity: 23
    }
  ],
  payments: [
    {
      method: 'cash',
      value: 411.7,
      createdAt: '2020-02-06T22:58:20.153Z'
    }
  ],
  total: 411.7
}

export const orderProductionCompany = {
  nationalId: '27412532000192',
  stateId: '141895573117',
  tax: {
    regime: '3',
    icmsTaxGroup: '00',
    incidenceRegime: IncidenceRegimes.CUMULATIVE
  }
}

export const orderProductionCustomer = {
  business: {
    nationalId: '03015395000194',
    name: 'PlanMetal'
  }
}

export const order = {
  _id: '5e3c99fd77fd4b00e5e6d0f8',
  title: null,
  items: [
    {
      product: {
        _id: '5e3c957777fd4b00e5e6d0ed',
        internal: true
      },
      gtin: '2000001000021',
      name: 'produto interno 2',
      description: 'descrição produto interno 2',
      price: 55.65,
      measurement: 'unit',
      ncm: null,
      quantity: 1,
      note: ''
    },
    {
      product: {
        _id: '5e3c956677fd4b00e5e6d0ea',
        internal: true
      },
      gtin: '2000001000014',
      name: 'produto interno 1',
      description: 'descrição produto interno 1',
      price: 14.34,
      measurement: 'unit',
      ncm: null,
      quantity: 2,
      note: ''
    },
    {
      product: {
        _id: '5e3c955477fd4b00e5e6d0e7',
        internal: false
      },
      gtin: '7896006762003',
      name: 'arroz  camil premium branco 1kg',
      description: 'reserva especial',
      price: 3.45,
      measurement: 'kilogram',
      ncm: null,
      quantity: 3,
      note: ''
    },
    {
      product: {
        _id: '5e3c950f77fd4b00e5e6d0e4',
        internal: false
      },
      gtin: '7891031409404',
      name: 'ketchup tradicional hemmer',
      description: null,
      price: 4.99,
      measurement: 'unit',
      ncm: null,
      quantity: 4,
      note: ''
    },
    {
      product: {
        _id: '5e3c94e077fd4b00e5e6d0e1',
        internal: false
      },
      gtin: '7891031410158',
      name: 'mostarda tipo dijon hemmer 300g',
      description: 'mostarda tipo dijon',
      price: 23.55,
      measurement: 'unit',
      ncm: null,
      quantity: 5,
      note: ''
    },
    {
      product: {
        _id: '5e3c94ae77fd4b00e5e6d0de',
        internal: false
      },
      gtin: '7896102503715',
      name: 'yellow mustard heinz 255g',
      description: 'mostarda amarela 255g',
      price: 9.45,
      measurement: 'unit',
      ncm: null,
      quantity: 6,
      note: ''
    }
  ],
  payments: [
    {
      method: 'cash',
      value: 100,
      createdAt: '2020-02-06T22:58:20.153Z'
    },
    {
      method: 'credit',
      value: 189.09,
      createdAt: '2020-02-06T22:59:24.268Z'
    }
  ],
  status: 'closed',
  delivery: {
    address: {
      _id: '5e3c9a3e77fd4b00e5e6d101',
      street: 'Rua Benedito Caim',
      number: '92',
      complement: 'apto 01',
      district: 'Vila Mariana',
      city: 'São Paulo',
      state: 'SP',
      country: null,
      postalCode: '04121-070'
    },
    paymentType: 'credit'
  },
  total: 289.09000000000003,
  totalPaid: 289.09000000000003,
  createdAt: '2020-02-06T22:58:05.566Z',
  updatedAt: '2020 - 02 - 06 T22: 59: 24.284 Z '
}

export const orderCompany = {
  _id: '5e3c944e77fd4b00e5e6d0dd',
  employer: null,
  phone: {
    areaCode: null,
    number: null
  },
  tax: {
    regime: '3',
    icmsTaxGroup: '00',
    incidenceRegime: IncidenceRegimes.CUMULATIVE
  },
  email: 'guilherme.kodama@somosmee.com',
  name: 'Guilherme Kodama',
  nationalId: '27412532000192',
  stateId: '1111111111111',
  role: 'employer',
  picture:
    'https://lh3.googleusercontent.com/-WEYcUSGK0no/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rc_yl44KduffbjGFIW05GDDgyLwLw/s96-c/photo.jpg',
  address: null,
  description: null,
  createdAt: '2020-02-06T22:33:50.717Z',
  updatedAt: '2020-02-06T22:42:17.152Z',
  permissions: {
    myStore: true,
    reports: true,
    billing: true,
    sales: true,
    products: true,
    customers: true,
    orders: {
      create: true,
      edit: true,
      list: true,
      closeOrder: true,
      addPayment: true,
      addItem: true
    },
    tags: false,
    purchases: false,
    suppliers: false
  },
  subscription: null
}

export const orderCustomer = {
  _id: '5e3c9a3077fd4b00e5e6d0ff',
  firstName: 'Guilherme',
  lastName: 'Kodama',
  nationalId: '01719550212',
  birthday: '1992-11-03',
  email: 'guilherme.kodama@somosmee.com',
  mobile: '92981233668',
  receiveOffers: false,
  addresses: [
    {
      _id: '5e3c9a3e77fd4b00e5e6d101',
      street: 'Rua Benedito Caim',
      number: '92',
      complement: 'apto 01',
      district: 'Vila Mariana',
      city: 'São Paulo',
      state: 'SP',
      country: null,
      postalCode: '04121-070'
    }
  ],
  deletedAt: null,
  createdAt: '2020-02-06T22:58:56.942Z',
  updatedAt: '2020-02-06T22:59:10.277Z'
}

export const orderNonCumulative = {
  _id: '5e3c99fd77fd4b00e5e6d0f8',
  title: null,
  items: [
    {
      product: {
        _id: '5e3c957777fd4b00e5e6d0ed',
        internal: true
      },
      gtin: '2000001000021',
      name: 'produto interno 2',
      description: 'descrição produto interno 2',
      price: 55.65,
      measurement: 'unit',
      ncm: null,
      quantity: 1,
      note: ''
    },
    {
      product: {
        _id: '5e3c956677fd4b00e5e6d0ea',
        internal: true
      },
      gtin: '2000001000014',
      name: 'produto interno 1',
      description: 'descrição produto interno 1',
      price: 14.34,
      measurement: 'unit',
      ncm: null,
      quantity: 2,
      note: ''
    },
    {
      product: {
        _id: '5e3c955477fd4b00e5e6d0e7',
        internal: false
      },
      gtin: '7896006762003',
      name: 'arroz  camil premium branco 1kg',
      description: 'reserva especial',
      price: 3.45,
      measurement: 'kilogram',
      ncm: null,
      quantity: 3,
      note: ''
    },
    {
      product: {
        _id: '5e3c950f77fd4b00e5e6d0e4',
        internal: false
      },
      gtin: '7891031409404',
      name: 'ketchup tradicional hemmer',
      description: null,
      price: 4.99,
      measurement: 'unit',
      ncm: null,
      quantity: 4,
      note: ''
    },
    {
      product: {
        _id: '5e3c94e077fd4b00e5e6d0e1',
        internal: false
      },
      gtin: '7891031410158',
      name: 'mostarda tipo dijon hemmer 300g',
      description: 'mostarda tipo dijon',
      price: 23.55,
      measurement: 'unit',
      ncm: null,
      quantity: 5,
      note: ''
    },
    {
      product: {
        _id: '5e3c94ae77fd4b00e5e6d0de',
        internal: false
      },
      gtin: '7896102503715',
      name: 'yellow mustard heinz 255g',
      description: 'mostarda amarela 255g',
      price: 9.45,
      measurement: 'unit',
      ncm: null,
      quantity: 6,
      note: ''
    }
  ],
  payments: [
    {
      method: 'cash',
      value: 100,
      createdAt: '2020-02-06T22:58:20.153Z'
    },
    {
      method: 'credit',
      value: 189.09,
      createdAt: '2020-02-06T22:59:24.268Z'
    }
  ],
  status: 'closed',
  delivery: {
    address: {
      _id: '5e3c9a3e77fd4b00e5e6d101',
      street: 'Rua Benedito Caim',
      number: '92',
      complement: 'apto 01',
      district: 'Vila Mariana',
      city: 'São Paulo',
      state: 'SP',
      country: null,
      postalCode: '04121-070'
    },
    paymentType: 'credit'
  },
  total: 289.09000000000003,
  totalPaid: 289.09000000000003,
  createdAt: '2020-02-06T22:58:05.566Z',
  updatedAt: '2020 - 02 - 06 T22: 59: 24.284 Z '
}

export const orderNonCumulativeCompany = {
  _id: '5e3c944e77fd4b00e5e6d0dd',
  employer: null,
  phone: {
    areaCode: null,
    number: null
  },
  tax: {
    regime: '3',
    icmsTaxGroup: '00',
    incidenceRegime: IncidenceRegimes.NON_CUMULATIVE
  },
  email: 'guilherme.kodama@somosmee.com',
  name: 'Guilherme Kodama',
  nationalId: '27412532000192',
  stateId: '1111111111111',
  role: 'employer',
  picture:
    'https://lh3.googleusercontent.com/-WEYcUSGK0no/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rc_yl44KduffbjGFIW05GDDgyLwLw/s96-c/photo.jpg',
  address: null,
  description: null,
  createdAt: '2020-02-06T22:33:50.717Z',
  updatedAt: '2020-02-06T22:42:17.152Z',
  permissions: {
    myStore: true,
    reports: true,
    billing: true,
    sales: true,
    products: true,
    customers: true,
    orders: {
      create: true,
      edit: true,
      list: true,
      closeOrder: true,
      addPayment: true,
      addItem: true
    },
    tags: false,
    purchases: false,
    suppliers: false
  },
  subscription: null
}

export const orderNonCumulativeCustomer = {
  _id: '5e3c9a3077fd4b00e5e6d0ff',
  firstName: 'Guilherme',
  lastName: 'Kodama',
  nationalId: '01719550212',
  birthday: '1992-11-03',
  email: 'guilherme.kodama@somosmee.com',
  mobile: '92981233668',
  receiveOffers: false,
  addresses: [
    {
      _id: '5e3c9a3e77fd4b00e5e6d101',
      street: 'Rua Benedito Caim',
      number: '92',
      complement: 'apto 01',
      district: 'Vila Mariana',
      city: 'São Paulo',
      state: 'SP',
      country: null,
      postalCode: '04121-070'
    }
  ],
  deletedAt: null,
  createdAt: '2020-02-06T22:58:56.942Z',
  updatedAt: '2020-02-06T22:59:10.277Z'
}

/* COLCHETES */

export const orderColchetesCompany = {
  nationalId: '36277730000181',
  stateId: '128509549110',
  tax: {
    ibgeCityCode: '3550308',
    regime: '1',
    icmsCSOSN: '102',
    icmsOrigin: 'icmsOrigin',
    icmsTaxGroup: '102',
    incidenceRegime: 'cumulative',
    pisCofinsTaxGroup: '01'
  }
}

export const orderColchetes = {
  _id: 'production',
  items: [
    {
      product: {
        _id: 'prod1',
        internal: true
      },
      gtin: '2000001000021',
      measurement: 'unit',
      name: 'Refeição',
      price: 17.9,
      quantity: 23
    }
  ],
  payments: [
    {
      method: 'cash',
      value: 411.7,
      createdAt: '2020-02-06T22:58:20.153Z'
    }
  ],
  total: 411.7
}

export const orderColchetesDiscount = {
  _id: 'production',
  items: [
    {
      product: {
        _id: 'prod1',
        internal: true
      },
      gtin: '2000001000021',
      measurement: 'unit',
      name: 'Refeição',
      price: 17.9,
      quantity: 23
    }
  ],
  payments: [
    {
      method: 'cash',
      value: 411.7,
      createdAt: '2020-02-06T22:58:20.153Z'
    }
  ],
  totalDiscount: 33.33,
  total: 411.7
}
