import moment from 'moment'

import { Order, UserProduct, FinancialStatement } from 'src/models'

import { OrderStatus, Payments, FinancialOperations } from 'src/utils/enums'
import logger from 'src/utils/logger'
import set from 'src/utils/set'

export const getActiveUsers = async (ini, end) => {
  if (!ini || !end) throw new Error('Date ini and end are required')
  // users that made sales in the time period
  const usersWithSales = await Order.aggregate([
    { $match: { createdAt: { $gte: new Date(ini), $lte: new Date(end) } } },
    { $group: { _id: '$company' } }
  ])

  const usersSalesMap = new Map(usersWithSales.map((u) => [u._id.toString(), u._id]))

  // users that created products in the time period
  const usersWithProducts = await UserProduct.aggregate([
    { $match: { createdAt: { $gte: new Date(ini), $lte: new Date(end) } } },
    { $group: { _id: '$company' } }
  ])

  const usersProductsMap = new Map(usersWithProducts.map((u) => [u._id.toString(), u._id]))

  // map those ids to become uniques
  const uniqueUsers = new Map([...usersSalesMap, ...usersProductsMap])

  return uniqueUsers
}

export const getUserStats = async (user) => {
  const salesCount = await Order.count({ company: user._id })
  const productsCount = await UserProduct.count({ company: user._id })

  return { sales: salesCount, products: productsCount }
}

export const retentionStats = async (company, startDate, endDate, calculateDiff = false) => {
  const start = moment(startDate).startOf('day')
  const end = moment(endDate).endOf('day')

  const interval = end.diff(start, 'days')

  const previousStart = moment(start)
    .subtract(interval, 'days')
    .startOf('day')
  const previousEnd = moment(start)
    .subtract(1, 'days')
    .endOf('day')

  logger.debug(
    `current: { start: ${start.format('DD/MM/YYYY HH:mm:SS')}, end: ${end.format(
      'DD/MM/YYYY HH:mm:SS'
    )} }`
  )

  logger.debug(
    `previous: { start: ${previousStart.format('DD/MM/YYYY HH:mm:SS')}, end: ${previousEnd.format(
      'DD/MM/YYYY HH:mm:SS'
    )} }`
  )

  // get customers from previous period
  const previousOrders = await Order.find({
    company: company._id,
    status: OrderStatus.CLOSED,
    customer: { $exists: true },
    createdAt: { $gte: previousStart.toDate(), $lte: previousEnd.toDate() }
  }).lean()
  const previousCustomers = new Set(previousOrders.map((order) => order.customer.toString()))

  // get customers from current period
  const currentOrders = await Order.find({
    company: company._id,
    status: OrderStatus.CLOSED,
    customer: { $exists: true },
    createdAt: { $gte: start.toDate(), $lte: end.toDate() }
  }).lean()
  const currentCustomers = new Set(currentOrders.map((order) => order.customer.toString()))

  // get loyal customers set (intersection of customers between 2 periods)
  const loyal = set.intersection(previousCustomers, currentCustomers)

  // calculate retention rate = # returning customers / # total customers previous period
  let retention
  if (previousCustomers.size > 0) {
    retention = loyal.size / previousCustomers.size
  } else {
    retention = 0.0
  }

  // get customers that churned on current period (previous period - returning customers)
  const churn = set.difference(previousCustomers, loyal)

  let previousRetention = null
  if (calculateDiff) {
    previousRetention = await retentionStats(company, previousStart, previousEnd)
  }

  return {
    previousCount: previousCustomers.size,
    currentCount: currentCustomers.size,
    previous: { beginAt: previousStart, endAt: previousEnd },
    current: { beginAt: start, endAt: end },
    retentionRate: retention,
    churnRate: retention > 0 ? 1 - retention : 0.0,
    percentageDiff: previousRetention ? retention - previousRetention.retentionRate : undefined,
    loyalCustomers: Array.from(loyal),
    churnedCustomers: Array.from(churn)
  }
}

