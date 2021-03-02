module.exports = {
  async up(db, client) {
    const sales = await db.collection('financialStatements').find({
      order: { $exists: true }
    })

    while (await sales.hasNext()) {
      const sale = await sales.next()

      const order = await db.collection('orders').findOne({ _id: sale.order })

      if (!sale.dueAt && order) {
        await db.collection('financialStatements').findOneAndUpdate(
          { _id: sale._id },
          {
            $set: { dueAt: order.closedAt }
          }
        )
      }
    }
  },

  async down(db, client) {}
}
