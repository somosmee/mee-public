import moment from 'moment'
import mongoosastic from 'mongoosastic'
import convert from 'xml-js'

import mongoose from 'src/mongoose'

import { pubsub } from 'src/apolloServer'

import mapper from 'src/mapper'

import { Inventory, Company, Customer, FinancialStatement, ProductionRequest } from 'src/models'
import Delivery from 'src/models/order/delivery'
import Fee from 'src/models/order/fee'
import Ifood from 'src/models/order/ifood'
import Invoice from 'src/models/order/invoice'
import Item from 'src/models/order/item'
import Payment from 'src/models/order/payment'

// import nfe from 'src/services/nfe'

import {
  OrderStatus,
  Origins,
  SalesInvoiceStatus,
  Operations,
  Reasons,
  Topics,
  FinancialOperations,
  IncomeCategories,
  OperationTypes,
  ExpenseCategories,
  DefaultPaymentMethods
} from 'src/utils/enums'
import logger from 'src/utils/logger'
import { normalizeText, buildQueryString } from 'src/utils/preprocess'

const { ObjectId } = mongoose.Types

const OrderSchema = new mongoose.Schema(
  {
    shortID: { type: String, es_indexed: true },
    title: { type: String, trim: true, es_indexed: true },
    company: {
      type: ObjectId,
      index: true,
      ref: 'Company',
      required: true,
      es_indexed: true
    },
    // its not required because a client can created a customer on shopfront
    createdBy: {
      type: ObjectId,
      index: true,
      ref: 'User',
      es_indexed: true
    },
    customer: { type: ObjectId, ref: 'Customer' },
    customerName: { type: String, es_indexed: true },
    items: [Item],
    payments: [Payment],
    requireConfirmation: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.OPEN,
      required: true,
      index: true,
      es_indexed: true
    },
    subtotalDiscount: {
      type: Number,
      required: true,
      default: 0.0,
      description: 'Sum of items.discount'
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0.0,
      description: 'Sum of items.price * items.quantity'
    },
    discount: {
      type: Number,
      required: true,
      default: 0.0,
      description: 'Discount that should be applied to order.total'
    },
    totalDiscount: {
      type: Number,
      required: true,
      default: 0.0,
      description: 'Sum of subtotalDiscount + discount'
    },
    totalFees: {
      type: Number,
      required: true,
      default: 0.0,
      description: 'Sum of fees'
    },
    total: {
      type: Number,
      required: true,
      default: 0.0,
      description: '(subtotal + deliveryFee + totalFees) - totalDiscount'
    },
    totalPaid: { type: Number, required: true, default: 0.0 },
    totalTaxes: { type: Number, required: true, default: 0.0 },
    delivery: Delivery,
    fees: { type: [Fee], default: [] },
    origin: {
      type: String,
      enum: Object.values(Origins),
      default: Origins.MEE,
      required: true
    },
    shouldGenerateInvoice: {
      type: Boolean,
      default: true
    },
    invoice: Invoice,
    ifood: Ifood,
    closedAt: Date
  },
  {
    timestamps: true
  }
)

OrderSchema.index({ createdAt: -1 })

OrderSchema.post('save', function(document, next) {
  const order = this

  pubsub.publish(Topics.ORDER, { order })

  next()
})

OrderSchema.methods.recalculateFees = function(company) {
  const order = this

  order.fees = []
  for (const fee of company.settings.fees) {
    if (fee.enabled) {
      order.fees.push({
        fee: fee._id,
        name: fee.name,
        value:
          fee.operationType === OperationTypes.PERCENTAGE
            ? parseFloat(((fee.fee / 100) * order.subtotal).toFixed(2))
            : fee.fee
      })
    }
  }
}

