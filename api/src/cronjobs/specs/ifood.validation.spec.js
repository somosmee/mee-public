import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'
import moment from 'moment'

import { apolloServer } from 'src/apolloServer'

import { getIfoodTokens, syncEvents } from 'src/cronjobs/jobs'
import {
  eventsSimpleOrder,
  simpleCashOrder,
  eventOnlinePayment,
  onlinePaymentOrder,
  ifoodAuthResponse,
  ifoodOrderWithSubitems,
  eventMaskedContactPhone,
  maskedContactPhoneOrder,
  eventObservation,
  observationOrder,
  eventSubitems,
  subitemsOrder,
  eventVoucher,
  onlinePaymentWithVoucherOrder,
  eventIfoodVoucher,
  ifoodVoucherOrder,
  eventRestVoucher,
  restVoucherOrder,
  eventEntregaVoucher,
  entregaVoucherOrder,
  ifoodEventPlaced,
  ifoodEventConcluded,
  ifoodOrderTest
} from 'src/cronjobs/specs/payload'
import { createFakeUsers, confirmOrder, dispatchOrder } from 'src/cronjobs/specs/utils'

import { Company, User, Order, IfoodOrder, FinancialStatement } from 'src/models'

import { ifood } from 'src/test/common/mocks'

import { Payments, OrderStatus, IfoodOrderStatus, IncomeCategories } from 'src/utils/enums'
import { generateToken } from 'src/utils/token'

let headers = null

test.before(async (t) => {
  await Company.deleteMany({})
  await User.deleteMany({})
  await Order.deleteMany({})
  await IfoodOrder.deleteMany({})
})

test.afterEach(async (t) => {
  await Company.deleteMany({})
  await User.deleteMany({})
  await Order.deleteMany({})
  await IfoodOrder.deleteMany({})
})

/*
  In this integration test Confirmation and Dispatch endpoints should be called
 */
test('Should be able to create a simple order with cash asking for change', async (t) => {
  const stub = ifood.stubGet()
  stub.onCall(0).resolves(eventsSimpleOrder)
  stub.onCall(1).resolves(simpleCashOrder)

  const stub2 = ifood.stubPost()
  stub2.onCall(0).resolves(ifoodAuthResponse)
  stub2.onCall(1).resolves({ statusCode: 200 })
  stub2.onCall(2).resolves({ statusCode: 200 })
  stub2.onCall(3).resolves({ statusCode: 200 })
  stub2.onCall(4).resolves({ statusCode: 200 })

  const { userOpen, companyOpen, companyClosed } = await createFakeUsers()
  await getIfoodTokens()

  await syncEvents()

  const ordersOpen = await Order.find({ company: companyOpen._id })
  const [order] = ordersOpen

  headers = { Authorization: generateToken({ userId: userOpen._id, companyId: companyOpen._id }) }
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })
  await confirmOrder(mutate, order._id)
  await dispatchOrder(mutate, order._id)

  // validate endpoint calls
  t.is(
    stub.withArgs('/v1.0/events:polling', {
      headers: {
        Authorization: `${ifoodAuthResponse.data.token_type} ${ifoodAuthResponse.data.access_token}`
      }
    }).calledOnce,
    true
  )

  t.is(
    stub.withArgs(`/v3.0/orders/${simpleCashOrder.data.reference}`, {
      headers: {
        Authorization: `${ifoodAuthResponse.data.token_type} ${ifoodAuthResponse.data.access_token}`
      }
    }).calledOnce,
    true
  )

  // spyPost
  t.is(stub2.withArgs('/oauth/token').calledOnce, true)
  t.is(stub2.withArgs('/v1.0/events/acknowledgment').calledOnce, true)
  t.is(
    stub2.withArgs(`/v1.0/orders/${simpleCashOrder.data.reference}/statuses/integration`)
      .calledOnce,
    true
  )
  t.is(
    stub2.withArgs(`/v1.0/orders/${simpleCashOrder.data.reference}/statuses/confirmation`)
      .calledOnce,
    true
  )
  t.is(
    stub2.withArgs(`/v1.0/orders/${simpleCashOrder.data.reference}/statuses/dispatch`).calledOnce,
    true
  )

  const ifoodOrders = await IfoodOrder.find({})
  t.is(ifoodOrders.length, 1)

  const [iOrder] = ifoodOrders
  t.is(iOrder.reference, simpleCashOrder.data.reference)

  // check mapping to open user
  t.is(ordersOpen.length, 1)

  t.is(order.ifood.reference, simpleCashOrder.data.reference)
  t.is(order.shortID, simpleCashOrder.data.shortReference)
  t.is(order.payments[0].method, Payments.CASH)
  t.is(order.delivery.fee, simpleCashOrder.data.deliveryFee)
  t.is(order.subtotal, simpleCashOrder.data.subTotal)

  const ordersClosed = await Order.find({ company: companyClosed._id })
  t.is(ordersClosed.length, 0)

  stub.restore()
  stub2.restore()
})

