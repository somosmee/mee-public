// latest customer info order v3
/*
"customer": {
  "id": "114235279",
  "uuid": "6486f892-a849-4815-8de3-bc56e9fc236c",
  "name": "PEDIDO DE TESTE",
  "phone": "0800 + ID",
  "ordersCountOnRestaurant":1,
  "taxPayerIdentificationNumber": "77788866655"
}
 */

export const ifoodAuthResponse = {
  statusCode: 200,
  data: {
    access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJzdWIiOiI5ZjlmY2U2MC0zMmVhLTRjYzgtOWE4Yy05ZmZlNWM3Mzc4ZDgiLCJ1c2VyX25hbWUiOiJQT1MtNjU0MTU2NDUiLCJwcm9maWxlcyI6Ilt7XCJpZFwiOlwiMjFcIixcIm5hbWVcIjpcIlBPU1wifV0iLCJpc3MiOiJpRm9vZCIsImNsaWVudF9pZCI6Im1lZSIsImF1dGhvcml0aWVzIjpbIlJPTEVfQ0xJRU5UIiwiUk9MRV9UUlVTVEVEX0NMSUVOVCJdLCJtdXN0X2NoYW5nZV9wYXNzd29yZCI6ZmFsc2UsImF1ZCI6WyJraXRjaGVuIiwib2F1dGgtc2VydmVyIl0sInVzZXJfbWV0YWRhdGEiOjEyMTQxNTQsImJhY2tvZmZpY2VzIjoiW3tcImlkXCI6XCIxXCIsXCJuYW1lXCI6XCJPUEJSXCIsXCJkb21haW5cIjpcImlmb29kLmNvbS5iclwiLFwiY29tcGFueUNvZGVzXCI6W1wiQUxLXCIsXCJEVlJcIixcIkZJRlwiLFwiSExGXCIsXCJBUFRcIixcIkhVVFwiLFwiTEVBXCIsXCJMQ0JcIixcIklMUFwiLFwiTUNEXCIsXCJFU0FcIixcIkFEVlwiLFwiSUZPXCIsXCJQUFJcIixcIkJPQlwiLFwiTkNLXCIsXCJIQlJcIixcIlNIUFwiLFwiSVBCXCIsXCJSV0JcIl19XSIsInBlcm1pc3Npb25zIjpbXSwic2NvcGUiOlsidHJ1c3QiLCJyZWFkIiwid3JpdGUiXSwidGVuYW50SWQiOiI1OGQ5MjIxMC00NzYyLTExZTYtYmViOC05ZTcxMTI4Y2FlNzciLCJtZXJjaGFudHMiOiJbe1wibWVyY2hhbnRVdWlkXCI6XCJiMmYyNGRmZC1kZDRkLTRjYzItOTgyMy01ZjFjNzJmYmJmYTRcIixcIm1lcmNoYW50SWRcIjo2MzA2MTB9XSIsImV4cCI6MTU4MjMxNzI5NSwiaWF0IjoxNTgyMzEzNjk1fQ.gVRw-lL7LuFPGL9OgZJLbtnCe7XHejslqE9w8JASOKVfeKT2MbZWNGRxJgvzxIhhY2XfF9ahoeZ8N5vPIQhpTJB348U5uERYRddNtfhTt8rifbEwiVF83mP9IGFIAmaQBiiNgeOiphV4znW6hd9KW647hiZdFD0jHHNJvUJCSGk',
    token_type: 'bearer',
    expires_in: 3599,
    scope: 'trust read write'
  }
}

export const ifoodEventPlaced = {
  statusCode: 200,
  data: [{
    id: 'b645b281-2b06-46ac-a411-aea2eff77f7a',
    code: 'PLACED',
    correlationId: '8028267402793088',
    createdAt: '2020-02-21T20:49:21.518Z'
  }]
}

export const ifoodEventConcluded = {
  statusCode: 200,
  data: [{
    id: 'b645b281-2b06-46ac-a411-aea2eff77f7b',
    code: 'CONCLUDED',
    correlationId: '8028267402793088',
    createdAt: '2020-02-21T20:49:21.518Z'
  }]
}

