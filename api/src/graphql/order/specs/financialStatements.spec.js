import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'
import moment from 'moment'

import mongoose from 'src/mongoose'

import { apolloServer } from 'src/apolloServer'

import { Company, FinancialStatement, User, Order, Product, UserProduct } from 'src/models'

import { UPDATE_MY_COMPANY } from 'src/graphql/order/specs/gql'

import {
  PRODUCT_1,
  PRODUCT_2,
  PRODUCT_3,
  USER_PRODUCT_1,
  USER_PRODUCT_2,
  USER_PRODUCT_3
} from 'src/test/common/payloads/products'
import { userGenerator, createOrder } from 'src/test/utils/generators'
import {
  createOrderMutation,
  addPaymentMutation,
  cancelPaymentMutation
} from 'src/test/utils/mutations'

import {
  OrderStatus,
  IncomeCategories,
  DefaultPaymentMethods,
  OperationTypes,
  Payments
} from 'src/utils/enums'
import { generateToken } from 'src/utils/token'

const { ObjectId } = mongoose.Types

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
  await FinancialStatement.deleteMany({})
  await User.deleteMany({})
  await UserProduct.deleteMany({})
  await Product.deleteMany({})
  await Order.deleteMany({})

  await setUserAndCompany()
  await new Product(PRODUCT_1).save()
  await new Product(PRODUCT_2).save()
  await new Product(PRODUCT_3).save()
  await new UserProduct({ ...USER_PRODUCT_1, company: company._id, createdBy: user._id }).save()
  await new UserProduct({ ...USER_PRODUCT_2, company: company._id, createdBy: user._id }).save()
  await new UserProduct({ ...USER_PRODUCT_3, company: company._id, createdBy: user._id }).save()

  headers = { Authorization: generateToken({ userId: user._id, companyId: company._id }) }
})

test.afterEach(async (t) => {
  await Company.deleteMany({})
  await FinancialStatement.deleteMany({})
  await User.deleteMany({})
  await UserProduct.deleteMany({})
  await Product.deleteMany({})
  await Order.deleteMany({})
})

// financial statement
test('should add income statement when order is closed', async (t) => {
  await UserProduct.updateMany({}, { $set: { company: company._id } })

  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  // create order
  const { response } = await createOrderMutation(mutate)

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.is(response.data.createOrder.totalPaid, 0)

  // add full payment to close order
  const {
    data: { createOrder }
  } = response

  const { response: responseAddPayment } = await addPaymentMutation(
    mutate,
    createOrder._id,
    createOrder.total
  )

  t.is(responseAddPayment.errors, undefined)
  t.not(responseAddPayment.data, null)

  // check if order is closed
  const order = await Order.findOne({ _id: createOrder._id })

  t.is(order.status, OrderStatus.CLOSED)
  t.is(order.total, createOrder.total)
  t.is(order.subtotal, createOrder.subtotal)
  t.is(order.totalPaid, createOrder.total)

  // check income financial statement
  const statements = await FinancialStatement.find({ company: company._id })

  t.is(statements.length, 1)

  const [firstIncome] = statements

  t.is(moment(firstIncome.dueAt).format('DD/MM/YYYY'), moment().format('DD/MM/YYYY'))
  t.is(firstIncome.paid, true)
  t.is(firstIncome.order.toString(), order._id.toString())
  t.is(firstIncome.category.toString(), IncomeCategories.SALE.toString())
  t.is(firstIncome.description, `venda do pedido #${createOrder.shortID}`)
  t.is(firstIncome.value, order.totalPaid)
})

test('should remove income statement if closed order is canceled', async (t) => {
  await UserProduct.updateMany({}, { $set: { company: company._id } })

  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  // create order
  const { response } = await createOrderMutation(mutate)

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.is(response.data.createOrder.totalPaid, 0)

  // add full payment to close order
  const {
    data: { createOrder }
  } = response

  const { response: responseAddPayment } = await addPaymentMutation(
    mutate,
    createOrder._id,
    createOrder.total
  )

  t.is(responseAddPayment.errors, undefined)
  t.not(responseAddPayment.data, null)

  // check if order is closed
  const order = await Order.findOne({ _id: createOrder._id })

  t.is(order.status, OrderStatus.CLOSED)
  t.is(order.total, createOrder.total)
  t.is(order.subtotal, createOrder.subtotal)
  t.is(order.totalPaid, createOrder.total)

  // check income financial statement
  const statements = await FinancialStatement.find({ company: company._id })

  t.is(statements.length, 1)

  const [firstIncome] = statements

  t.is(moment(firstIncome.dueAt).format('DD/MM/YYYY'), moment().format('DD/MM/YYYY'))
  t.is(firstIncome.paid, true)
  t.is(firstIncome.order.toString(), order._id.toString())
  t.is(firstIncome.category.toString(), IncomeCategories.SALE.toString())
  t.is(firstIncome.description, `venda do pedido #${createOrder.shortID}`)
  t.is(firstIncome.value, order.totalPaid)

  // cancel order
  await cancelPaymentMutation(mutate, order._id.toString())

  // check if financial statement was deleted
  const statementsDeleted = await FinancialStatement.find({ company: company._id })

  t.is(statementsDeleted.length, 0)
})

test('should add income statement for the futture if order payment is with credit card', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = {
    input: {
      paymentMethods: [
        ...DefaultPaymentMethods.map(({ _id, ...data }) => ({ id: _id.toString(), ...data })),
        {
          name: 'Crédito',
          fee: 3.49,
          operationType: OperationTypes.PERCENTAGE,
          method: Payments.CREDIT,
          balanceInterval: 30
        }
      ]
    }
  }

  // create new payment method
  const {
    data: {
      updateMyCompany: { paymentMethods }
    }
  } = await mutate(UPDATE_MY_COMPANY, { variables })

  // create order and associate with the payment method
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
      payments: [
        {
          method: 'credit',
          value: 100.0,
          received: 100.0,
          paymentMethod: new ObjectId(paymentMethods[paymentMethods.length - 1].id)
        }
      ],
      createdAt: new Date()
    },
    company
  )

  // check if financial statement was set in the future according with the balanceInterval
  const financialStatements = await FinancialStatement.find({})

  t.is(financialStatements.length, 1)
  t.is(
    moment(financialStatements[0].dueAt).format('DD/MM'),
    moment()
      .add(30, 'days')
      .format('DD/MM')
  )
})

test.todo('should add income statement when shopfront delivery order is closed')
test.todo('should add income statement when shopfront takeout order is closed')
test.todo('should add income statement when shopfront inplace order is closed')
// ifood test is on ifood.validation.spec.js
test.todo('should add expense statement when manual purchase is added')
test.todo('should add expense statement when scrapped (auto) purchase is added')
