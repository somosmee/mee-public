import moment from 'moment'

import { UserProduct, Company, Order } from 'src/models'

import { isAdminResolver } from 'src/graphql/resolvers/authentication'

import analytics from 'src/services/analytics'

import logger from 'src/utils/logger'

const getInactiveUsersFromDate = async (date) => {
  date = moment(date)
  const end = date.toISOString()
  const ini = date.subtract(7, 'days').toISOString()

  logger.debug(`INACTIVE FROM ${ini} to ${end}`)

  // get all users that don't have any products registered
  const usersWithProducts = await UserProduct.aggregate([{ $group: { _id: '$company' } }])

  const userWithProductsIds = usersWithProducts.map((u) => u._id)

  const usersWithNoProducts = await Company.find({
    _id: { $nin: userWithProductsIds }
  })

  const usersNoProductsMap = new Map(usersWithNoProducts.map((u) => [u._id.toString(), u._id]))

  // get users that did made a sale in the last week
  const usersWithSales = await Order.aggregate([
    { $match: { createdAt: { $gte: new Date(ini), $lte: new Date(end) } } },
    { $group: { _id: '$company' } }
  ])

  const userWithSalesIds = usersWithSales.map((u) => u._id)

  const usersWithNoSales = await Company.find({
    _id: { $nin: userWithSalesIds }
  })

  const usersNoSalesMap = new Map(usersWithNoSales.map((u) => [u._id.toString(), u._id]))

  const uniqueUsers = new Map([...usersNoSalesMap, ...usersNoProductsMap])

  // return unique values of users
  return [...uniqueUsers.values()]
}

const isUserActive = async (userId, startDate, endDate) => {
  const ini = moment(startDate).toISOString()
  const end = moment(endDate).toISOString()

  // check if has at least 1 product registered
  const products = await UserProduct.find({ company: userId })
  if (products.length === 0) return false

  // check if has made at least 1 sale in the last week
  const sales = await Order.find({
    company: userId,
    createdAt: { $gte: new Date(ini), $lte: new Date(end) }
  })
  if (sales.length === 0) return false

  return true
}

const countUsersStatus = async (userIds, startDate, endDate, active = true) => {
  let count = 0

  for (const userId of userIds) {
    const status = await isUserActive(userId, startDate, endDate)

    if (status === active) {
      count += 1
    }
  }

  return count
}

const getActiveUsersFromDate = async (date) => {
  date = moment(date)
  const end = date.toISOString()
  const ini = date.subtract(7, 'days').toISOString()

  logger.debug(`ACTIVE FROM ${ini} to ${end}`)

  // get all users that don't have any products registered
  const usersWithProducts = await UserProduct.aggregate([{ $group: { _id: '$company' } }])

  const userWithProductsIds = usersWithProducts.map((u) => u._id)

  // get users that didn't made a sale in the last week
  const activeUsers = await Order.aggregate([
    {
      $match: {
        company: { $in: userWithProductsIds },
        createdAt: { $gte: new Date(ini), $lte: new Date(end) }
      }
    },
    { $group: { _id: '$company' } }
  ])

  const activeUsersIds = activeUsers.map((u) => u._id)

  return activeUsersIds
}

export const kpi = isAdminResolver.createResolver(async (parent, { input }, context, info) => {
  logger.debug(`KPI FROM ${input.startDate} to ${input.endDate}`)

  /**
   * KPI - new active users
   * we want to know how many users became active given a time frame
   * that means that before this period he was considered inactive
   * and became active within this period
   *
   * active user: 1+ product and 1+ sale per week
   */

  /* get users that were considered inactive one day prior startDate */
  const beforeTimeFrame = moment(input.startDate).subtract(1, 'day')

  const inactiveUsers = await getInactiveUsersFromDate(beforeTimeFrame)

  const newActiveUsers = await countUsersStatus(inactiveUsers, input.startDate, input.endDate)

  /**
   * KPI - churn
   * we want to know which users where active before a time frame
   * and became inactive within the given time frame
   */

  const activeUsers = await getActiveUsersFromDate(beforeTimeFrame)

  const churn = await countUsersStatus(activeUsers, input.startDate, input.endDate, false)

  return { newActiveUsers, churn }
})

export const sendReports = isAdminResolver.createResolver(
  async (parent, { input }, context, info) => {
    logger.debug('SENDING REPORTS TO SLACK')

    await analytics.sendReports()

    return 'OK'
  }
)

export const reclassifyUsers = isAdminResolver.createResolver(
  async (parent, { input }, context, info) => {
    logger.debug('RECLASSIFYING USERS')

    await analytics.reclassifyUsers()

    return 'OK'
  }
)