export const ifoodOrderTest = {
  statusCode: 200,
  data: {
    id: '48a39157-50bf-4495-b0c3-91fc68d9c279',
    reference: '8028267402793088',
    shortReference: '4061',
    createdAt: '2020-02-21T20:49:21.389Z',
    scheduled: false,
    merchant: {
      id: 'b2f24dfd-dd4d-4cc2-9823-5f1c72fbbfa4',
      shortId: '630610',
      name: 'Teste Mee',
      address: {
        formattedAddress: 'RAMAL BUJARI',
        country: 'BR',
        state: 'AC',
        city: 'BUJARI',
        neighborhood: 'Bujari',
        streetName: 'RAMAL BUJARI',
        streetNumber: '100',
        postalCode: '69923000'
      }
    },
    payments: [{
      name: 'DÉBITO - MASTERCARD (MÁQUINA)',
      code: 'MEREST',
      value: 15.0,
      prepaid: false
    }],
    customer: {
      id: '205558188',
      uuid: 'df1cd9d1-c7e0-4cd9-9b32-2f5dfb42cc4c',
      name: 'PEDIDO DE TESTE - Guilherme Kodama',
      taxPayerIdentificationNumber: '01719550212',
      phone: '0800 007 0110 ID: 77621538',
      ordersCountOnRestaurant: 7
    },
    items: [{
      id: '3d1f8c4d-346f-4d9a-8a64-580f836a0ec0',
      name: 'PEDIDO DE TESTE - Pastel de queijo',
      quantity: 1,
      price: 5.0,
      subItemsPrice: 0,
      totalPrice: 5.0,
      discount: 0.0,
      addition: 0.0,
      externalId: '114026040',
      externalCode: '2222',
      index: 1
    }],
    subTotal: 5.0,
    totalPrice: 15.0,
    deliveryFee: 10.0,
    deliveryAddress: {
      formattedAddress: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari, 100',
      country: 'BR',
      state: 'AC',
      city: 'Bujari',
      coordinates: {
        latitude: -9.822159,
        longitude: -67.948475
      },
      neighborhood: 'Bujari',
      streetName: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari',
      streetNumber: '100',
      postalCode: '00000000'
    },
    deliveryDateTime: '2020-02-21T21:39:21.389Z',
    preparationStartDateTime: '2020-02-21T20:49:21.389Z',
    localizer: {
      id: '99496846'
    },
    preparationTimeInSeconds: 0,
    isTest: true,
    deliveryMethod: {
      id: 'DEFAULT',
      value: 10,
      minTime: 50,
      maxTime: 60,
      mode: 'DELIVERY',
      deliveredBy: 'MERCHANT'
    }
  }
}

export const ifoodOrderWithSubitems = {
  statusCode: 200,
  data: {
    payments: [{
      name: 'DÉBITO - VISA (MÁQUINA)',
      code: 'VIREST',
      value: 41,
      prepaid: false
    }],
    items: [{
        id: 'a383c289-7192-424c-ad5e-45251fcfddd6',
        name: 'PEDIDO DE TESTE - X-salada',
        quantity: 1,
        price: 8,
        subItemsPrice: '7.5',
        totalPrice: '15.5',
        discount: 0,
        addition: 0,
        externalId: '114026059',
        externalCode: '8',
        subItems: [{
            id: '57304588-4a53-4552-aaa4-75443c197c3e',
            name: 'Alface',
            quantity: 1,
            price: '1.5',
            totalPrice: '1.5',
            discount: 0,
            addition: 0,
            externalCode: '10'
          },
          {
            id: '7735c923-b36a-43fe-aaa1-c194672ebe28',
            name: 'Bacon',
            quantity: 2,
            price: 3,
            totalPrice: 3,
            discount: 0,
            addition: 0,
            externalCode: '13'
          }
        ],
        observations: 'SEM MAIONESE',
        index: 1
      },
      {
        id: '41ec1e3a-4f2a-46b2-ac44-4b833b40144a',
        name: 'PEDIDO DE TESTE - Refrigerante 2 litros',
        quantity: 1,
        price: 10,
        subItemsPrice: 0,
        totalPrice: 10,
        discount: 0,
        addition: 0,
        externalId: '114026118',
        externalCode: '17',
        subItems: [{
          id: '7f373da0-ad8f-4a4e-a205-47383c99d292',
          name: 'Coca cola',
          quantity: 1,
          price: 0,
          totalPrice: 0,
          discount: 0,
          addition: 0,
          externalCode: '200'
        }],
        observations: 'SEM AÇUCAR',
        index: 4
      },
      {
        id: '3d1f8c4d-346f-4d9a-8a64-580f836a0ec0',
        name: 'PEDIDO DE TESTE - Pastel de queijo',
        quantity: 1,
        price: 5,
        subItemsPrice: 0,
        totalPrice: 5,
        discount: 0,
        addition: 0,
        externalId: '114026040',
        externalCode: '2222',
        observations: 'SEM CIMENTO',
        index: 6
      }
    ],
    reference: '8189244609188088',
    customer: {
      id: '205558188',
      uuid: 'df1cd9d1-c7e0-4cd9-9b32-2f5dfb42cc4c',
      name: 'PEDIDO DE TESTE - Guilherme Kodama',
      taxPayerIdentificationNumber: '01719550212',
      phone: '0800 007 0110 ID: 77621538',
      ordersCountOnRestaurant: 7
    },
    deliveryAddress: {
      formattedAddress: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari, 100',
      country: 'BR',
      state: 'AC',
      city: 'Bujari',
      coordinates: {
        latitude: '-9.822159',
        longitude: '-67.948475'
      },
      neighborhood: 'Bujari',
      streetName: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari',
      streetNumber: '100',
      postalCode: '00000000'
    },
    deliveryDateTime: '2020-03-03T12:32:30.026Z',
    deliveryFee: 10,
    deliveryMethod: {
      id: 'DEFAULT',
      value: 10,
      minTime: 50,
      maxTime: 60,
      mode: 'DELIVERY',
      deliveredBy: 'MERCHANT'
    },
    id: '90c14280-19d3-40b4-91cc-90ac16b53612',
    isTest: true,
    localizer: {
      id: '16673028'
    },
    merchant: {
      id: 'b2f24dfd-dd4d-4cc2-9823-5f1c72fbbfa4',
      shortId: '630610',
      name: 'Teste Mee',
      address: {
        formattedAddress: 'RAMAL BUJARI',
        country: 'BR',
        state: 'AC',
        city: 'BUJARI',
        neighborhood: 'Bujari',
        streetName: 'RAMAL BUJARI',
        streetNumber: '100',
        postalCode: '69923000'
      }
    },
    preparationStartDateTime: '2020-03-03T11:42:30.026Z',
    preparationTimeInSeconds: 0,
    scheduled: false,
    shortReference: '1429',
    subTotal: 31,
    totalPrice: 41
  }
}

