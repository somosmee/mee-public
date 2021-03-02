module.exports = {
  async up(db, client) {
    await db.collection('orders').updateMany(
      {
        $or: [{ origin: { $exists: false } }, { origin: null }]
      },
      [{ $set: { origin: 'mee' } }]
    )

    const orders = await db
      .collection('orders')
      .find({ $or: [{ subtotal: { $exists: false } }, { subtotal: null }] })

    while (await orders.hasNext()) {
      const order = await orders.next()

      order.subtotal = order.total

      await db.collection('orders').findOneAndUpdate({ _id: order._id }, { $set: order })
    }
  },

  async down(db, client) {
    await db.collection('orders').updateMany(
      {
        $or: [{ origin: 'mee' }, { origin: null }]
      },
      { $unset: { origin: 1, subtotal: 1 } }
    )
  }
}
