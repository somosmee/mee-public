import groupBy from 'lodash.groupby'
import moment from 'moment'

export const pad = (n, width) => {
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n
}

export const groupByWeekday = (orders, utcOffset) => {
  const week = moment(orders[0].createdAt)
    .utcOffset(utcOffset)
    .week()

  orders = orders.map((order) => {
    return {
      total: order.items.reduce((total, item) => total + item.price * item.quantity, 0),
      week: week,
      weekday: moment(order.createdAt)
        .utcOffset(utcOffset)
        .weekday()
    }
  })

  const ordersByWeekday = groupBy(orders, 'weekday')

  let ordersGrouped = Object.keys(ordersByWeekday).map((key) => {
    const items = ordersByWeekday[key]
    return {
      total: items.reduce((total, item) => total + item.total, 0),
      week,
      weekday: items[0].weekday,
      ordersCount: items.length
    }
  })

  // Insert missing weekdays
  for (let weekday = 0; weekday < 7; weekday++) {
    const found = ordersGrouped.find((order) => order.weekday === weekday)
    if (!found) {
      ordersGrouped.push({ total: 0, week, weekday, ordersCount: 0 })
    }
  }

  ordersGrouped = ordersGrouped.sort((a, b) => a.weekday - b.weekday)

  return ordersGrouped
}

export const createQueryFilter = (filter, initialValues) => {
  const conditions = initialValues || {}

  if (filter) {
    if (filter.status?.length > 0) {
      conditions.status = { $in: filter.status }
    }

    if (filter.payments?.length > 0) {
      conditions['payments.method'] = { $in: filter.payments }
    }

    if (filter.origin?.length > 0) {
      conditions.origin = { $in: filter.origin }
    }

    if (filter.start || filter.end) {
      conditions.createdAt = {}

      if (filter.start) conditions.createdAt.$gte = filter.start
      if (filter.end) conditions.createdAt.$lte = filter.end
    }
  }

  return conditions
}