/* IFOOD VALIDATION */

export const eventsSimpleOrder = {
  statusCode: 200,
  data: [{
    id: '63ec653e-de16-4612-a017-b815245199ae',
    code: 'PLACED',
    correlationId: '7041299202854077',
    createdAt: '2020-02-25T21:31:15.938Z'
  }]
}

export const simpleCashOrder = {
  statusCode: 200,
  data: {
    id: '4d071805-faa6-4ded-8111-cffdebac1cbe',
    reference: '7041299202854077',
    shortReference: '1758',
    createdAt: '2020-02-25T21:31:15.811Z',
    scheduled: false,
    merchant: {
      id: 'b2f24dfd-dd4d-4cc2-9823-5f1c72fbbfa4',
      shortId: '630610',
      name: 'Teste Mee',
      address: {
        formattedAddress: 'RAMAL BUJARI',
        country: 'BR',
        state: 'AC',
        city: 'BUJARI',
        neighborhood: 'Bujari',
        streetName: 'RAMAL BUJARI',
        streetNumber: '100',
        postalCode: '69923000'
      }
    },
    payments: [{
      name: 'DINHEIRO',
      code: 'DIN',
      value: 15.0,
      prepaid: false,
      changeFor: 100.0
    }],
    customer: {
      id: '205558188',
      uuid: 'df1cd9d1-c7e0-4cd9-9b32-2f5dfb42cc4c',
      name: 'PEDIDO DE TESTE - Guilherme Kodama',
      taxPayerIdentificationNumber: '01719550212',
      phone: '0800 007 0110 ID: 77621538',
      ordersCountOnRestaurant: 7
    },
    items: [{
      id: '3d1f8c4d-346f-4d9a-8a64-580f836a0ec0',
      name: 'PEDIDO DE TESTE - Pastel de queijo',
      quantity: 1,
      price: 5.0,
      subItemsPrice: 0,
      totalPrice: 5.0,
      discount: 0.0,
      addition: 0.0,
      externalId: '114026040',
      externalCode: '2222',
      index: 1
    }],
    subTotal: 5.0,
    totalPrice: 15.0,
    deliveryFee: 10.0,
    deliveryAddress: {
      formattedAddress: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari, 100',
      country: 'BR',
      state: 'AC',
      city: 'Bujari',
      coordinates: {
        latitude: -9.822159,
        longitude: -67.948475
      },
      neighborhood: 'Bujari',
      streetName: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari',
      streetNumber: '100',
      postalCode: '00000000'
    },
    deliveryDateTime: '2020-02-25T22:21:15.811Z',
    preparationStartDateTime: '2020-02-25T21:31:15.811Z',
    localizer: {
      id: '17562975'
    },
    preparationTimeInSeconds: 0,
    isTest: true,
    deliveryMethod: {
      id: 'DEFAULT',
      value: 10,
      minTime: 50,
      maxTime: 60,
      mode: 'DELIVERY',
      deliveredBy: 'MERCHANT'
    }
  }
}

/* ONLINE PAYMNET */

export const eventOnlinePayment = {
  statusCode: 200,
  data: [{
    id: 'e7e101b4-216b-4c44-8f7a-1e443d34568a',
    code: 'PLACED',
    correlationId: '6064253004819066',
    createdAt: '2020-02-29T01:25:21.293Z'
  }]
}

