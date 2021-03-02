module.exports = {
  async up(db, client) {
    const productionRequests = await db.collection('productionRequests').find({})

    while (await productionRequests.hasNext()) {
      const productionRequest = await productionRequests.next()

      const items = [
        {
          product: productionRequest.product,
          name: productionRequest.name,
          quantity: productionRequest.quantity,
          note: productionRequest.note
        }
      ]

      await db.collection('productionRequests').findOneAndUpdate(
        { _id: productionRequest._id },
        {
          $set: { items },
          $unset: { product: -1, name: -1, quantity: -1, note: -1 }
        }
      )
    }
  },

  async down(db, client) {}
}
