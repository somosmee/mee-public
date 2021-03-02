import { Product, UserProduct } from 'src/models'

export default {
  bundle: async (parent, args, { company }, info) => {
    const products = parent.bundle?.map(async (item) => {
      const userProduct = await UserProduct.findOne({
        company: company._id,
        product: item.product
      }).populate('product')
      if (!userProduct) return null

      const mergeProduct = Product.merge(userProduct)

      return {
        product: mergeProduct._id,
        quantity: item.quantity,
        name: mergeProduct.name,
        gtin: mergeProduct.gtin
      }
    })

    return products
  }
}
