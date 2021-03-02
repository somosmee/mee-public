import * as Sentry from '@sentry/node'
import { validate, getRealFormat } from 'gtin'
import { quantileSeq } from 'mathjs'
import moment from 'moment'

import ifood from 'src/ifood'

import mapIfoodOrderToOrder from 'src/mapper/ifood'
import mapIfoodOrderStatus from 'src/mapper/ifood/status'

import ifoodScrapper from 'src/scrappers/ifoodScrapper'

import {
  Company,
  User,
  Order,
  IfoodOrder,
  UserProduct,
  Product,
  IfoodMarketplace,
  FinancialStatement
} from 'src/models'

import analytics from 'src/services/analytics'
import mail from 'src/services/mail'
import slack from 'src/services/slack'

import { IfoodAnalysisStatus, OrderStatus } from 'src/utils/enums'
import { SUPPORTED_FORMATS } from 'src/utils/gtin'
import logger from 'src/utils/logger'
import timer from 'src/utils/timer'

const isSameEvent = (currentEvent) => (event) =>
  currentEvent.code === event.code && currentEvent.createdAt === event.createdAt

const verifyNotConfirmedIfoodOrders = async () => {
  const orders = await Order.find({ origin: 'ifood', 'ifood.status': 'INTEGRATED' })

  logger.debug(`[verifyNotConfirmedIfoodOrders] order: ${orders.length}`)

  for (const order of orders) {
    var createdAt = moment(order.createdAt)
    var now = moment(new Date())
    const orderId = order._id
    const company = await Company.findOne({ _id: order.company })

    if (now.diff(createdAt) >= 120000) {
      slack.sendMessage(
        `O usuário de id:${company._id} está com o pedido de id:${orderId} a mais de 2 minutos sem confirmação`
      )
    }
  }
}

const sendRequest = async (request, params, company) => {
  try {
    const response = await request(...params)
    return response.data
  } catch (e) {
    logger.debug(`[sendRequest] ${e?.response?.status} ${company?._id} ${params[0]}`)
    if (e.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      if (e.response.status === 401) {
        await company.refreshIfoodToken()
      } else if (e.response.status === 404) return null
    }

    logger.error(
      `[sendRequest] request: ${request} params: ${params} company: { _id: ${company._id} } } ERROR: ${e}`
    )
    Sentry.captureException(e)
    return null
  }
}

const syncEvents = async (request, params) => {
  logger.debug('♻️  SYNC_EVENTS')
  const openCompanies = await Company.find({ 'ifood.open': true })
  logger.debug(`[syncEvents] OPEN_USERS: ${openCompanies.map((u) => u._id)}`)

  for (const company of openCompanies) {
    if (!company.ifood.latestToken) await company.refreshIfoodToken()

    const events = await sendRequest(ifood.getEvents, [company.ifood.latestToken], company)
    if (!events) continue

    logger.debug(`[syncEvents]EVENTS: ${JSON.stringify(events, null, 2)}`)

    // tell ifood that we got the events
    const eventIds = events.map((event) => ({ id: event.id }))
    await ifood.eventsAcknowledgment(company.ifood.latestToken, eventIds)
    logger.debug(`[syncEvents] ACKNOWLEDGMENT: ${JSON.stringify(eventIds, null, 2)}`)

    for (const event of events) {
      let ifoodOrder = await IfoodOrder.findOne({ reference: event.correlationId })

      if (!ifoodOrder) {
        ifoodOrder = new IfoodOrder({
          reference: event.correlationId,
          status: event.code,
          events: [event]
        })
        await ifoodOrder.save()

        // lets sync ifood order data for the first time
        await syncOrder(company, event.correlationId)
      } else {
        logger.debug(`[syncEvents] NEW EVENT FOR IFOOD ORDER: ${ifoodOrder.reference}`)
        // check if that event already exists
        const exist = ifoodOrder.events.findIndex(isSameEvent(event)) >= 0
        if (exist) return

        ifoodOrder.events.push(event)
        ifoodOrder.status = event.code
        ifoodOrder.markModified('events')
        await ifoodOrder.save()

        // update order status
        const order = await Order.findOne({ 'ifood.reference': event.correlationId })
        if (!order) {
          return logger.error(
            `[syncEvents] Order not found to update status ifood.reference: ${event.correlationId}`
          )
        }

        order.status = mapIfoodOrderStatus(event.code)
        if (order.status === OrderStatus.CLOSED) {
          await order.close()
        }
        order.ifood.set({ status: event.code })
        await order.save()

        // if order is completed generate billable item
        // await UserBill.addBillableItem(order)
      }
    }
  }
}

