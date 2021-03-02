import stripe from 'src/stripe'

import { runIfoodMarketPlaceAnalysis } from 'src/cronjobs/jobs'

import * as models from 'src/models'

import { isAdminResolver } from 'src/graphql/resolvers/authentication'

import { IfoodAnalysisStatus } from 'src/utils/enums'
import token from 'src/utils/token'

export const resyncStripeData = isAdminResolver.createResolver(
  async (parent, { email }, context, info) => {
    const userStripe = await models.User.findOne({ email })
    if (!userStripe) throw new Error('User not found')

    stripe.resyncStripeData(userStripe)

    return 'Success'
  }
)

export const generateToken = isAdminResolver.createResolver(
  async (parent, { email }, context, info) => {
    const user = await models.User.findOne({ email })

    return token.generateToken({ userId: user._id })
  }
)

export const reprocessIfoodMarketAnalysis = isAdminResolver.createResolver(
  async (parent, { email, startWith }, context, info) => {
    const userIfood = await models.User.findOne({ email })
    if (!userIfood) throw new Error('User not found')

    runIfoodMarketPlaceAnalysis(userIfood, {
      startWith: startWith || IfoodAnalysisStatus.ENTITY_LINKING_STARTED
    })

    return 'Success'
  }
)

// syncronyze ES indexes. CAREFUL order model syncronyze can bring the api down!!
export const syncronyzeIndexes = isAdminResolver.createResolver(
  async (parent, { entities }, context, info) => {
    for (const entity of entities) {
      models[entity].synchronize()
    }
    return 'Success'
  }
)
