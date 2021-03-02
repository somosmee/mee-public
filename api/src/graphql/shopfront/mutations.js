import { Company, UserProduct } from 'src/models'

import { isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

export const addProductShopfront = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    // check if product exist in database
    const userProduct = await UserProduct.findOne({ product: input.product, company: company._id })

    if (!userProduct) throw new Error('Produto não existe!')

    // check if product already exist in shopfront
    if (company?.shopfront?.products.find((id) => id.toString() === userProduct._id.toString())) {
      throw new Error('Produto já existe na vitrine digital!')
    }

    if (!company.shopfront) company.set({ shopfront: { products: [] } })

    company.shopfront.products.push(userProduct._id)

    await company.save()

    // populate product data
    const data = Company.populateShopfrontData(company)

    return data
  }
)

export const deleteProductShopfront = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    company.shopfront.products = company.shopfront.products.filter(
      (id) => id.toString() !== input.userProduct
    )

    await company.save()

    // populate product data
    const data = Company.populateShopfrontData(company)

    return data
  }
)