OrderSchema.methods.recalculateTotals = function(company) {
  const order = this
  const previousSubTotal = order.subtotal
  const previousFees = order.fees

  const deliveryFee = order?.delivery?.fee || 0.0
  const taxes = order.invoice?.taxes

  // recalculate item subtotal
  order.items = order.items
    ? order.items.map((item) => {
      item.subtotal = parseFloat((item.quantity * item.price).toFixed(2))
      return item
    })
    : []

  // recalculate total items subtotals
  order.subtotal = parseFloat(
    order.items.reduce((total, item) => total + item.subtotal, 0.0).toFixed(2)
  )

  // if has fees and subtotal changed lets recalculate
  if (
    previousFees?.length > 0 &&
    previousSubTotal !== order.subtotal &&
    company?.settings?.fees?.length > 0
  ) {
    order.recalculateFees(company)
  }

  // recalculate discounts
  order.subtotalDiscount = parseFloat(
    order.items.reduce((total, item) => total + item.discount, 0.0).toFixed(2)
  )

  // recalculate total discount (items discount + total discount)
  order.totalDiscount = order.subtotalDiscount + order.discount

  // recalculate total fees
  order.totalFees = parseFloat(
    order.fees.reduce((total, item) => total + item.value, 0.0).toFixed(2)
  )

  // recaulcalte total (with or without delivery fee)
  order.total = parseFloat(
    order.subtotal + deliveryFee + order.totalFees - order.totalDiscount
  ).toFixed(2)

  // recalculate total paid
  order.totalPaid = order.payments
    ? parseFloat(
      order.payments
        .filter((payment) => payment.pending === false)
        .reduce((total, item) => total + item.value, 0.0)
        .toFixed(2)
    )
    : 0.0

  // recalculate total taxes
  if (taxes) {
    const { icms, pis, cofins, pisst, cofinsst } = taxes
    order.totalTaxes = icms + pis + cofins + pisst + cofinsst
  }
}

OrderSchema.methods.createSaleMovements = async function(company, user) {
  const order = this
  const hasProductionLines = company.productionLines?.length > 0

  const productionRequestItemsById = {}

  // Change inventory from sale
  for (const item of order.items) {
    const input = { quantity: item.quantity, reason: Reasons.SALE, product: item.product }
    await Inventory.createMovement({
      data: input,
      companyId: company._id,
      userId: user ? user._id : undefined,
      operation: Operations.DECREASE,
      propagate: true
    })

    if (item.productionLine && hasProductionLines) {
      const productionLine = company.productionLines.find(
        (currentProductionLine) =>
          currentProductionLine._id.toString() === item.productionLine.toString()
      )

      if (!productionLine) continue

      const productionLineId = productionLine._id.toString()

      if (`${productionLineId}` in productionRequestItemsById) {
        productionRequestItemsById[productionLineId].push({
          product: item.product,
          name: item.name,
          quantity: item.quantity,
          note: item.note
        })
      } else {
        productionRequestItemsById[productionLineId] = [
          {
            product: item.product,
            name: item.name,
            quantity: item.quantity,
            note: item.note
          }
        ]
      }
    }
  }

  Object.keys(productionRequestItemsById).map(async (key) => {
    const productionRequestInput = {
      company: company._id,
      createdBy: user ? user._id : undefined,
      productionLine: key,
      order: order._id,
      items: productionRequestItemsById[key]
    }
    await new ProductionRequest(productionRequestInput).save()
  })
}