test('Should be able to create an order with online payment method', async (t) => {
  const stub = ifood.stubGet()
  stub.onCall(0).resolves(eventOnlinePayment)
  stub.onCall(1).resolves(onlinePaymentOrder)

  const stub2 = ifood.stubPost()
  stub2.onCall(0).resolves(ifoodAuthResponse)
  stub2.onCall(1).resolves({ statusCode: 200 })
  stub2.onCall(2).resolves({ statusCode: 200 })
  stub2.onCall(3).resolves({ statusCode: 200 })
  stub2.onCall(4).resolves({ statusCode: 200 })

  const { userOpen, companyOpen, companyClosed } = await createFakeUsers()
  await getIfoodTokens()

  await syncEvents()

  const ordersOpen = await Order.find({ company: companyOpen._id })
  const [order] = ordersOpen

  headers = { Authorization: generateToken({ userId: userOpen._id, companyId: companyOpen._id }) }
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })
  await confirmOrder(mutate, order._id)
  await dispatchOrder(mutate, order._id)

  // validate endpoint calls
  t.is(
    stub.withArgs('/v1.0/events:polling', {
      headers: {
        Authorization: `${ifoodAuthResponse.data.token_type} ${ifoodAuthResponse.data.access_token}`
      }
    }).calledOnce,
    true
  )

  t.is(
    stub.withArgs(`/v3.0/orders/${onlinePaymentOrder.data.reference}`, {
      headers: {
        Authorization: `${ifoodAuthResponse.data.token_type} ${ifoodAuthResponse.data.access_token}`
      }
    }).calledOnce,
    true
  )

  // spyPost
  t.is(stub2.withArgs('/oauth/token').calledOnce, true)
  t.is(stub2.withArgs('/v1.0/events/acknowledgment').calledOnce, true)
  t.is(
    stub2.withArgs(`/v1.0/orders/${onlinePaymentOrder.data.reference}/statuses/integration`)
      .calledOnce,
    true
  )
  t.is(
    stub2.withArgs(`/v1.0/orders/${onlinePaymentOrder.data.reference}/statuses/confirmation`)
      .calledOnce,
    true
  )
  t.is(
    stub2.withArgs(`/v1.0/orders/${onlinePaymentOrder.data.reference}/statuses/dispatch`)
      .calledOnce,
    true
  )

  const ifoodOrders = await IfoodOrder.find({})
  t.is(ifoodOrders.length, 1)

  const [iOrder] = ifoodOrders
  t.is(iOrder.reference, onlinePaymentOrder.data.reference)

  // check mapping to open user
  t.is(ordersOpen.length, 1)

  t.is(order.ifood.reference, onlinePaymentOrder.data.reference)
  t.is(order.payments[0].method, Payments.CREDIT)
  t.is(order.delivery.fee, onlinePaymentOrder.data.deliveryFee)
  t.is(order.subtotal, onlinePaymentOrder.data.subTotal)

  const ordersClosed = await Order.find({ company: companyClosed._id })
  t.is(ordersClosed.length, 0)

  stub.restore()
  stub2.restore()
})