export const onlinePaymentOrder = {
  statusCode: 200,
  data: {
    id: '9c41bf9d-dafb-436b-8728-433a0a13a2e3',
    reference: '6064253004819066',
    shortReference: '8063',
    createdAt: '2020-02-29T01:25:20.983Z',
    scheduled: false,
    merchant: {
      id: 'b2f24dfd-dd4d-4cc2-9823-5f1c72fbbfa4',
      shortId: '630610',
      name: 'Teste Mee',
      address: {
        formattedAddress: 'RAMAL BUJARI',
        country: 'BR',
        state: 'AC',
        city: 'BUJARI',
        neighborhood: 'Bujari',
        streetName: 'RAMAL BUJARI',
        streetNumber: '100',
        postalCode: '69923000'
      }
    },
    payments: [{
      name: 'VISA',
      code: 'VIS',
      value: 15.0,
      prepaid: true,
      transaction: 'LTf7441091-d783-4632-aba4-db77ca810823',
      issuer: 'VISA',
      authorizationCode: 'LT'
    }],
    customer: {
      id: '205558188',
      uuid: 'df1cd9d1-c7e0-4cd9-9b32-2f5dfb42cc4c',
      name: 'PEDIDO DE TESTE - Guilherme Kodama',
      taxPayerIdentificationNumber: '01719550212',
      phone: '0800 007 0110 ID: 77621538',
      ordersCountOnRestaurant: 7
    },
    items: [{
      id: '3d1f8c4d-346f-4d9a-8a64-580f836a0ec0',
      name: 'PEDIDO DE TESTE - Pastel de queijo',
      quantity: 1,
      price: 5.0,
      subItemsPrice: 0,
      totalPrice: 5.0,
      discount: 0.0,
      addition: 0.0,
      externalId: '114026040',
      externalCode: '2222',
      index: 1
    }],
    subTotal: 5.0,
    totalPrice: 15.0,
    deliveryFee: 10.0,
    deliveryAddress: {
      formattedAddress: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari, 100',
      country: 'BR',
      state: 'AC',
      city: 'Bujari',
      coordinates: {
        latitude: -9.822159,
        longitude: -67.948475
      },
      neighborhood: 'Bujari',
      streetName: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari',
      streetNumber: '100',
      postalCode: '00000000'
    },
    deliveryDateTime: '2020-02-29T02:15:20.983Z',
    preparationStartDateTime: '2020-02-29T01:25:20.983Z',
    localizer: {
      id: '53937440'
    },
    preparationTimeInSeconds: 0,
    isTest: true,
    deliveryMethod: {
      id: 'DEFAULT',
      value: 10,
      minTime: 50,
      maxTime: 60,
      mode: 'DELIVERY',
      deliveredBy: 'MERCHANT'
    }
  }
}

export const eventMaskedContactPhone = {
  statusCode: 200,
  data: [{
    id: 'e7e101b4-216b-4c44-8f7a-1e443d34568a',
    code: 'PLACED',
    correlationId: '4910000000000000',
    createdAt: '2020-02-29T01:25:21.293Z'
  }]
}

export const maskedContactPhoneOrder = {
  statusCode: 200,
  data: {
    id: 'ff000000000000000000000000000000',
    reference: '4910000000000000',
    shortReference: '1591',
    createdAt: '2018-12-27T12:04:53.126Z',
    type: 'DELIVERY',
    merchant: {
      id: '10000',
      name: 'Modelo Area',
      address: {
        formattedAddress: 'R Teste',
        country: 'BR',
        state: 'AC',
        city: 'BUJARI',
        neighborhood: 'OUTROS',
        streetName: 'R Teste',
        streetNumber: '100',
        postalCode: '12345678'
      }
    },
    payments: [{
      name: 'VALE - VR SMART (CARTÃO)',
      code: 'VR_SMA',
      value: 26.99,
      prepaid: false
    }],
    customer: {
      id: '99999999',
      name: 'Leandro Gomes',
      phone: '0800 608 1015 ID: 99999999',
      ordersCountOnRestaurant: 0
    },
    items: [{
        name: 'Pastel de queijo',
        quantity: 2,
        price: 6,
        subItemsPrice: 0,
        totalPrice: 6,
        discount: 0,
        addition: 0,
        externalCode: '1'
      },
      {
        name: 'Pastel de palmito',
        quantity: 1,
        price: 5.99,
        subItemsPrice: 0,
        totalPrice: 5.99,
        discount: 0,
        addition: 0,
        externalCode: '2'
      }
    ],
    subTotal: 17.99,
    totalPrice: 26.99,
    deliveryFee: 9,
    deliveryAddress: {
      formattedAddress: 'R TESTE, 100',
      country: 'BR',
      state: 'AC',
      city: 'BUJARI',
      coordinates: {
        latitude: -9.824359,
        longitude: -67.950572
      },
      neighborhood: 'OUTROS',
      streetName: 'R TESTE',
      streetNumber: '100',
      postalCode: '12345678',
      reference: 'teste'
    },
    deliveryDateTime: '2018-12-27T12:04:53.126Z',
    localizer: {
      id: '99999999'
    },
    preparationTimeInSeconds: 2099
  }
}

export const eventObservation = {
  statusCode: 200,
  data: [{
    id: '136946a2-9b9d-45fa-ba6e-1afbd6cfeed9',
    code: 'PLACED',
    correlationId: '2065238402257022',
    createdAt: '2020-03-01T21:43:13.306Z'
  }]
}

