module.exports = {
  async up(db) {
    await db.collection('products').updateMany({}, { '$unset': { _completion: '' } })

    const ups = await db.collection('usersProducts').find({})

    while (await ups.hasNext()) {
      const userProduct = await ups.next()
      const product = await db.collection('products').findOne({ _id: userProduct.product  })

      const terms = product.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ')
      const completion = terms.map((term, idx) => terms.slice(idx, terms.length).join(' '))

      await db.collection('usersProducts').findOneAndUpdate({ _id: userProduct._id }, { $set: { _completion: completion } })
    }
  },

  async down(db) {
    await db.collection('usersProducts').updateMany({}, { '$unset': { _completion: '' } })

    const products = await db.collection('products').find({})

    while (await products.hasNext()) {
      const product = await products.next()

      const terms = product.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ')
      const completion = terms.map((term, idx) => terms.slice(idx, terms.length).join(' '))
      product._completion = completion

      await db.collection('products').findOneAndUpdate({ _id: product._id }, { $set: product })
    }
  }
}