export const salesReport = async (
  company,
  startDate,
  endDate,
  groupBy,
  groupByLabel,
  utcOffset
) => {
  if (groupBy === 'day') {
    groupByLabel = 'Dia'
  } else if (groupBy === 'week') {
    groupByLabel = 'Semana'
  } else if (groupBy === 'month') {
    groupByLabel = 'Mês'
  } else {
    groupByLabel = 'Mês'
  }

  const totals = await FinancialStatement.getTotals(
    'createdAt',
    startDate,
    endDate,
    company,
    groupBy,
    utcOffset
  )

  if (totals.totalPaymentMethods.length === 0) {
    return {
      title: 'Vendas da semana',
      subtitle: 'Por tipo de pagamento',
      header: ['Year', 'Sales', 'Expenses', 'Profit'],
      data: []
    }
  }

  const index = {}

  for (const record of totals.totalPaymentMethods) {
    const date = record._id.date
    const method = record._id.method

    if (!(date in index)) {
      index[date] = {
        [Payments.CREDIT]: 0,
        [Payments.DEBT]: 0,
        [Payments.CASH]: 0,
        [Payments.VOUCHER]: 0,
        [Payments.PIX]: 0
      }
    }

    index[date][method] += record.total
  }

  const data = Object.keys(index).map((key) => {
    return { label: key, values: Object.values(index[key]) }
  })

  return {
    title: 'Vendas da semana',
    subtitle: 'Por tipo de pagamento',
    header: [groupByLabel, 'Credito', 'Debito', 'Dinheiro', 'Voucher', 'PIX'],
    data: data
  }
}

export const cashFlowReport = async (
  company,
  startDate,
  endDate,
  groupBy,
  groupByLabel,
  utcOffset
) => {
  const index = {}

  if (groupBy === 'day') {
    groupByLabel = 'Dia'
  } else if (groupBy === 'week') {
    groupByLabel = 'Semana'
  } else if (groupBy === 'month') {
    groupByLabel = 'Mês'
  } else {
    groupByLabel = 'Mês'
  }

  /* SALES */

  const totals = await FinancialStatement.getTotals(
    'dueAt',
    startDate,
    endDate,
    company,
    groupBy,
    utcOffset
  )

  totals.totalIncomes = totals.totalIncomes.map((item) => ({
    ...item,
    operation: FinancialOperations.INCOME
  }))

  totals.totalExpenses = totals.totalExpenses.map((item) => ({
    ...item,
    operation: FinancialOperations.EXPENSE
  }))

  const cashFlowData = [...totals.totalIncomes, ...totals.totalExpenses]
  cashFlowData.sort((a, b) => {
    if (groupBy === 'day') {
      const dateA = moment(a._id.date, 'DD/MM/YYYY')
      const dateB = moment(b._id.date, 'DD/MM/YYYY')

      if (dateA.isBefore(dateB)) {
        return -1
      }
      if (dateA.isAfter(dateB)) {
        return 1
      }
      return 0
    } else {
      if (a._id.date < b._id.date) {
        return -1
      }
      if (a._id.date > b._id.date) {
        return 1
      }
      return 0
    }
  })

  for (const record of cashFlowData) {
    const date = record._id.date
    const operation = record.operation

    if (!(date in index)) {
      index[date] = {
        [FinancialOperations.EXPENSE]: 0,
        [FinancialOperations.INCOME]: 0,
        profit: 0
      }
    }

    index[date][operation] +=
      operation === FinancialOperations.EXPENSE ? Math.abs(record.total) : record.total
  }

  /* PROFIT */

  for (const month in index) {
    index[month].profit =
      index[month][FinancialOperations.INCOME] - index[month][FinancialOperations.EXPENSE]
  }

  const data = Object.keys(index).map((key) => {
    return { label: key, values: Object.values(index[key]) }
  })

  return {
    title: 'Previsão de fluxo de caixa',
    subtitle: 'Lançamentos futuros de despesas e receitas',
    header: [groupByLabel, 'Despesas', 'Receitas', 'Lucro'],
    data: data
  }
}