const resyncOrders = async (company) => {
  logger.debug('♻️  RESYNC_ORDERS')
  const conditions = { synced: false }
  const orders = await IfoodOrder.find(conditions)
  const hasOrders = !!orders.length

  if (hasOrders) await Promise.all(orders.map(async (order) => syncOrder(company, order.reference)))
}

const syncOrder = async (company, reference) => {
  logger.debug(`♻️  SYNC_ORDER: ${company._id}`)
  const orderData = await sendRequest(
    ifood.getOrder,
    [company.ifood.latestToken, reference],
    company
  )
  if (!orderData) return

  logger.debug(`[syncOrder] GOT ORDER: { reference: ${orderData && orderData.reference} }`)

  try {
    // save ifood orderData
    const ifoodOrder = await IfoodOrder.findOne({ reference })
    if (!ifoodOrder) {
      return logger.error(`[syncOrder] IFOOD ORDER NOT FOUND reference: ${reference}`)
    }

    ifoodOrder.set(orderData)
    await ifoodOrder.save()

    logger.debug(`[syncOrder] SAVED IFOOD ORDER: { reference: ${ifoodOrder.reference} }`)

    // lets map ifood order data and update/create our order
    const mappedData = mapIfoodOrderToOrder(ifoodOrder)
    mappedData.company = company._id

    let order = await Order.findOne({ 'ifood.reference': ifoodOrder.reference })

    mappedData.items = await Promise.all(
      mappedData.items.map(async (item) => {
        try {
          if (
            item.gtin &&
            validate(item.gtin) &&
            SUPPORTED_FORMATS.includes(getRealFormat(item.gtin))
          ) {
            const product = await Product.findOne({ gtin: item.gtin })
            if (product) item.product = product._id
          }
        } catch (e) {
          logger.debug('[syncOrder] Invalid gtin')
        }

        return item
      })
    )

    if (!order) {
      order = new Order(mappedData)
    } else {
      order.set(mappedData)
    }

    await order.save()

    logger.debug(`[syncOrder] SAVED ORDER: { _id: ${order._id} }`)

    // tell ifood that we successfully integrated the order to our system
    logger.debug(
      `[syncOrder] SEND INTEGRATION ${company.ifood.latestToken.slice(0, 20)} ${reference}`
    )
    await sendRequest(ifood.orderIntegration, [company.ifood.latestToken, reference], company)

    ifoodOrder.synced = true
    await ifoodOrder.save()
  } catch (e) {
    logger.error('[syncOrder] ERROR:', e)
    Sentry.captureException(e)
  }
}

const getIfoodTokens = async () => {
  logger.debug('🔑  GET_IFOOD_TOKENS')
  const openCompanies = await Company.find({ 'ifood.open': true })
  logger.debug(`[getIfoodTokens] OPEN_USERS: ${openCompanies.map((u) => u._id)}`)

  for (const company of openCompanies) {
    try {
      await company.refreshIfoodToken()
    } catch (e) {
      console.log('ERROR:', e)
      logger.error(`[getIfoodTokens] ERROR: ${e}`)
      Sentry.captureException(e)
    }
  }
}

const buildPaymentIntents = async () => {
  logger.debug('🧾 BUILD PAYMENT INTENTS')

  // get users that have ifood and a payment method setup
  const users = await User.find({
    ifood: { $exists: true },
    card: { $exists: true },
    stripeCustomerId: { $exists: true },
    billableItems: { $exists: true }
  })

  // get completed ifood orders from the last month
  for (const user of users) {
    logger.debug(
      `[buildPaymentIntents] USER: ${user.email} OUSTANDING BILLS: ${user.billableItems}`
    )
    // await UserBill.chargeBillableItems(user)
  }
}

