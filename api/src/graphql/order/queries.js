import { ObjectID } from 'mongodb'

import { Order, Product, UserProduct, AssociationRule } from 'src/models'

import { isPublicResolver, isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import { createQueryFilter } from 'src/utils/order'
import { createPaginationPayload, enforcePaginationParams } from 'src/utils/pagination'

export const order = isAuthenticatedResolver.createResolver(
  async (parent, { id }, { company }, info) => {
    if (!ObjectID.isValid(id)) throw new Error('Order id is not valid')

    const order = await Order.findOne({ _id: id, company: company._id })
    if (!order) throw new Error('Pedido não encontrado')

    return order
  }
)

export const orderPreview = isPublicResolver.createResolver(
  async (parent, { id }, context, info) => {
    if (!ObjectID.isValid(id)) throw new Error('Order id is not valid')

    const order = await Order.findOne({ _id: id })
    if (!order) throw new Error('Pedido não encontrado')

    return order
  }
)

export const orders = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    let conditions = { company: company._id }

    const { first, skip } = enforcePaginationParams({ ...input?.filter })
    const options = { skip, limit: first }

    conditions = createQueryFilter(input?.filter, conditions)

    const orders = await Order.find(conditions, null, options).sort({ createdAt: -1 })
    if (!orders) throw new Error('Error while fetch orders')

    const count = await Order.countDocuments(conditions)

    return {
      orders,
      pagination: createPaginationPayload({ first, skip, count })
    }
  }
)

export const searchOrders = isAuthenticatedResolver.createResolver(
  async (parent, { text }, { company }, info) => {
    const searchResults = await Order.searchES(text, company._id)

    if (!searchResults.hits.total === 0) return []

    const ids = searchResults.hits.hits.map((hit) => hit._id)
    const orders = await Order.find({ _id: { $in: ids } })

    return orders
  }
)

export const getDeliveryDetails = isAuthenticatedResolver.createResolver(
  async (parent, { input: { address } }, { company }, info) => {
    const data = await company.calculateDeliveryFee({ delivery: { address } })

    return data
  }
)

export const getSuggestions = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company, pubsub }, info) => {
    const order = await Order.findOne({ _id: input.id, company: company._id })
    if (!order) throw new Error('Pedido não encontrado!')

    const associationRules = await AssociationRule.findOne({ company: company._id })

    if (associationRules) {
      const suggestions = []
      const rules = associationRules.rules

      if (rules && Object.keys(rules).length > 0) {
        for (const item of order.items) {
          const rule = rules[item.product.toString()]

          if (rule) {
            let maxConf = 0
            let bestOption = null

            for (const option of rule) {
              if (option.conf > maxConf) {
                maxConf = option.conf
                bestOption = option.add
              }
            }

            const product = await Product.findOne({ _id: bestOption })
            const userProduct = await UserProduct.findOne({
              product: product._id,
              company: company._id
            })

            if (product) {
              userProduct.product = product
              userProduct.confidence = maxConf
              suggestions.push(userProduct)
            }
          }
        }
      }

      return Product.mergeSearch(suggestions)
    } else {
      return []
    }
  }
)