test('Should generate masked number to call customer', async (t) => {
  const stub = ifood.stubGet()
  stub.onCall(0).resolves(eventMaskedContactPhone)
  stub.onCall(1).resolves(maskedContactPhoneOrder)

  const stub2 = ifood.stubPost()
  stub2.onCall(0).resolves(ifoodAuthResponse)
  stub2.onCall(1).resolves({ statusCode: 200 })
  stub2.onCall(2).resolves({ statusCode: 200 })
  stub2.onCall(3).resolves({ statusCode: 200 })
  stub2.onCall(4).resolves({ statusCode: 200 })

  const { companyOpen, companyClosed } = await createFakeUsers()
  await getIfoodTokens()

  await syncEvents()

  // IFOOD ORDERS
  const ifoodOrders = await IfoodOrder.find({})
  t.is(ifoodOrders.length, 1)

  const [iOrder] = ifoodOrders
  t.is(iOrder.reference, maskedContactPhoneOrder.data.reference)

  // ORDERS
  const ordersOpen = await Order.find({ company: companyOpen._id })
  const [order] = ordersOpen

  // check mapping to open user
  t.is(ordersOpen.length, 1)

  t.is(order.ifood.reference, maskedContactPhoneOrder.data.reference)
  t.is(!!order.ifood.customer, true)
  t.is(order.ifood.customer.phone, maskedContactPhoneOrder.data.customer.phone)
  t.is(order.payments[0].method, Payments.VOUCHER)
  t.is(order.delivery.fee, maskedContactPhoneOrder.data.deliveryFee)
  t.is(order.subtotal, maskedContactPhoneOrder.data.subTotal)

  const ordersClosed = await Order.find({ company: companyClosed._id })
  t.is(ordersClosed.length, 0)

  stub.restore()
  stub2.restore()
})

test('Should map item order note', async (t) => {
  const stub = ifood.stubGet()
  stub.onCall(0).resolves(eventObservation)
  stub.onCall(1).resolves(observationOrder)

  const stub2 = ifood.stubPost()
  stub2.onCall(0).resolves(ifoodAuthResponse)
  stub2.onCall(1).resolves({ statusCode: 200 })
  stub2.onCall(2).resolves({ statusCode: 200 })
  stub2.onCall(3).resolves({ statusCode: 200 })
  stub2.onCall(4).resolves({ statusCode: 200 })

  const { userOpen, companyOpen, companyClosed } = await createFakeUsers()
  await getIfoodTokens()

  await syncEvents()

  // IFOOD ORDERS
  const ifoodOrders = await IfoodOrder.find({})
  t.is(ifoodOrders.length, 1)

  const [iOrder] = ifoodOrders
  t.is(iOrder.reference, observationOrder.data.reference)

  // ORDERS
  const ordersOpen = await Order.find({ company: companyOpen._id })
  const [order] = ordersOpen

  // check mapping to open user
  t.is(ordersOpen.length, 1)

  t.is(order.ifood.reference, observationOrder.data.reference)
  t.is(order.payments[0].method, Payments.CREDIT)
  t.is(order.items[0].note, observationOrder.data.items[0].observations)
  t.is(order.delivery.fee, observationOrder.data.deliveryFee)
  t.is(order.subtotal, observationOrder.data.subTotal)

  const ordersClosed = await Order.find({ company: companyClosed._id })
  t.is(ordersClosed.length, 0)

  stub.restore()
  stub2.restore()
})

test('Should be able to create an order and split the payment between online and ifood voucher', async (t) => {
  const stub = ifood.stubGet()
  stub.onCall(0).resolves(eventVoucher)
  stub.onCall(1).resolves(onlinePaymentWithVoucherOrder)

  const stub2 = ifood.stubPost()
  stub2.onCall(0).resolves(ifoodAuthResponse)
  stub2.onCall(1).resolves({ statusCode: 200 })
  stub2.onCall(2).resolves({ statusCode: 200 })
  stub2.onCall(3).resolves({ statusCode: 200 })
  stub2.onCall(4).resolves({ statusCode: 200 })

  const { userOpen, companyOpen, companyClosed } = await createFakeUsers()
  await getIfoodTokens()

  await syncEvents()

  // IFOOD ORDERS
  const ifoodOrders = await IfoodOrder.find({})
  t.is(ifoodOrders.length, 1)

  const [iOrder] = ifoodOrders
  t.is(iOrder.reference, onlinePaymentWithVoucherOrder.data.reference)

  // ORDERS
  const ordersOpen = await Order.find({ company: companyOpen._id })
  const [order] = ordersOpen

  // check mapping to open user
  t.is(ordersOpen.length, 1)

  t.is(order.ifood.reference, onlinePaymentWithVoucherOrder.data.reference)
  t.is(order.payments[0].method, Payments.VOUCHER)
  t.is(order.payments[1].method, Payments.CREDIT)

  const ordersClosed = await Order.find({ company: companyClosed._id })
  t.is(ordersClosed.length, 0)

  stub.restore()
  stub2.restore()
})

