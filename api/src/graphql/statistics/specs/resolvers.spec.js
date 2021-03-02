import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'
import moment from 'moment'

import { apolloServer } from 'src/apolloServer'

import {
  Company,
  User,
  Customer,
  Order,
  Product,
  UserProduct,
  FinancialStatement
} from 'src/models'

import { RETENTION_REPORT, SALES_STATS_REPORT, REPORTS } from 'src/graphql/statistics/specs/gql.js'

import {
  PRODUCT_1,
  PRODUCT_2,
  PRODUCT_3,
  PRODUCT_4,
  USER_PRODUCT_1,
  USER_PRODUCT_2,
  USER_PRODUCT_3,
  USER_PRODUCT_4
} from 'src/test/common/payloads/products'
import { userGenerator, createOrder } from 'src/test/utils/generators'

import { OrderStatus } from 'src/utils/enums'
import { generateToken } from 'src/utils/token'

let headers = null
let user = null
let company = null

const setUserAndCompany = async () => {
  const { user: newUser, company: newCompany } = await userGenerator()
  user = newUser
  company = newCompany
}

test.beforeEach(async (t) => {
  await Company.deleteMany({})
  await User.deleteMany({})
  await Order.deleteMany({})
  await Product.deleteMany({})
  await UserProduct.deleteMany({})
  await FinancialStatement.deleteMany({})

  await setUserAndCompany()

  await new Product(PRODUCT_1).save()
  await new Product(PRODUCT_2).save()
  await new Product(PRODUCT_3).save()
  await new UserProduct({ ...USER_PRODUCT_1, company: company._id, createdBy: user._id }).save()
  await new UserProduct({ ...USER_PRODUCT_2, company: company._id, createdBy: user._id }).save()
  await new UserProduct({ ...USER_PRODUCT_3, company: company._id, createdBy: user._id }).save()

  headers = { Authorization: generateToken({ userId: user._id, companyId: company._id }) }
})

test.afterEach.always(async (t) => {
  await Product.deleteMany({})
  await UserProduct.deleteMany({})
  await Company.deleteMany({})
  await User.deleteMany({})
  await Order.deleteMany({})
  await FinancialStatement.deleteMany({})
})

test('should calculate correct retention report', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const startDate = moment().subtract(7, 'days')
  const endDate = moment()
  const previousDate = moment(startDate).subtract(1, 'days')

  const variables = {
    input: {
      startDate,
      endDate
    }
  }

  // create 3 customers
  const c1 = await new Customer({ company: company._id, mobile: '11111111111' }).save()
  const c2 = await new Customer({ company: company._id, mobile: '11121111111' }).save()
  const c3 = await new Customer({ company: company._id, mobile: '11131111111' }).save()

  // create orders from previous week
  await createOrder(
    {
      status: OrderStatus.CLOSED,
      company: company._id,
      items: [],
      customer: c1._id,
      createdAt: previousDate.toDate()
    },
    company
  )

  await createOrder(
    {
      status: OrderStatus.CLOSED,
      company: company._id,
      items: [],
      customer: c2._id,
      createdAt: previousDate.toDate()
    },
    company
  )

  await createOrder(
    {
      status: OrderStatus.CLOSED,
      company: company._id,
      items: [],
      customer: c3._id,
      createdAt: previousDate.toDate()
    },
    company
  )

  // create orders from current week
  await createOrder(
    {
      status: OrderStatus.CLOSED,
      company: company._id,
      items: [],
      customer: c2._id,
      createdAt: endDate.toDate()
    },
    company
  )

  await createOrder(
    {
      status: OrderStatus.CLOSED,
      company: company._id,
      items: [],
      customer: c3._id,
      createdAt: endDate.toDate()
    },
    company
  )

  const response = await mutate(RETENTION_REPORT, { variables })

  t.is(response.errors, undefined)

  const {
    data: {
      reports: {
        retentionReport: {
          previousCount,
          currentCount,
          retentionRate,
          churnRate,
          percentageDiff,
          churnedCustomers
        }
      }
    }
  } = response

  t.is(previousCount, 3)
  t.is(currentCount, 2)
  t.is(retentionRate.toFixed(2), '0.67')
  t.is(churnRate.toFixed(2), '0.33')
  t.is(percentageDiff.toFixed(2), '0.67')
  t.is(churnedCustomers[0]._id, c1._id.toString())
})