const runIfoodMarketPlaceAnalysis = async (company, options) => {
  logger.debug('🛵 GET IFOOD MARKET PLACE DATA')
  if (!company?.address?.lat || !company?.address?.lng) {
    logger.error(`[runIfoodMarketPlaceAnalysis] lat and lng are mandatory! ${company.email}`)
    throw new Error('User address lat and lng are mandatory')
  }

  const data = {
    lat: company.address.lat,
    lng: company.address.lng
  }

  try {
    if (!options || options.startWith === IfoodAnalysisStatus.GET_DATA_STARTED) {
      company.ifood.marketAnalysisStatus = IfoodAnalysisStatus.GET_DATA_STARTED
      await company.save()

      /* 1- Get and transform data from iFood MarketPlace API */
      await ifoodScrapper.saveMerchantsNearby(data.lat, data.lng, company, IfoodMarketplace)

      await timer.sleep(2000)

      company.ifood.marketAnalysisStatus = IfoodAnalysisStatus.GET_DATA_FINISHED
      await company.save()
    }

    if (!options || options.startWith === IfoodAnalysisStatus.ENTITY_LINKING_STARTED) {
      company.ifood.marketAnalysisStatus = IfoodAnalysisStatus.ENTITY_LINKING_STARTED
      await company.save()

      /* 2 - Entity Linking -> Go through our clients products and get those records that links with them */
      const products = await UserProduct.find({ company: company._id })

      for (const product of products) {
        // This approach for Entity Linking it's pretty flawed
        // in the next iteration we need something more robust otherwise we will
        // generate a lot of non sense analysis

        const similarProducts = await IfoodMarketplace.searchES(product.name, company._id, 50)
        let results = similarProducts.hits?.hits.map((doc) => ({
          score: doc._score,
          ...doc._source
        }))
        logger.debug(`[runIfoodMarketPlaceAnalysis] RESULTS: ${JSON.stringify(results, null, 2)}`)

        // filter based on score
        results = results.filter((result) => result.score > 1.2 && result.unitPrice > 0) // based on pure intuition and little experiments ;)

        /* 3 - calculate statistics */
        const prices = results.map((result) => result.unitPrice)
        logger.debug(`[runIfoodMarketPlaceAnalysis] PRICES: ${JSON.stringify(prices, null, 2)}`)

        if (prices.length > 0) {
          const q0 = quantileSeq(prices, 0)
          const q1 = quantileSeq(prices, 0.25)
          const q2 = quantileSeq(prices, 0.5)
          const q3 = quantileSeq(prices, 0.75)
          const q4 = quantileSeq(prices, 1)

          logger.debug(
            `[runIfoodMarketPlaceAnalysis] STATS: ${product.name} ${q0} ${q1} ${q2} ${q3} ${q4}`
          )

          product.ifood = {
            q0,
            q1,
            q2,
            q3,
            q4
          }

          await product.save()
        }
      }

      company.ifood.marketAnalysisStatus = IfoodAnalysisStatus.ENTITY_LINKING_FINISHED
      await company.save()

      // clean data since we don't need anymore :)
      const merchants = await IfoodMarketplace.find({ company: company._id })
      for (const merchant of merchants) {
        await merchant.remove()
      }
    }
  } catch (e) {
    logger.error(`[runIfoodMarketPlaceAnalysis] ERROR: ${e}`)
  }
}

const sendReports = async () => {
  if (process.env.NODE_ENV === 'production') {
    await analytics.sendReports()
  }
  //   const ini = moment.utc().subtract(7, 'days')
  //   const end = moment.utc()
  //
  //   const activeUsersMap = await statistics.getActiveUsers(ini, end)
  //   const ids = Array.from(activeUsersMap.keys())
  //
  //   const users = await User.find({ _id: { $in: ids } }).sort({ createdAt: -1 })
  //
  //   for (const user of users) {
  //     const stats = await statistics.getUserStats(user)
  //     user.sales = stats.sales
  //     user.products = stats.products
  //   }
  //
  //   const message = `
  //   ---- Usuário Ativos --- ${ini.format('DD-MM-YYYY')} ${end.format('DD-MM-YYYY')}
  //   Total: ${users.length}
  //   usuários:
  //   ${users.map((u) => `- ${u.email} sales: ${u.sales} products: ${u.products} \n`)}
  // `
  //
  //   logger.debug(`[sendActiveUsersReport] ${message}`)
  //
  //   if (process.env.NODE_ENV === 'production') {
  //     slack.sendMessage(message)
  //   }
}

const reclassifyUsers = async () => {
  if (process.env.NODE_ENV === 'production') {
    await analytics.reclassifyUsers()
  }
}

