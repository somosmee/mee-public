import moment from 'moment'

import { Order } from 'src/models'

import { isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import { OrderStatus } from 'src/utils/enums'

export const reports = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    let startDate = null
    let endDate = null
    let groupBy = 'month'
    const groupByLabel = 'Mês'

    if (input) {
      startDate = moment(input.startDate)
      endDate = moment(input.endDate)
      groupBy = input.groupBy
    } else {
      startDate = moment()
        .startOf('week')
        .toISOString()
      endDate = moment()
        .endOf('week')
        .toISOString()
    }

    const interval = endDate.diff(startDate, 'days')

    const previousStartDate = moment(startDate)
      .subtract(interval, 'days')
      .startOf('day')
    const previousEndDate = moment(endDate)
      .subtract(1, 'days')
      .endOf('day')

    const hasSales =
      (await Order.countDocuments({
        company: company._id,
        status: OrderStatus.CLOSED
      })) > 0

    // check resolver on type Reports
    return {
      hasSales,
      previousStartDate,
      previousEndDate,
      interval,
      startDate,
      endDate,
      groupBy,
      groupByLabel
    }
  }
)
