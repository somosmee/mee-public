import addressUtils from 'src/utils/address'

const buildOrderInput = ({
  shop,
  geoDataPickup,
  pickupAddress,
  geoDataDelivery,
  address,
  customer,
  dimensions,
  charge,
  change,
  order
}) => {
  return {
    shopId: parseInt(shop.pk),
    pickups: [
      {
        address: {
          lat: geoDataPickup.lat,
          lng: geoDataPickup.lng,
          address: addressUtils.stringifyAddress(pickupAddress),
          complement: pickupAddress.complement || 'sem complemento'
        },
        instructions: 'Pegar pedido dentro do estabelecimento'
      }
    ],
    packages: [
      {
        pickupIndex: 0, // esse aqui
        recipient: {
          name: `${customer.firstName} ${customer.lastName}`,
          phone: customer.mobile
        },
        address: {
          lat: geoDataDelivery.lat,
          lng: geoDataDelivery.lng,
          address: addressUtils.stringifyAddress(address),
          complement: address.complement || 'sem complementoYU '
        },
        dimensions: {
          width: parseFloat(dimensions.width),
          height: parseFloat(dimensions.height),
          length: parseFloat(dimensions.length),
          weight: parseFloat(dimensions.weight)
        },
        // metodo de pagamento: https://docs.api.loggi.com/docs/criando-um-pedido-com-a-loggi#mapeamento-das-formas-de-pagamento
        charge: {
          value: charge === 64 ? '0.00' : order.total.toFixed(2),
          method: charge,
          change: change ? change.toFixed(2) : '0.00'
        },
        instructions: `Entregar pedido para ${customer.firstName} ${customer.lastName}`
      }
    ]
  }
}

export default {
  buildOrderInput
}