const paymentMethodsStatsToObject = (paymentMethods) => {
  const map = {
    [Payments.CREDIT]: 0.0,
    [Payments.DEBT]: 0.0,
    [Payments.CASH]: 0.0,
    [Payments.VOUCHER]: 0.0,
    [Payments.PIX]: 0.0
  }

  for (const pm of paymentMethods) {
    map[pm._id.method] = pm.total
  }

  return map
}

export const salesStats = async (
  company,
  startDate,
  endDate,
  groupBy,
  utcOffset,
  calculateDiff = false
) => {
  const start = moment(startDate).startOf('day')
  const end = moment(endDate).endOf('day')

  const interval = end.diff(start, 'days')

  const previousStart = moment(start)
    .subtract(interval, 'days')
    .startOf('day')
  const previousEnd = moment(start)
    .subtract(1, 'days')
    .endOf('day')

  const totals = await FinancialStatement.getTotals(
    'createdAt',
    startDate,
    endDate,
    company,
    groupBy,
    utcOffset
  )

  const orders = await Order.find({
    company: company._id,
    status: OrderStatus.CLOSED,
    createdAt: { $gte: start, $lte: end }
  }).lean()

  const data = {
    total: 0,
    totalRevenue: totals.total,
    subtotalRevenue: 0.0,
    averageTicket: 0.0,
    topSellingProducts: [],
    totalFees: [],
    paymentMethods: paymentMethodsStatsToObject(totals.totalPaymentMethods)
  }

  const topSellingMap = {}

  // calculate totals
  for (const order of orders) {
    data.subtotalRevenue += order.subtotal
  }

  // calculate top selling
  for (const order of orders) {
    for (const item of order.items) {
      if (!item.product) continue

      const index = item.product.toString()

      if (!(item.product.toString() in topSellingMap)) {
        topSellingMap[index] = {
          name: item.name,
          total: 0,
          revenue: 0.0,
          subtotalRevenuePercentage: 0.0
        }
      }

      const stats = topSellingMap[index]

      stats.total += item.quantity
      stats.revenue += item.subtotal || item.quantity * item.price
      stats.subtotalRevenuePercentage = stats.revenue / data.subtotalRevenue
    }
  }

  for (const index in topSellingMap) {
    data.topSellingProducts.push({ product: index, ...topSellingMap[index] })
    data.topSellingProducts.sort((a, b) => {
      if (a.subtotalRevenuePercentage < b.subtotalRevenuePercentage) {
        return 1
      }
      if (a.subtotalRevenuePercentage > b.subtotalRevenuePercentage) {
        return -1
      }
      return 0
    })
  }

  const totalFeesMap = orders
    .map((order) => order.fees)
    .flat()
    .reduce((feesMap, fee) => {
      if (fee.fee in feesMap) {
        feesMap[fee.fee].total += fee.value
      } else {
        feesMap[fee.fee] = { name: fee.name, total: fee.value }
      }
      return feesMap
    }, {})

  data.totalFees = Object.values(totalFeesMap)

  data.total = orders.length
  data.averageTicket = data.total === 0 ? 0 : data.totalRevenue / data.total

  if (calculateDiff) {
    const { data: previousData } = await salesStats(
      company,
      previousStart,
      previousEnd,
      groupBy,
      utcOffset
    )

    // calculate percetage diff from previous period
    data.totalPercentageDiff =
      previousData.total === 0 ? 1 : (data.total - previousData.total) / previousData.total

    data.totalRevenuePercentageDiff =
      previousData.totalRevenue === 0
        ? 1
        : (data.totalRevenue - previousData.totalRevenue) / previousData.totalRevenue

    data.subtotalRevenuePercentageDiff =
      previousData.subtotalRevenue === 0
        ? 1
        : (data.subtotalRevenue - previousData.subtotalRevenue) / previousData.subtotalRevenue

    data.averageTicketPercentageDiff =
      previousData.averageTicket === 0
        ? 1
        : (data.averageTicket - previousData.averageTicket) / previousData.averageTicket
  }

  return { data, topSellingMap }
}

export default { getActiveUsers, getUserStats }
