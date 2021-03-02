require('../src/utils/prototypes')

module.exports = {
  async up(db) {
    const products = await db.collection('products').find({})

    while (await products.hasNext()) {
      const product = await products.next()

      const $set = {}

      if (product.name) $set.name = product.name.toLowerCase()
      if (product.description) $set.description = product.description.toLowerCase()

      await db.collection('products')
        .findOneAndUpdate({ _id: product._id },{ $set })
    }
  },

  async down(db) {
    const products = await db.collection('products').find({})

    while (await products.hasNext()) {
      const product = await products.next()

      const $set = {}

      if (product.name) $set.name = product.name.toUpperCase()
      if (product.description) $set.description = product.description.toUpperCase()

      await db.collection('products')
        .findOneAndUpdate({ _id: product._id }, { $set })
    }
  }
}