test('Should be able to create an order with several itens with modifiers and observations', async (t) => {
  const stub = ifood.stubGet()
  stub.onCall(0).resolves(eventSubitems)
  stub.onCall(1).resolves(subitemsOrder)

  const stub2 = ifood.stubPost()
  stub2.onCall(0).resolves(ifoodOrderWithSubitems)
  stub2.onCall(1).resolves({ statusCode: 200 })
  stub2.onCall(2).resolves({ statusCode: 200 })
  stub2.onCall(3).resolves({ statusCode: 200 })
  stub2.onCall(4).resolves({ statusCode: 200 })

  const { userOpen, companyOpen, companyClosed } = await createFakeUsers()
  await getIfoodTokens()

  await syncEvents()

  // IFOOD ORDERS
  const ifoodOrders = await IfoodOrder.find({})
  t.is(ifoodOrders.length, 1)

  const [iOrder] = ifoodOrders
  t.is(iOrder.reference, ifoodOrderWithSubitems.data.reference)

  // ORDERS
  const ordersOpen = await Order.find({ company: companyOpen._id })
  const [order] = ordersOpen

  // check mapping to open user
  t.is(ordersOpen.length, 1)

  t.is(order.ifood.reference, ifoodOrderWithSubitems.data.reference)
  t.is(order.payments[0].method, Payments.DEBT)
  t.is(order.items[0].modifiers[0].name, ifoodOrderWithSubitems.data.items[0].subItems[0].name)
  t.is(order.delivery.fee, ifoodOrderWithSubitems.data.deliveryFee)
  t.is(order.subtotal, ifoodOrderWithSubitems.data.subTotal)

  const ordersClosed = await Order.find({ company: companyClosed._id })
  t.is(ordersClosed.length, 0)

  stub.restore()
  stub2.restore()
})

/* VOUCHERS */
test('Should create order with VOUCHER_IFOOD and map benefit', async (t) => {
  const stub = ifood.stubGet()
  stub.onCall(0).resolves(eventIfoodVoucher)
  stub.onCall(1).resolves(ifoodVoucherOrder)

  const stub2 = ifood.stubPost()
  stub2.onCall(0).resolves(ifoodAuthResponse)
  stub2.onCall(1).resolves({ statusCode: 200 })
  stub2.onCall(2).resolves({ statusCode: 200 })
  stub2.onCall(3).resolves({ statusCode: 200 })
  stub2.onCall(4).resolves({ statusCode: 200 })

  const { userOpen, companyOpen, companyClosed } = await createFakeUsers()
  await getIfoodTokens()

  await syncEvents()

  // IFOOD ORDERS
  const ifoodOrders = await IfoodOrder.find({})
  t.is(ifoodOrders.length, 1)

  const [iOrder] = ifoodOrders
  t.is(iOrder.reference, ifoodVoucherOrder.data.reference)

  // ORDERS
  const ordersOpen = await Order.find({ company: companyOpen._id })
  const [order] = ordersOpen

  // check mapping to open user
  t.is(ordersOpen.length, 1)

  t.is(order.ifood.reference, ifoodVoucherOrder.data.reference)
  t.is(order.payments[0].method, Payments.CREDIT)
  t.is(order.items[0].note, ifoodVoucherOrder.data.items[0].observations)
  t.is(order.delivery.fee, ifoodVoucherOrder.data.deliveryFee)
  t.is(order.subtotal, ifoodVoucherOrder.data.subTotal)
  t.deepEqual(order.ifood.benefits[0], ifoodVoucherOrder.data.benefits[0])

  const ordersClosed = await Order.find({ company: companyClosed._id })
  t.is(ordersClosed.length, 0)

  stub.restore()
  stub2.restore()
})

