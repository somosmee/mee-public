import { withFilter } from 'apollo-server-express'
import moment from 'moment'

import { isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import { Topics } from 'src/utils/enums'
import logger from 'src/utils/logger'

export const orderClosed = {
  subscribe: isAuthenticatedResolver.createResolver(
    withFilter(
      (parent, args, { pubsub, user, company }, info) => {
        logger.info(`subscription - orderClosed - context: ${company?._id} ${user?.email}`)
        return pubsub.asyncIterator('orderClosed')
      },
      (payload, params, { company }) => {
        logger.info(
          `subscription - orderClosed - withFilter:
        ${payload?.orderClosed?.company?.toString()}
        ${company?._id}
        ${company?._id.toString() === payload.orderClosed.company.toString()}
        `
        )
        return company._id.toString() === payload.orderClosed.company.toString()
      }
    )
  )
}

export const productionRequest = {
  subscribe: isAuthenticatedResolver.createResolver(
    withFilter(
      (parent, args, { pubsub, user, company }, info) => {
        logger.info(`subscription - productionRequest - context: ${company?._id} ${user?.email}`)
        return pubsub.asyncIterator(Topics.PRODUCTION_REQUEST)
      },
      (payload, params, { company }) => {
        logger.info(
          `subscription - productionRequest - withFilter:
        ${payload?.productionRequest?.company?.toString()}
        ${company?._id}
        ${company?._id?.toString() === payload?.productionRequest?.company?.toString()}
        `
        )
        return company._id.toString() === payload.productionRequest.company.toString()
      }
    )
  )
}

export const order = {
  subscribe: isAuthenticatedResolver.createResolver(
    withFilter(
      (parent, args, { pubsub }, info) => pubsub.asyncIterator(Topics.ORDER),
      (payload, { input }, { company }, info) => {
        let isWithinFilter = false
        const isSameCompany = company._id.toString() === payload.order.company.toString()

        if (input?.start && input?.end) {
          isWithinFilter = moment(payload.order.createdAt).isBetween(input.start, input.end)
        } else if (input?.start) {
          isWithinFilter = moment(payload.order.createdAt).isSameOrAfter(input.start)
        } else if (input?.end) {
          isWithinFilter = moment(payload.order.createdAt).isSameOrBefore(input.end)
        } else {
          isWithinFilter = true
        }

        return isSameCompany && isWithinFilter
      }
    )
  )
}