OrderSchema.methods.createSaleUpdateMovements = async function(
  newItems,
  company,
  user,
  shouldGenerateProductionRequest
) {
  const order = this
  const hasProductionLines = company.productionLines?.length > 0

  if (!newItems) return

  const productionRequestItemsById = {}

  // Let's check if an item was changed or deleted
  for (const item of order.items) {
    // we need to compare and check if we need to increase or decrease something from the changes
    const newItem = newItems.find((newI) => newI.product.toString() === item.product.toString())

    if (!newItem) {
      // item was deleted
      const data = { quantity: item.quantity, reason: Reasons.RETURN, product: item.product }
      await Inventory.createMovement({
        data,
        userId: user ? user._id : undefined,
        companyId: company._id,
        operation: Operations.INCREASE
      })
    } else if (newItem.quantity > item.quantity) {
      // quantity increased
      const data = {
        quantity: newItem.quantity - item.quantity,
        reason: Reasons.SALE,
        product: item.product
      }
      await Inventory.createMovement({
        data,
        userId: user ? user._id : undefined,
        companyId: company._id,
        operation: Operations.DECREASE
      })

      if (newItem.productionLine && hasProductionLines && shouldGenerateProductionRequest) {
        const productionLine = company.productionLines.find(
          (currentProductionLine) =>
            currentProductionLine._id.toString() === newItem.productionLine.toString()
        )

        if (!productionLine) continue

        const productionLineId = productionLine._id.toString()

        if (`${productionLineId}` in productionRequestItemsById) {
          productionRequestItemsById[productionLineId].push({
            product: item.product,
            name: item.name,
            quantity: newItem.quantity - item.quantity,
            note: item.note
          })
        } else {
          productionRequestItemsById[productionLineId] = [
            {
              product: item.product,
              name: item.name,
              quantity: newItem.quantity - item.quantity,
              note: item.note
            }
          ]
        }
      }
    } else if (newItem.quantity < item.quantity) {
      // quantity decreased
      const data = {
        quantity: item.quantity - newItem.quantity,
        reason: Reasons.RETURN,
        product: item.product
      }
      await Inventory.createMovement({
        data,
        userId: user ? user._id : undefined,
        companyId: company._id,
        operation: Operations.INCREASE
      })
    }
  }

  // Let's check if an item was added
  for (const newItem of newItems) {
    // check if we have this new item on input but not on old list
    const item = order.items.find((i) => i.product.toString() === newItem.product.toString())

    if (!item) {
      // item was added
      const data = { quantity: newItem.quantity, reason: Reasons.SALE, product: newItem.product }
      await Inventory.createMovement({
        data,
        userId: user ? user._id : undefined,
        companyId: company._id,
        operation: Operations.DECREASE
      })

      if (newItem.productionLine && hasProductionLines && shouldGenerateProductionRequest) {
        const productionLine = company.productionLines.find(
          (currentProductionLine) =>
            currentProductionLine._id.toString() === newItem.productionLine.toString()
        )

        if (!productionLine) continue

        const productionLineId = productionLine._id.toString()
        if (`${productionLineId}` in productionRequestItemsById) {
          productionRequestItemsById[productionLineId].push({
            product: newItem.product,
            name: newItem.name,
            quantity: newItem.quantity,
            note: newItem.note
          })
        } else {
          productionRequestItemsById[productionLineId] = [
            {
              product: newItem.product,
              name: newItem.name,
              quantity: newItem.quantity,
              note: newItem.note
            }
          ]
        }
      }
    }
  }

  Object.keys(productionRequestItemsById).map(async (key) => {
    const productionRequestInput = {
      company: company._id,
      createdBy: user ? user._id : undefined,
      productionLine: key,
      order: order._id,
      items: productionRequestItemsById[key]
    }
    await new ProductionRequest(productionRequestInput).save()
  })
}

OrderSchema.methods.close = async function(pubsub, company, user) {
  const order = this
  order.status = OrderStatus.CLOSED
  order.closedAt = new Date()

  /*
    nfe.sendNFCe(order).catch((e) => {
      logger.error(
        `[order.close/sendNFCe] message: ${e.message} api: ${JSON.stringify(e?.response?.data)}`
      )
    })
   */

  // create financial movement for this sale
  for (const payment of order.payments) {
    let paymentMethod

    if (payment.paymentMethod) {
      paymentMethod = company.paymentMethods.find(
        (pay) => pay._id.toString() === payment.paymentMethod.toString()
      )
    } else {
      const found = DefaultPaymentMethods.find((pay) => pay.method === payment.method)

      if (found) {
        paymentMethod = found
      }
    }

    /* PAYMENT INCOME */
    await FinancialStatement.createMovement(
      {
        value: payment.value,
        paid: true,
        order: order._id,
        category: payment.category || IncomeCategories.SALE,
        description: `venda do pedido #${order.shortID}`,
        dueAt: paymentMethod?.balanceInterval
          ? moment().add(paymentMethod.balanceInterval, 'days')
          : payment.createdAt || new Date(),
        financialFund: payment.financialFund,
        paymentMethod: paymentMethod
      },
      company?._id || order.company,
      user?._id || undefined,
      FinancialOperations.INCOME
    )

    /* PAYMENT FEE */
    if (payment.fee > 0 && paymentMethod) {
      await FinancialStatement.createMovement(
        {
          value: payment.fee,
          paid: true,
          order: order._id,
          category: ExpenseCategories.PAYMENT_METHOD_FEE,
          description: `taxa do metodo de pagamento ${paymentMethod.name} no pedido #${order.shortID}`,
          dueAt: payment.createdAt || new Date(),
          financialFund: payment.financialFund
        },
        company?._id || order.company,
        user?._id || undefined,
        FinancialOperations.EXPENSE
      )
    }
  }

  // we need to handle this setups somehow
  if (
    order.company.toString() === '5fd6046b4afe55001cfe1cee' || // simone
    order.company.toString() === '5fd604714afe55001cfe1ec6' || // colchetes
    process.env.NODE_ENV !== 'production'
  ) {
    await order.sendToSAT(pubsub)
  }
}