test('Should create order with VOUCHER_REST and map benefit', async (t) => {
  const stub = ifood.stubGet()
  stub.onCall(0).resolves(eventRestVoucher)
  stub.onCall(1).resolves(restVoucherOrder)

  const stub2 = ifood.stubPost()
  stub2.onCall(0).resolves(ifoodAuthResponse)
  stub2.onCall(1).resolves({ statusCode: 200 })
  stub2.onCall(2).resolves({ statusCode: 200 })
  stub2.onCall(3).resolves({ statusCode: 200 })
  stub2.onCall(4).resolves({ statusCode: 200 })

  const { userOpen, companyOpen, companyClosed } = await createFakeUsers()
  await getIfoodTokens()

  await syncEvents()

  // IFOOD ORDERS
  const ifoodOrders = await IfoodOrder.find({})
  t.is(ifoodOrders.length, 1)

  const [iOrder] = ifoodOrders
  t.is(iOrder.reference, restVoucherOrder.data.reference)

  // ORDERS
  const ordersOpen = await Order.find({ company: companyOpen._id })
  const [order] = ordersOpen

  // check mapping to open user
  t.is(ordersOpen.length, 1)

  t.is(order.ifood.reference, restVoucherOrder.data.reference)
  t.is(order.payments[0].method, Payments.VOUCHER)
  t.is(order.items[0].note, restVoucherOrder.data.items[0].observations)
  t.is(order.delivery.fee, restVoucherOrder.data.deliveryFee)
  t.is(order.subtotal, restVoucherOrder.data.subTotal)
  t.deepEqual(order.ifood.benefits[0], restVoucherOrder.data.benefits[0])

  const ordersClosed = await Order.find({ company: companyClosed._id })
  t.is(ordersClosed.length, 0)

  stub.restore()
  stub2.restore()
})

test('Should create order with VOUCHER_ENTGRATIS and map benefit', async (t) => {
  const stub = ifood.stubGet()
  stub.onCall(0).resolves(eventEntregaVoucher)
  stub.onCall(1).resolves(entregaVoucherOrder)

  const stub2 = ifood.stubPost()
  stub2.onCall(0).resolves(ifoodAuthResponse)
  stub2.onCall(1).resolves({ statusCode: 200 })
  stub2.onCall(2).resolves({ statusCode: 200 })
  stub2.onCall(3).resolves({ statusCode: 200 })
  stub2.onCall(4).resolves({ statusCode: 200 })

  const { userOpen, companyOpen, companyClosed } = await createFakeUsers()
  await getIfoodTokens()

  await syncEvents()

  // IFOOD ORDERS
  const ifoodOrders = await IfoodOrder.find({})
  t.is(ifoodOrders.length, 1)

  const [iOrder] = ifoodOrders
  t.is(iOrder.reference, entregaVoucherOrder.data.reference)

  // ORDERS
  const ordersOpen = await Order.find({ company: companyOpen._id })
  const [order] = ordersOpen

  // check mapping to open user
  t.is(ordersOpen.length, 1)

  t.is(order.ifood.reference, entregaVoucherOrder.data.reference)
  t.is(order.payments[0].method, Payments.CREDIT)
  t.is(order.delivery.fee, entregaVoucherOrder.data.deliveryFee)
  t.is(order.subtotal, entregaVoucherOrder.data.subTotal)
  t.deepEqual(order.ifood.benefits[0], entregaVoucherOrder.data.benefits[0])

  const ordersClosed = await Order.find({ company: companyClosed._id })
  t.is(ordersClosed.length, 0)

  stub.restore()
  stub2.restore()
})