export const observationOrder = {
  statusCode: 200,
  data: {
    id: '83bf157d-0e8e-4533-a3d8-bc82d3313d74',
    reference: '2065238402257022',
    shortReference: '4789',
    createdAt: '2020-03-01T21:43:13.079Z',
    scheduled: false,
    merchant: {
      id: 'b2f24dfd-dd4d-4cc2-9823-5f1c72fbbfa4',
      shortId: '630610',
      name: 'Teste Mee',
      address: {
        formattedAddress: 'RAMAL BUJARI',
        country: 'BR',
        state: 'AC',
        city: 'BUJARI',
        neighborhood: 'Bujari',
        streetName: 'RAMAL BUJARI',
        streetNumber: '100',
        postalCode: '69923000'
      }
    },
    payments: [{
      name: 'CRÉDITO - MASTERCARD (MÁQUINA)',
      code: 'RDREST',
      value: 15.0,
      prepaid: false
    }],
    customer: {
      id: '205558188',
      uuid: 'df1cd9d1-c7e0-4cd9-9b32-2f5dfb42cc4c',
      name: 'PEDIDO DE TESTE - Guilherme Kodama',
      taxPayerIdentificationNumber: '01719550212',
      phone: '0800 007 0110 ID: 77621538',
      ordersCountOnRestaurant: 7
    },
    items: [{
      id: '3d1f8c4d-346f-4d9a-8a64-580f836a0ec0',
      name: 'PEDIDO DE TESTE - Pastel de queijo',
      quantity: 1,
      price: 5.0,
      subItemsPrice: 0,
      totalPrice: 5.0,
      discount: 0.0,
      addition: 0.0,
      externalId: '114026040',
      externalCode: '2222',
      observations: 'OBSERVAÇÃO DE TESTE',
      index: 1
    }],
    subTotal: 5.0,
    totalPrice: 15.0,
    deliveryFee: 10.0,
    deliveryAddress: {
      formattedAddress: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari, 100',
      country: 'BR',
      state: 'AC',
      city: 'Bujari',
      coordinates: {
        latitude: -9.822159,
        longitude: -67.948475
      },
      neighborhood: 'Bujari',
      streetName: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari',
      streetNumber: '100',
      postalCode: '00000000'
    },
    deliveryDateTime: '2020-03-01T22:33:13.079Z',
    preparationStartDateTime: '2020-03-01T21:43:13.079Z',
    localizer: {
      id: '12424049'
    },
    preparationTimeInSeconds: 0,
    isTest: true,
    deliveryMethod: {
      id: 'DEFAULT',
      value: 10,
      minTime: 50,
      maxTime: 60,
      mode: 'DELIVERY',
      deliveredBy: 'MERCHANT'
    }
  }
}

/* VOUCHER */

export const eventVoucher = {
  statusCode: 200,
  data: [{
    id: 'e7e101b4-216b-4c44-8f7a-1e443d34568a',
    code: 'PLACED',
    correlationId: '6064253004819066',
    createdAt: '2020-02-29T01:25:21.293Z'
  }]
}

export const onlinePaymentWithVoucherOrder = {
  statusCode: 200,
  data: {
    id: '9c41bf9d-dafb-436b-8728-433a0a13a2e3',
    reference: '6064253004819066',
    shortReference: '8063',
    createdAt: '2020-02-29T01:25:20.983Z',
    scheduled: false,
    merchant: {
      id: 'b2f24dfd-dd4d-4cc2-9823-5f1c72fbbfa4',
      shortId: '630610',
      name: 'Teste Mee',
      address: {
        formattedAddress: 'RAMAL BUJARI',
        country: 'BR',
        state: 'AC',
        city: 'BUJARI',
        neighborhood: 'Bujari',
        streetName: 'RAMAL BUJARI',
        streetNumber: '100',
        postalCode: '69923000'
      }
    },
    benefits: [{
      value: 2.0,
      sponsorshipValues: {
        // Valor do Subsídio
        IFOOD: 2.0, // Ifood Subsidiando |
        MERCHANT: 0.0
      },
      target: 'CART' // Subsídio no valor somado dos itens|
    }],
    payments: [{
        name: 'VOUCHER',
        code: 'VOUCHER',
        value: 2.0
      },
      {
        name: 'VISA',
        code: 'VIS',
        value: 13.0,
        prepaid: true,
        transaction: 'LTf7441091-d783-4632-aba4-db77ca810823',
        issuer: 'VISA',
        authorizationCode: 'LT'
      }
    ],
    customer: {
      id: '205558188',
      uuid: 'df1cd9d1-c7e0-4cd9-9b32-2f5dfb42cc4c',
      name: 'PEDIDO DE TESTE - Guilherme Kodama',
      taxPayerIdentificationNumber: '01719550212',
      phone: '0800 007 0110 ID: 77621538',
      ordersCountOnRestaurant: 7
    },
    items: [{
      id: '3d1f8c4d-346f-4d9a-8a64-580f836a0ec0',
      name: 'PEDIDO DE TESTE - Pastel de queijo',
      quantity: 1,
      price: 5.0,
      subItemsPrice: 0,
      totalPrice: 5.0,
      discount: 0.0,
      addition: 0.0,
      externalId: '114026040',
      externalCode: '2222',
      index: 1
    }],
    subTotal: 5.0,
    totalPrice: 15.0,
    deliveryFee: 10.0,
    deliveryAddress: {
      formattedAddress: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari, 100',
      country: 'BR',
      state: 'AC',
      city: 'Bujari',
      coordinates: {
        latitude: -9.822159,
        longitude: -67.948475
      },
      neighborhood: 'Bujari',
      streetName: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari',
      streetNumber: '100',
      postalCode: '00000000'
    },
    deliveryDateTime: '2020-02-29T02:15:20.983Z',
    preparationStartDateTime: '2020-02-29T01:25:20.983Z',
    localizer: {
      id: '53937440'
    },
    preparationTimeInSeconds: 0,
    isTest: true,
    deliveryMethod: {
      id: 'DEFAULT',
      value: 10,
      minTime: 50,
      maxTime: 60,
      mode: 'DELIVERY',
      deliveredBy: 'MERCHANT'
    }
  }
}

