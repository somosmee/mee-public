import { syncEvents, buildPaymentIntents } from 'src/cronjobs/jobs'

import { Company, User, Order } from 'src/models'

import { isAdminResolver } from 'src/graphql/resolvers/authentication'

import { ifood } from 'src/test/common/mocks'

import { OrderStatus, Origins, Roles } from 'src/utils/enums'

export const simulateConcludeIfoodOrders = isAdminResolver.createResolver(
  async (parent, { email }, { user }, info) => {
    const useriFood = await User.findOne({ email })
    if (!useriFood) throw new Error('User not found')

    const company = await Company.findOne({
      'members.user': useriFood._id,
      'members.role': Roles.BUSINESS_ADMIN
    })

    const openIfoodOrders = await Order.find({
      company: company._id,
      origin: Origins.IFOOD,
      status: OrderStatus.OPEN
    })

    const stub = ifood.stubGet()

    stub.onCall(0).resolves({
      statusCode: 200,
      data: openIfoodOrders.map((order) => {
        return {
          id: 'b645b281-2b06-46ac-a411-aea2eff77f7b',
          code: 'CONCLUDED',
          correlationId: order.ifood.reference,
          createdAt: '2020-02-21T20:49:21.518Z'
        }
      })
    })

    await syncEvents()

    stub.restore()

    await buildPaymentIntents()

    return 'Success'
  }
)
