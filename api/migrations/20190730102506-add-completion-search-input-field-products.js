module.exports = {
  async up(db) {
    const products = await db.collection('products').find({})

    while (await products.hasNext()) {
      const product = await products.next()

      const terms = product.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ')
      const completion = terms.map((term, idx) => terms.slice(idx, terms.length).join(' '))
      product._completion = completion

      await db.collection('products').findOneAndUpdate({ _id: product._id }, { $set: product })
    }
  },

  async down(db) {
    await db.collection('products').updateMany({}, { '$unset': { _completion: '' } })
  }
}