export const eventSubitems = {
  statusCode: 200,
  data: [{
    id: '136946a2-9b9d-45fa-ba6e-1afbd6cfeed9',
    code: 'PLACED',
    correlationId: '8189244609188088',
    createdAt: '2020-03-01T21:43:13.306Z'
  }]
}

export const subitemsOrder = {
  statusCode: 200,
  data: {
    items: [{
      id: 'a383c289-7192-424c-ad5e-45251fcfddd6',
      name: 'PEDIDO DE TESTE - X-salada',
      quantity: 2,
      price: 8,
      subItemsPrice: 7.5,
      totalPrice: 15.5,
      discount: 0,
      addition: 0,
      externalId: '114026059',
      externalCode: '8',
      subItems: [{
          id: '57304588-4a53-4552-aaa4-75443c197c3e',
          name: 'Alface',
          quantity: 1,
          price: 1.5,
          totalPrice: 1.5,
          discount: 0,
          addition: 0,
          externalCode: '10'
        },
        {
          id: '7735c923-b36a-43fe-aaa1-c194672ebe28',
          name: 'Bacon',
          quantity: 1,
          price: 3,
          totalPrice: 3,
          discount: 0,
          addition: 0,
          externalCode: '13'
        },
        {
          id: '8b8cb00f-272a-4e25-ab56-31b826e0c44f',
          name: 'Hamburguer',
          quantity: 1,
          price: 3,
          totalPrice: 3,
          discount: 0,
          addition: 0,
          externalCode: '12'
        }
      ],
      index: 1
    }],
    customer: {
      id: '205558188',
      uuid: 'df1cd9d1-c7e0-4cd9-9b32-2f5dfb42cc4c',
      name: 'PEDIDO DE TESTE - Guilherme Kodama',
      taxPayerIdentificationNumber: '01719550212',
      phone: '0800 007 0110 ID: 77621538',
      ordersCountOnRestaurant: 7
    },
    deliveryAddress: {
      formattedAddress: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari, 100',
      country: 'BR',
      state: 'AC',
      city: 'Bujari',
      coordinates: {
        latitude: '-9.822159',
        longitude: '-67.948475'
      },
      neighborhood: 'Bujari',
      streetName: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari',
      streetNumber: '100',
      postalCode: '00000000'
    },
    deliveryDateTime: '2020-03-07T17:56:17.507Z',
    deliveryFee: 10,
    deliveryMethod: {
      id: 'DEFAULT',
      value: 10,
      minTime: 50,
      maxTime: 60,
      mode: 'DELIVERY',
      deliveredBy: 'MERCHANT'
    },
    id: '1c19e0e9-4618-43c2-b4a6-dfbee27958cd',
    isTest: true,
    localizer: {
      id: '15445368'
    },
    merchant: {
      id: 'b2f24dfd-dd4d-4cc2-9823-5f1c72fbbfa4',
      shortId: '630610',
      name: 'Teste Mee',
      address: {
        formattedAddress: 'RAMAL BUJARI',
        country: 'BR',
        state: 'AC',
        city: 'BUJARI',
        neighborhood: 'Bujari',
        streetName: 'RAMAL BUJARI',
        streetNumber: '100',
        postalCode: '69923000'
      }
    },
    payments: [{
      name: 'DÉBITO - VISA (MÁQUINA)',
      code: 'VIREST',
      value: 41,
      prepaid: false
    }],
    preparationStartDateTime: '2020-03-07T17:06:17.507Z',
    preparationTimeInSeconds: 0,
    scheduled: false,
    shortReference: '1476',
    subTotal: 31,
    totalPrice: 41,
    reference: '8189244609188088'
  }
}

export const eventIfoodVoucher = {
  status: 200,
  data: [{
    id: 'e1fcbd02-7aa8-4003-a0b9-5510a8f712f5',
    code: 'PLACED',
    correlationId: '8080246610725088',
    createdAt: '2020-03-26T20:58:13.546Z'
  }]
}

