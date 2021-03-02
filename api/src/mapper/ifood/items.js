import { Measurements } from 'src/utils/enums'

const items = (items) => {
  return items.map((item) => {
    return {
      gtin: item.externalCode,
      name: item.name,
      price: item.price,
      measurement: Measurements.UNIT,
      quantity: item.quantity,
      note: item.observations,
      modifiers:
        item.subItems &&
        item.subItems.map((subitem) => {
          return {
            name: subitem.name,
            price: subitem.price,
            quantity: subitem.quantity,
            totalPrice: subitem.totalPrice
          }
        })
    }
  })
}

export { items as default }
