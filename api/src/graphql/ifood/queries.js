import ifood from 'src/ifood'

import { mapIfoodCategory } from 'src/mapper/ifood'

import { UserProduct } from 'src/models'

import { isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import { IfoodAvailability } from 'src/utils/enums'
import logger from 'src/utils/logger'

export const getIfoodCategories = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    if (!company.ifood.latestToken) await company.refreshIfoodToken()
    if (!company.ifood.merchant) throw new Error('Id do comerciante é necessário')

    let response = null
    try {
      response = await ifood.getCategories(company.ifood.latestToken, company.ifood.merchant)
    } catch (error) {
      if (error.response?.status === 401) {
        logger.error('❗️ [getIfoodCategories] ', error)
        await company.refreshIfoodToken()
        response = await ifood.getCategories(company.ifood.latestToken, company.ifood.merchant)
      } else {
        logger.error('❗️ [getIfoodCategories] ', error)
        throw error
      }
    }

    const categories = await Promise.all(
      response?.data.map(async (category) => {
        if (category.availability === IfoodAvailability.AVAILABLE) {
          const getCategoryResponse = await ifood.getCategory(
            company.ifood.latestToken,
            company.ifood.merchant,
            category.id
          )

          if (getCategoryResponse?.data.skus) {
            category.skus = await Promise.all(
              getCategoryResponse.data.skus.map(async (sku) => {
                const getItemResponse = await ifood.getItem(
                  company.ifood.latestToken,
                  company.ifood.merchant,
                  sku.id
                )

                sku.complements = getItemResponse?.data

                return sku
              })
            )
          }
        }

        return mapIfoodCategory(category)
      }) ?? []
    )

    return { categories }
  }
)

export const ifoodPriceAnalysis = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    const ups = await UserProduct.find({ company: company.id, ifood: { $exists: true } })

    // return null if we dont have processed data from analysis
    if (ups.length === 0) return null

    // calculate user price median and market median
    let median = 0
    let marketMedian = 0
    const alerts = []

    for (const up of ups) {
      const {
        product,
        name,
        price,
        ifood: { q1, q2, q3 }
      } = up

      median += price
      marketMedian += q2

      // check alert
      if (price >= q3 && q3 > 0) {
        const percent = (price - q3) / q3
        alerts.push({ product, name, percent })
      } else if (price <= q1 && q3 > 0) {
        const percent = (price - q1) / q1
        alerts.push({ product, name, percent })
      }
    }

    median = median / ups.length
    marketMedian = marketMedian / ups.length

    return { general: { median, marketMedian }, alerts }
  }
)
