module.exports = {
  async up(db) {
    const orders = await db.collection('orders').find({})

    while (await orders.hasNext()) {
      const order = await orders.next()

      let modified = false
      const items = []
      for (const item of order.items) {
        if ('measurementType' in item) {
          delete item.measurementType
          modified = true
        }

        if (!item.measurement) {
          item.measurement = 'unit'
          modified = true
        }

        if (item.measurement === 'UN' || item.measurement === 'UNIT') {
          item.measurement = 'unit'
          modified = true
        }

        if (item.measurement === 'KG') {
          item.measurement = 'kilogram'
          modified = true
        }

        items.push(item)
      }

      if (modified) await db.collection('orders').findOneAndUpdate({
        _id: order._id
      }, {
        $set: {
          items
        }
      })
    }
  },

  async down(db) {}
}