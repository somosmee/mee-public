module.exports = {
  async up(db, client) {
    const usersProducts = await db.collection('usersProducts').find({})

    while (await usersProducts.hasNext()) {
      const userProduct = await usersProducts.next()

      const product = await db
        .collection('products')
        .findOne({ _id: userProduct.product })

      userProduct.name = product.name

      await db
        .collection('usersProducts')
        .findOneAndUpdate({ _id: userProduct._id }, {
          $set: userProduct
        })
    }

    await db.collection('usersProducts').updateMany({}, { $unset: { _completion: 1 } })
  },

  async down(db, client) {
    await db.collection('usersProducts').updateMany({}, { $unset: { name: 1 } })

    const ups = await db.collection('usersProducts').find({})

    while (await ups.hasNext()) {
      const userProduct = await ups.next()
      const product = await db.collection('products').findOne({ _id: userProduct.product })

      const terms = product.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ')
      const completion = terms.map((term, idx) => terms.slice(idx, terms.length).join(' '))

      await db.collection('usersProducts').findOneAndUpdate({ _id: userProduct._id }, { $set: { _completion: completion } })
    }
  }
}