OrderSchema.methods.sendToSAT = async function(pubsub) {
  const order = this

  const company = await Company.findById(order.company)
  if (!company) throw new Error('Loja não encontrada')

  const customer = await Customer.findById(order.customer)

  // if tax evasion
  if (!order.shouldGenerateInvoice) return

  logger.debug(`[sendToSAT] ORDER: ${JSON.stringify(order, null, 2)}`)

  let invoice = null
  const companyId = ObjectId.isValid(order.company) ? order.company : order.company._id

  try {
    invoice = mapper.mapOrderToInvoice(order, company, customer)
  } catch (e) {
    logger.error(`[order.close] ${e}`)

    if (!order.invoice) order.invoice = {}

    order.invoice.validationError = e.toString()
    order.invoice.status = SalesInvoiceStatus.ERROR

    order.markModified('invoice')

    await order.save()

    return Promise.resolve()
  }

  const invoiceXML = convert.json2xml(invoice, {
    compact: true,
    ignoreComment: true,
    spaces: 4,
    fullTagEmptyElement: true
  })

  logger.info(`INVOICE: ${invoice}`)
  logger.info(`INVOICE_XML: ${invoiceXML}`)

  order.invoice = { status: SalesInvoiceStatus.PENDING, dataJS: invoice, dataXML: invoiceXML }

  // save invoice details
  await order.save()

  if (pubsub) {
    pubsub.publish('orderClosed', {
      orderClosed: {
        orderId: order._id,
        company: companyId,
        dataXML: invoiceXML
      }
    })
  }
}

OrderSchema.methods.confirm = async function(pubsub) {
  const order = this

  order.status = OrderStatus.CONFIRMED

  await order.save()
}

OrderSchema.methods.cancel = async function(company, user) {
  const order = this

  for (const item of order.items) {
    const data = { quantity: item.quantity, reason: Reasons.RETURN, product: item.product }
    await Inventory.createMovement({
      data,
      companyId: company._id,
      userId: user._id,
      operation: Operations.INCREASE,
      propagate: true
    })
  }

  // delete income financial statement
  await FinancialStatement.deleteOne({ order: order._id })

  order.status = OrderStatus.CANCELED
  order.closedAt = null
}

OrderSchema.plugin(mongoosastic, {
  host: process.env.ELASTICSEARCH_HOST,
  port: +process.env.ELASTICSEARCH_PORT,
  bulk: {
    size: 1000, // preferred number of docs to bulk index
    delay: 5000 // milliseconds to wait for enough docs to meet size constraint
  },
  filter: (doc) => {
    return moment(doc.createdAt).isBefore(moment().subtract(1, 'months'))
  }
})

const OrderModel = mongoose.model('Order', OrderSchema)

// elasticsearch

OrderModel.searchES = function(text, company) {
  if (!company) throw new Error('Company must be defined in search filter criteria')

  const cleanText = normalizeText(text)
  const query = buildQueryString(cleanText, { wildcard: true })

  return new Promise((resolve, reject) => {
    OrderModel.search(
      {
        bool: {
          should: [
            {
              query_string: {
                query: query,
                fuzziness: '2',
                phrase_slop: 2,
                default_field: 'title'
              }
            },
            {
              query_string: {
                query: query,
                fuzziness: '2',
                phrase_slop: 2,
                default_field: 'shortID'
              }
            },
            {
              match_phrase_prefix: {
                customerName: {
                  query: cleanText,
                  slop: 5,
                  max_expansions: 100
                }
              }
            }
          ],
          filter: [
            {
              match: {
                company: company.toString()
              }
            }
          ],
          minimum_should_match: 1
        }
      },
      {},
      (err, results) => {
        if (err) reject(err)
        resolve(results)
      }
    )
  })
}

// const stream = OrderModel.synchronize()
// let count = 0
//
// stream.on('data', (err, doc) => {
//   if (err) logger.error('[OrderModel] error:', err)
//   count++
// })
//
// stream.on('close', () => {
//   logger.debug(`[OrderModel] ${count} documents!`)
// })
//
// stream.on('error', (err) => {
//   logger.error('[OrderModel] error:', err)
// })

export default OrderModel
