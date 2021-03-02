module.exports = {
  async up(db, client) {
    const usersProducts = await db.collection('usersProducts').find({})

    while (await usersProducts.hasNext()) {
      const userProduct = await usersProducts.next()

      const product = await db
        .collection('products')
        .findOne({ _id: userProduct.product })

      if (product.name) {
        await db
          .collection('usersProducts')
          .findOneAndUpdate({ _id: userProduct._id }, {
            $set: { name: product.name }
          })
      } else {
        console.log('[migration] PRODUCT NOT FOUND', userProduct, product)
      }
    }
  },

  async down(db, client) {
  }
}
