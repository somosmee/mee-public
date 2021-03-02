module.exports = {
  async up(db) {
    const data = []
    const products = await db.collection('products').find({})

    while (await products.hasNext()) {
      const product = await products.next()
      data.push({
        grocery: product.grocery,
        product: product._id,
        price: product.price,
        createdAt: new Date()
      })
    }

    const hasData = !!data.length
    if (hasData) {
      await db.collection('usersProducts').insertMany(data)
    }

    // remove grocery
    await db.collection('products').updateMany({}, { $unset: { grocery: '', price: '' } })
  },

  async down(db) {
    const ups = await db.collection('usersProducts').find({})

    while (await ups.hasNext()) {
      const up = await ups.next()
      await db
        .collection('products')
        .updateOne({ _id: up.product }, { $set: { grocery: up.grocery } })
    }

    await db.collection('usersProducts').deleteMany()
  }
}
