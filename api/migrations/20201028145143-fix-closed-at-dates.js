module.exports = {
  async up(db, client) {
    const sales = await db.collection('orders').find({
      status: 'closed'
    })

    while (await sales.hasNext()) {
      const order = await sales.next()

      if (!order.closedAt) {
        await db.collection('orders').findOneAndUpdate(
          { _id: order._id },
          {
            $set: { closedAt: order.updatedAt }
          }
        )
      }
    }
  },

  async down(db, client) {}
}