test('should calculate correct sales statistics report', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const startDate = moment()
    .subtract(7, 'days')
    .startOf('day')
    .utc()
  const endDate = moment()
    .endOf('day')
    .utc()
  const intervalDate = moment(startDate).add(1, 'days')

  await createOrder(
    {
      company: company._id,
      status: OrderStatus.CLOSED,
      shortID: '1111',
      items: [
        {
          name: 'Produto 1',
          product: PRODUCT_1._id,
          price: USER_PRODUCT_1.price,
          measurement: 'unit',
          quantity: 12,
          discount: 0.0
        },
        {
          name: 'Produto 2',
          product: PRODUCT_2._id,
          price: USER_PRODUCT_2.price,
          measurement: 'unit',
          quantity: 10,
          discount: 0.0
        }
      ],
      payments: [
        {
          method: 'cash',
          value: USER_PRODUCT_1.price * 12 + USER_PRODUCT_2.price * 10,
          received: USER_PRODUCT_1.price * 12 + USER_PRODUCT_2.price * 10
        }
      ],
      createdAt: intervalDate.toDate()
    },
    company
  )

  await createOrder(
    {
      company: company._id,
      status: OrderStatus.CLOSED,
      shortID: '2222',
      items: [
        {
          name: 'Produto 1',
          product: PRODUCT_1._id,
          price: USER_PRODUCT_1.price,
          measurement: 'unit',
          quantity: 12,
          discount: 0.0
        },
        {
          name: 'Produto 3',
          product: PRODUCT_3._id,
          price: USER_PRODUCT_3.price,
          measurement: 'unit',
          quantity: 10,
          discount: 0.0
        },
        {
          name: 'Produto 4',
          product: PRODUCT_4._id,
          price: USER_PRODUCT_4.price,
          measurement: 'unit',
          quantity: 10,
          discount: 0.0
        }
      ],
      payments: [
        {
          method: 'cash',
          value: USER_PRODUCT_1.price * 12 + USER_PRODUCT_3.price * 10 + USER_PRODUCT_4.price * 10,
          received:
            USER_PRODUCT_1.price * 12 + USER_PRODUCT_3.price * 10 + USER_PRODUCT_4.price * 10
        }
      ],
      createdAt: intervalDate.toDate()
    },
    company
  )

  const variables = {
    input: {
      startDate,
      endDate
    }
  }

  const response = await mutate(SALES_STATS_REPORT, { variables })

  t.is(response.errors, undefined)

  const {
    data: {
      reports: {
        salesStatisticsReport: {
          total,
          totalRevenue,
          subtotalRevenue,
          averageTicket,
          topSellingProducts
        }
      }
    }
  } = response

  t.is(total, 2)
  t.is(totalRevenue, 1709.9)
  t.is(subtotalRevenue, 1709.9)
  t.is(averageTicket, 854.95)
  t.is(topSellingProducts.length, 4)
})

test.skip('should give correct reports for different timezones', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const startDate = moment().startOf('day')
  const endDate = moment().endOf('day')

  await createOrder(
    {
      company: company._id,
      status: OrderStatus.CLOSED,
      shortID: '3333',
      items: [
        {
          name: 'Produto 1',
          product: PRODUCT_1._id,
          price: 10.0,
          measurement: 'unit',
          quantity: 10,
          discount: 0.0
        }
      ],
      payments: [{ method: 'cash', value: 100.0, received: 100.0 }],
      createdAt: startDate
    },
    company
  )

  await createOrder(
    {
      company: company._id,
      status: OrderStatus.CLOSED,
      shortID: '3232',
      items: [
        {
          name: 'Produto 1',
          product: PRODUCT_1._id,
          price: 10.0,
          measurement: 'unit',
          quantity: 10,
          discount: 0.0
        }
      ],
      payments: [{ method: 'cash', value: 100.0, received: 100.0 }],
      createdAt: endDate
    },
    company
  )

  // change dates
  await FinancialStatement.updateMany({ $set: { dueAt: endDate } })

  const variables = {
    input: {
      startDate,
      endDate,
      groupBy: 'day'
    }
  }

  const response = await mutate(REPORTS, { variables })

  t.is(response.errors, undefined)

  t.is(false, true)
})
