module.exports = {
  async up(db, client) {
    const usersProducts = await db.collection('usersProducts').find({})

    while (await usersProducts.hasNext()) {
      const userProduct = await usersProducts.next()

      const [lastInventoryMovement] = await db
        .collection('inventory')
        .find({ grocery: userProduct.grocery, product: userProduct.product })
        .sort({ createdAt: -1 })
        .limit(1)
        .toArray()

      userProduct.balance = lastInventoryMovement ? lastInventoryMovement.balance : 0

      await db
        .collection('usersProducts')
        .findOneAndUpdate({ _id: userProduct._id }, { $set: userProduct })
    }
  },

  async down(db, client) {
    await db.collection('usersProducts').updateMany({}, { $unset: { balance: 1 } })
  }
}