export const ifoodVoucherOrder = {
  statusCode: 200,
  data: {
    id: '89cf0268-0265-42d6-acb5-523ffde8abd2',
    reference: '8080246610725088',
    shortReference: '0825',
    scheduled: false,
    isTest: true,
    preparationTimeInSeconds: 0,
    createdAt: '2020-03-26T20:58:13.409Z',
    preparationStartDateTime: '2020-03-26T20:58:13.409Z',
    deliveryDateTime: '2020-03-26T21:48:13.409Z',
    customer: {
      id: '205558188',
      uuid: 'df1cd9d1-c7e0-4cd9-9b32-2f5dfb42cc4c',
      name: 'PEDIDO DE TESTE - Guilherme Kodama',
      taxPayerIdentificationNumber: '01719550212',
      phone: '0800 007 0110 ID: 71828264',
      ordersCountOnRestaurant: 7
    },
    deliveryAddress: {
      formattedAddress: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari, 100',
      country: 'BR',
      state: 'AC',
      city: 'Bujari',
      coordinates: {
        latitude: -9.822159,
        longitude: -67.948475
      },
      neighborhood: 'Bujari',
      streetName: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari',
      streetNumber: '100',
      postalCode: '00000000',
      complement: 'Entrega sem contato físico - '
    },
    payments: [{
      name: 'VISA',
      code: 'VIS',
      value: 66,
      prepaid: true,
      transaction: '00000000-0000-0000-0000-000000000000',
      issuer: 'VISA',
      authorizationCode: '00'
    }],
    deliveryMethod: {
      id: 'DEFAULT',
      value: 10,
      minTime: 50,
      maxTime: 60,
      mode: 'DELIVERY',
      deliveredBy: 'MERCHANT'
    },
    merchant: {
      id: 'b2f24dfd-dd4d-4cc2-9823-5f1c72fbbfa4',
      shortId: '630610',
      name: 'Teste Mee',
      address: {
        formattedAddress: 'RAMAL BUJARI',
        country: 'BR',
        state: 'AC',
        city: 'BUJARI',
        neighborhood: 'Bujari',
        streetName: 'RAMAL BUJARI',
        streetNumber: '100',
        postalCode: '69923000'
      }
    },
    localizer: {
      id: '71828264'
    },
    items: [{
      id: 'f43d0637-9057-49f0-92e3-fcb766b0b8fd',
      name: 'PEDIDO DE TESTE - X-burguer bacon (cópia 1)',
      quantity: 2,
      price: 8,
      subItemsPrice: 20.5,
      totalPrice: 28.5,
      discount: 0,
      addition: 0,
      externalId: '114026104',
      externalCode: '7',
      subItems: [Array],
      observations: 'SEM CEBOLA',
      index: 1
    }],
    subTotal: 57,
    totalPrice: 67,
    deliveryFee: 10,
    benefits: [{
      value: 1,
      sponsorshipValues: {
        IFOOD: 1,
        MERCHANT: 0
      },
      target: 'CART'
    }]
  }
}

export const eventRestVoucher = {
  status: 200,
  data: [{
    id: '87a6f692-fe86-4918-baa6-ba41a1db31be',
    code: 'PLACED',
    correlationId: '6087266618691066',
    createdAt: '2020-03-26T21:06:58.945Z'
  }]
}

export const restVoucherOrder = {
  statusCode: 200,
  data: {
    id: '31ed6f48-51c3-4741-9e7f-a0c92d8eb1f1',
    reference: '6087266618691066',
    shortReference: '2207',
    scheduled: false,
    isTest: true,
    preparationTimeInSeconds: 0,
    createdAt: '2020-03-26T21:06:58.784Z',
    preparationStartDateTime: '2020-03-26T21:06:58.784Z',
    deliveryDateTime: '2020-03-26T21:56:58.784Z',
    customer: {
      id: '205558188',
      uuid: 'df1cd9d1-c7e0-4cd9-9b32-2f5dfb42cc4c',
      name: 'PEDIDO DE TESTE - Guilherme Kodama',
      phone: '0800 007 0110 ID: 21180573',
      ordersCountOnRestaurant: 7
    },
    deliveryAddress: {
      formattedAddress: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari, 100',
      country: 'BR',
      state: 'AC',
      city: 'Bujari',
      coordinates: {
        latitude: -9.822159,
        longitude: -67.948475
      },
      neighborhood: 'Bujari',
      streetName: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari',
      streetNumber: '100',
      postalCode: '00000000'
    },
    payments: [{
      name: 'VALE - VR SMART (CARTÃO)',
      code: 'VR_SMA',
      value: 144,
      prepaid: false
    }],
    deliveryMethod: {
      id: 'DEFAULT',
      value: 10,
      minTime: 50,
      maxTime: 60,
      mode: 'DELIVERY',
      deliveredBy: 'MERCHANT'
    },
    merchant: {
      id: 'b2f24dfd-dd4d-4cc2-9823-5f1c72fbbfa4',
      shortId: '630610',
      name: 'Teste Mee',
      address: {
        formattedAddress: 'RAMAL BUJARI',
        country: 'BR',
        state: 'AC',
        city: 'BUJARI',
        neighborhood: 'Bujari',
        streetName: 'RAMAL BUJARI',
        streetNumber: '100',
        postalCode: '69923000'
      }
    },
    localizer: {
      id: '21180573'
    },
    items: [{
      id: '79e34c7f-6f7c-3d77-820c-fd1e53d31d1e',
      name: 'PEDIDO DE TESTE - GRANDE 2 SABORES',
      quantity: 3,
      price: 0,
      subItemsPrice: 45,
      totalPrice: 45,
      discount: 0,
      addition: 0,
      externalId: '79e34c7f6f7c3d77820cfd1e53d31d1e',
      externalCode: '35',
      subItems: [Array],
      observations: 'TIRA CEBOLA E BOTA KETCHUP',
      index: 1
    }],
    subTotal: 135,
    totalPrice: 145,
    deliveryFee: 10,
    benefits: [{
      value: 1,
      sponsorshipValues: {
        IFOOD: 0,
        MERCHANT: 1
      },
      target: 'CART'
    }]
  }
}

