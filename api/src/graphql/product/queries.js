import { ObjectID } from 'mongodb'

import { Product, UserProduct } from 'src/models'

import { isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import { createPaginationPayload, enforcePaginationParams } from 'src/utils/pagination'

export const product = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    let userProduct = null

    if (input.product) {
      userProduct = await UserProduct.findOne({
        company: company._id,
        product: input.product
      }).populate('product')
      if (!userProduct) {
        throw new Error('Falha ao recuperar informações do produto. Produto não encontrado!')
      }
    } else if (input.gtin) {
      const product = await Product.findOne({ gtin: input.gtin })
      if (!product) {
        throw new Error('Falha ao recuperar informações do produto. Produto não encontrado.')
      }

      userProduct = await UserProduct.findOne({
        company: company._id,
        product: product._id
      })
      userProduct.product = product
    } else {
      throw new Error('Id ou gtin deve ser informado')
    }

    return Product.merge(userProduct)
  }
)

export const productGTIN = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { user }, info) => {
    const product = await Product.findOne({ gtin: input.gtin })
    if (!product) throw new Error('Nenhum produto encontrado com esse GTIN!')

    return product
  }
)

export const products = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    const { first, skip } = enforcePaginationParams(input && input.pagination)

    const options = { skip, limit: first }
    const userProducts = await UserProduct.find({ company: company._id }, null, options).populate(
      'product'
    )

    const products = userProducts.map(Product.merge)

    const count = await UserProduct.countDocuments({ company: company._id })
    const productsPayload = {
      products,
      pagination: createPaginationPayload({ first, skip, count })
    }

    return productsPayload
  }
)

export const searchProducts = isAuthenticatedResolver.createResolver(
  async (parent, { text }, { company }, info) => {
    const searchResults = await UserProduct.searchES(text, company._id)

    if (!searchResults.hits.total === 0) return []

    const map = new Map()
    const userProductIds = []

    searchResults.hits.hits.forEach((result) => {
      // define the initial order
      map.set(result._id, result)
      userProductIds.push(new ObjectID(result._id))
    })

    const ups = await UserProduct.find({ _id: { $in: userProductIds } })
    const userProducts = []

    for (let i = 0; i < ups.length; i++) {
      const userProduct = ups[i]
      console.log('[searchProducts] userProduct:', userProduct)
      if (!userProduct) continue
      const product = await Product.findById(userProduct.product)

      if (product) {
        userProduct.product = product
        userProducts.push(userProduct)
      }
    }

    const results = Product.mergeSearch(userProducts)

    return results
  }
)
