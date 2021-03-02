import { Company } from 'src/models'

import { isAuthenticatedResolver, isPublicResolver } from 'src/graphql/resolvers/authentication'

export const shopfront = isAuthenticatedResolver.createResolver(
  async (parent, args, { company }, info) => {
    if (!company.shopfront) {
      company.set({ shopfront: { products: [] } })
      await company.save()
    }

    // populate product data
    const data = Company.populateShopfrontData(company)

    return data
  }
)

export const shopfronts = isPublicResolver.createResolver(async (parent, { id }, context, info) => {
  const company = await Company.findOne({ 'shopfront._id': id })
  if (!company) throw new Error('Nenhuma vitrine encontrada!')

  if (!company.shopfront) {
    company.set({ shopfront: { products: [] } })
    await company.save()
  }

  // populate product data
  const data = Company.populateShopfrontData(company)

  return data
})