export const eventEntregaVoucher = {
  status: 200,
  data: [{
    id: 'e3da84ec-ea9d-416b-8e64-4a54761789ac',
    code: 'PLACED',
    correlationId: '3086286614799033',
    createdAt: '2020-03-26T21:12:12.888Z'
  }]
}

export const entregaVoucherOrder = {
  statusCode: 200,
  data: {
    id: '4dfd57c0-1249-4257-9f9f-0b957b6cd19e',
    reference: '3086286614799033',
    shortReference: '6523',
    scheduled: false,
    isTest: true,
    preparationTimeInSeconds: 0,
    createdAt: '2020-03-26T21:12:12.745Z',
    preparationStartDateTime: '2020-03-26T21:12:12.745Z',
    deliveryDateTime: '2020-03-26T22:02:12.745Z',
    customer: {
      id: '205558188',
      uuid: 'df1cd9d1-c7e0-4cd9-9b32-2f5dfb42cc4c',
      name: 'PEDIDO DE TESTE - Guilherme Kodama',
      taxPayerIdentificationNumber: '01719550212',
      phone: '0800 007 0110 ID: 77621538',
      ordersCountOnRestaurant: 7
    },
    deliveryAddress: {
      formattedAddress: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari, 100',
      country: 'BR',
      state: 'AC',
      city: 'Bujari',
      coordinates: {
        latitude: -9.822159,
        longitude: -67.948475
      },
      neighborhood: 'Bujari',
      streetName: 'PEDIDO DE TESTE - NÃO ENTREGAR - Ramal Bujari',
      streetNumber: '100',
      postalCode: '00000000'
    },
    payments: [{
      name: 'VISA',
      code: 'VIS',
      value: 158,
      prepaid: true,
      transaction: '00000000-0000-0000-0000-000000000000',
      issuer: 'VISA',
      authorizationCode: '00'
    }],
    deliveryMethod: {
      id: 'DEFAULT',
      value: 0,
      minTime: 50,
      maxTime: 60,
      mode: 'DELIVERY',
      deliveredBy: 'MERCHANT'
    },
    merchant: {
      id: 'b2f24dfd-dd4d-4cc2-9823-5f1c72fbbfa4',
      shortId: '630610',
      name: 'Teste Mee',
      address: {
        formattedAddress: 'RAMAL BUJARI',
        country: 'BR',
        state: 'AC',
        city: 'BUJARI',
        neighborhood: 'Bujari',
        streetName: 'RAMAL BUJARI',
        streetNumber: '100',
        postalCode: '69923000'
      }
    },
    localizer: {
      id: '77621538'
    },
    items: [{
      id: '41ec1e3a-4f2a-46b2-ac44-4b833b40144a',
      name: 'PEDIDO DE TESTE - Refrigerante 2 litros',
      quantity: 3,
      price: 10,
      subItemsPrice: 0,
      totalPrice: 10,
      discount: 0,
      addition: 0,
      externalId: '114026118',
      externalCode: '17',
      subItems: [Array],
      index: 1
    },
    {
      id: '1297cb25-2921-42e6-b1e7-4e090cb49313',
      name: 'PEDIDO DE TESTE - X-tucumã',
      quantity: 4,
      price: 20,
      subItemsPrice: 12,
      totalPrice: 32,
      discount: 0,
      addition: 0,
      externalId: '173344359',
      externalCode: '207',
      subItems: [Array],
      observations: 'TIRA CEBOLA',
      index: 3
    }
    ],
    subTotal: 158,
    totalPrice: 168,
    deliveryFee: 6.90,
    benefits: [{
      value: 6.90,
      sponsorshipValues: {
        IFOOD: 6.90,
        MERCHANT: 0
      },
      target: 'DELIVERY_FEE'
    }]
  }
}
