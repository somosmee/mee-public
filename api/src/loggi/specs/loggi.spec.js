import { serial as test } from 'ava'

import loggi from 'src/loggi'
import validate from 'src/loggi/validate'

const email = 'guilherme.kodama@somosmee.com'
const password = 'bcXwH3M2mJYomAMigeae'

const createOrderExampleLoggi = {
  shopId: 1,
  pickups: [
    {
      address: {
        lat: -23.5703022,
        lng: -46.6473154,
        address: 'Av. Paulista, 100 - Bela Vista, São Paulo - SP, Brasil',
        complement: '8o andar'
      },
      instructions: 'Retirar pedido com Jorge'
    }
  ],
  packages: [
    {
      pickupIndex: 0, // esse aqui
      recipient: {
        name: 'Baruch Spinoza',
        phone: '1122819603'
      },
      address: {
        lat: -23.635334,
        lng: -46.529835,
        address: 'Av. Estados Unidos, 500 - Parque das Nações, Santo André - SP, Brasil',
        complement: 'Apto 133'
      },
      dimensions: {
        width: 10,
        height: 10,
        length: 10,
        weight: 10
      },
      // metodo de pagamento: https://docs.api.loggi.com/docs/criando-um-pedido-com-a-loggi#mapeamento-das-formas-de-pagamento
      charge: {
        value: '0.00',
        method: 64,
        change: '0.00'
      },
      instructions: 'Entregar pedido para Spinoza'
    }
  ]
}

test.skip('Should get api key', async (t) => {
  const apiKey = await loggi.login(email, password)
  const allShops = await loggi.allShops(email, apiKey)

  const shop = allShops.edges[0].node
  console.log('=== SHOPS:', allShops)

  const packages = await loggi.allPackages(email, apiKey, shop.pk)
  console.log('=== PACKAGES:', packages.edges)

  const order = await loggi.createOrder(email, apiKey, shop.pk)
  console.log('ORDER:', order)

  const packages2 = await loggi.allPackages(email, apiKey, shop.pk)
  console.log('=== PACKAGES:', packages2.edges[0])

  t.is(true, true)
})

test.skip('Should create order with loggi example', async (t) => {
  const apiKey = await loggi.login(email, password)
  const allShops = await loggi.allShops(email, apiKey)

  const shop = allShops.edges[0].node

  const order = await loggi.createOrder(email, apiKey, {
    ...createOrderExampleLoggi,
    shopId: shop.pk
  })

  console.log('ORDER:', order)

  t.is(true, true)
})

test.todo('Should create order with complex example')

test('Should pass validation with Loggi create order example', async (t) => {
  t.notThrows(() =>
    validate.createOrder({
      data: createOrderExampleLoggi
    })
  )
})