const sendEmails = async () => {
  /**
   * NO ACTION FLOW
   */

  /* D1 NO ACTION */
  let ini = moment
    .utc()
    .subtract(1, 'day')
    .startOf('day')
  let end = moment
    .utc()
    .subtract(1, 'day')
    .endOf('day')

  const usersD1 = await User.find({ isNoAction: true, createdAt: { $gte: ini, $lte: end } })

  for (const user of usersD1) {
    await mail.send(
      {
        to: user.email,
        subject: 'O que você achou da Mee?'
      },
      'nps.html'
    )
  }

  /* D2 NO ACTION */
  ini = moment
    .utc()
    .subtract(2, 'day')
    .startOf('day')
  end = moment
    .utc()
    .subtract(2, 'day')
    .endOf('day')

  const usersD2 = await User.find({ isNoAction: true, createdAt: { $gte: ini, $lte: end } })

  for (const user of usersD2) {
    await mail.send(
      {
        to: user.email,
        subject: 'Leve seu negócio a um novo patamar!'
      },
      'benefits.html'
    )
  }

  /* D3 NO ACTION */
  ini = moment
    .utc()
    .subtract(3, 'day')
    .startOf('day')
  end = moment
    .utc()
    .subtract(3, 'day')
    .endOf('day')

  await User.updateMany(
    { isNoAction: true, createdAt: { $gte: ini, $lte: end } },
    { $set: { newsLetterSubscriber: true } }
  )

  /**
   * UNCOMPLETED ONBOARDING STEPS
   */

  /* D1 */
  ini = moment
    .utc()
    .subtract(1, 'day')
    .startOf('day')
  end = moment
    .utc()
    .subtract(1, 'day')
    .endOf('day')

  const usersD1Action = await User.find({ isNoAction: false, createdAt: { $gte: ini, $lte: end } })

  for (const user of usersD1Action) {
    await mail.send(
      {
        to: user.email,
        subject: 'Complete os primeiros passos para ter mais controle do seu negócio.'
      },
      'complete-first-steps.html'
    )
  }

  /* D2 */
  ini = moment
    .utc()
    .subtract(2, 'day')
    .startOf('day')
  end = moment
    .utc()
    .subtract(2, 'day')
    .endOf('day')

  const usersD2Action = await User.find({ isNoAction: false, createdAt: { $gte: ini, $lte: end } })

  for (const user of usersD2Action) {
    await mail.send(
      {
        to: user.email,
        subject: 'Leve seu negócio a um novo patamar!'
      },
      'benefits.html'
    )
  }

  /* D3 */
  ini = moment
    .utc()
    .subtract(3, 'day')
    .startOf('day')
  end = moment
    .utc()
    .subtract(3, 'day')
    .endOf('day')

  const usersD3Action = await User.find({ isNoAction: false, createdAt: { $gte: ini, $lte: end } })

  for (const user of usersD3Action) {
    await mail.send(
      {
        to: user.email,
        subject: 'O que você achou da Mee?'
      },
      'nps.html'
    )
  }

  /* D4 */
  ini = moment
    .utc()
    .subtract(4, 'day')
    .startOf('day')
  end = moment
    .utc()
    .subtract(4, 'day')
    .endOf('day')

  await User.updateMany(
    {
      createdAt: { $gte: ini, $lte: end }
    },
    { $set: { newsLetterSubscriber: true } }
  )
}

const adjustBalanceWithPendingStatements = async () => {
  const start = moment().startOf('day')
  const end = moment().endOf('day')

  const statements = await FinancialStatement.find({
    paid: false,
    dueAt: { $gte: start, $lte: end }
  })

  for (const statement of statements) {
    await FinancialStatement.adjustBalance(statement)

    statement.paid = true
    await statement.save()
  }
}

const createAssociationRules = async () => {
  // consider active users who has sales on the last 2 weeks
  // get all active users and hit the analytics API to create the association rules
  const start = moment()
    .subtract(2, 'weeks')
    .startOf('day')
  const end = moment().endOf('day')

  const results = await Order.aggregate([
    { $match: { closedAt: { $gte: start.toDate(), $lte: end.toDate() } } },
    { $group: { _id: '$company' } }
  ])

  for (const company of results) {
    console.log(company)
    // await analytics.recalculateAssociationRules(company)
    await timer.sleep(2000)
  }
}

export {
  syncEvents,
  resyncOrders,
  getIfoodTokens,
  buildPaymentIntents,
  sendReports,
  sendEmails,
  reclassifyUsers,
  createAssociationRules,
  runIfoodMarketPlaceAnalysis,
  verifyNotConfirmedIfoodOrders,
  adjustBalanceWithPendingStatements
}
