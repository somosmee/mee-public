module.exports = {
  async up(db) {
    const orders = await db.collection('orders').find({})

    while (await orders.hasNext()) {
      const order = await orders.next()

      let modified = false
      const items = []
      for(const item of order.items) {
        let aux = item._id || item.productId
        if (aux) {
          delete item._id
          delete item.productId
          item.product = aux
          modified = true
        }

        aux = item.measurementType || null
        if (aux) {
          delete item.measurementType
          item.measurement = aux
          modified = true
        }

        aux = item.ean || null
        if (aux) {
          delete item.ean
          item.gtin = aux
          modified = true
        }

        items.push(item)
      }

      if (modified) await db.collection('orders').findOneAndUpdate({ _id: order._id }, { $set: { items } })
    }
  },

  async down(db) {
  }
}
