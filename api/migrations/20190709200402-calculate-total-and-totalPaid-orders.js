module.exports = {
  async up(db) {
    const orders = await db.collection('orders').find({})

    while (await orders.hasNext()) {
      const order = await orders.next()

      order.total = order.items ? order.items.reduce((acc, doc) => acc + doc.price * doc.quantity, 0) : 0.0
      order.totalPaid = order.payments ? order.payments.reduce((acc, doc) => acc + doc.value, 0) : 0.0

      await db.collection('orders').findOneAndUpdate({ _id: order._id }, { $set: order })
    }
  },

  async down(db) {
    await db.collection('orders').updateMany({}, { '$unset': { total: '', totalPaid: '' } })
  }
}