test('Should update ifood order and mee order status with upcoming events', async (t) => {
  const stub = ifood.stubGet()
  stub.onCall(0).resolves(ifoodEventPlaced)
  stub.onCall(1).resolves(ifoodOrderTest)
  stub.onCall(2).resolves(ifoodEventConcluded)

  const stub2 = ifood.stubPost()
  stub2.onCall(0).resolves(ifoodAuthResponse)
  stub2.onCall(1).resolves({ statusCode: 200 })
  stub2.onCall(2).resolves({ statusCode: 200 })
  stub2.onCall(3).resolves({ statusCode: 200 })
  stub2.onCall(4).resolves({ statusCode: 200 })

  // create user with open ifood store
  await createFakeUsers()

  // get token
  await getIfoodTokens()

  // get first event to crete ifood order
  await syncEvents()

  // get second event update orders status
  await syncEvents()

  const ifoodOrders = await IfoodOrder.find({})
  const orders = await Order.find({})

  t.is(ifoodOrders.length, 1)
  t.is(orders.length, 1)

  const [order] = orders
  const [ifoodOrder] = ifoodOrders
  t.is(order.status, OrderStatus.CLOSED)
  t.is(ifoodOrder.status, IfoodOrderStatus.CONCLUDED)

  stub.restore()
  stub2.restore()
})

test('Should not add billable item when order is closed with CONCLUDED event', async (t) => {
  const stub = ifood.stubGet()
  stub.onCall(0).resolves(ifoodEventPlaced)
  stub.onCall(1).resolves(ifoodOrderTest)
  stub.onCall(2).resolves(ifoodEventConcluded)

  const stub2 = ifood.stubPost()
  stub2.onCall(0).resolves(ifoodAuthResponse)
  stub2.onCall(1).resolves({ statusCode: 200 })
  stub2.onCall(2).resolves({ statusCode: 200 })
  stub2.onCall(3).resolves({ statusCode: 200 })
  stub2.onCall(4).resolves({ statusCode: 200 })

  // create user with open ifood store
  let { userOpen } = await createFakeUsers()

  // get token
  await getIfoodTokens()

  // get first event to crete ifood order
  await syncEvents()

  // get second event update orders status
  await syncEvents()

  const ifoodOrders = await IfoodOrder.find({})
  const orders = await Order.find({})

  t.is(ifoodOrders.length, 1)
  t.is(orders.length, 1)

  const [order] = orders
  const [ifoodOrder] = ifoodOrders
  t.is(order.status, OrderStatus.CLOSED)
  t.is(ifoodOrder.status, IfoodOrderStatus.CONCLUDED)

  userOpen = await User.findById(userOpen._id)
  t.is(userOpen.billableItems, undefined)

  stub.restore()
  stub2.restore()
})

test('should add income financial statement when ifood order is CONCLUDED', async (t) => {
  const stub = ifood.stubGet()
  stub.onCall(0).resolves(ifoodEventPlaced)
  stub.onCall(1).resolves(ifoodOrderTest)
  stub.onCall(2).resolves(ifoodEventConcluded)

  const stub2 = ifood.stubPost()
  stub2.onCall(0).resolves(ifoodAuthResponse)
  stub2.onCall(1).resolves({ statusCode: 200 })
  stub2.onCall(2).resolves({ statusCode: 200 })
  stub2.onCall(3).resolves({ statusCode: 200 })
  stub2.onCall(4).resolves({ statusCode: 200 })

  // create user with open ifood store
  const { companyOpen } = await createFakeUsers()

  // get token
  await getIfoodTokens()

  // get first event to crete ifood order
  await syncEvents()

  // get second event update orders status
  await syncEvents()

  const ifoodOrders = await IfoodOrder.find({})
  const orders = await Order.find({})

  t.is(ifoodOrders.length, 1)
  t.is(orders.length, 1)

  const [order] = orders
  const [ifoodOrder] = ifoodOrders
  t.is(order.status, OrderStatus.CLOSED)
  t.is(ifoodOrder.status, IfoodOrderStatus.CONCLUDED)

  stub.restore()
  stub2.restore()

  // check income financial statement
  const statements = await FinancialStatement.find({ company: companyOpen._id })

  t.is(statements.length, 1)

  const [firstIncome] = statements

  t.is(moment(firstIncome.dueAt).format('DD/MM/YYYY'), moment().format('DD/MM/YYYY'))
  t.is(firstIncome.paid, true)
  t.is(firstIncome.order.toString(), order._id.toString())
  t.is(firstIncome.category.toString(), IncomeCategories.SALE.toString())
  t.is(firstIncome.description, `venda do pedido #${order.shortID}`)
  t.is(firstIncome.value, order.totalPaid)
})
