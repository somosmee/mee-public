import moment from 'moment'
import { ObjectID } from 'mongodb'
import convert from 'xml-js'

import storage from 'src/google/cloud-storage'

import SAT from 'src/SAT'

import {
  Company,
  UserBill,
  UserProduct,
  Product,
  Order,
  Customer,
  FinancialStatement
} from 'src/models'

import { isPublicResolver, isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import mail from 'src/services/mail'

import { generateShortID } from 'src/utils/auth'
import {
  OrderStatus,
  SalesInvoiceStatus,
  Origins,
  Payments,
  IncomeCategories,
  FinancialOperations,
  ExpenseCategories,
  OperationTypes
} from 'src/utils/enums'
import logger from 'src/utils/logger'
import { createQueryFilter } from 'src/utils/order'
import { normalizeText, normalizePhone } from 'src/utils/preprocess'

export const createOrder = isAuthenticatedResolver.createResolver(
  async (parent, { nationalId, input }, { user, company }, info) => {
    input.company = company._id
    input.createdBy = user._id
    input.shortID = generateShortID()

    const order = new Order(input)

    // lets calculate fees the first time so we know we should consider in the total calc
    order.recalculateFees(company)
    order.recalculateTotals(company)

    if (nationalId) {
      let customer = await Customer.findOne({ nationalId, company: company._id })
      if (!customer) {
        customer = await new Customer({ nationalId, company: company._id }).save()
      }

      order.customer = customer._id
    }

    // we need to save it before so we have an _id to send in the production request
    await order.save()

    await order.createSaleMovements(company, user)

    return order
  }
)

export const createOrderShopfront = isPublicResolver.createResolver(
  async (parent, { input }, context, info) => {
    // check if user exist
    const company = await Company.findOne({ _id: input.merchant })
    if (!company) throw new Error('Loja não encontrada!')

    // check if customer already exist if not create one
    input.customer.mobile = normalizePhone(input.customer.mobile)
    let customer = await Customer.findOneWithDeleted({
      company: company._id,
      mobile: input.customer.mobile
    })

    if (!customer) {
      input.customer.company = company._id
      customer = new Customer(input.customer)
    } else {
      if (customer.deleted) {
        await customer.restore()
      }
    }

    const [firstName, lastName] = input.customer.name.split(' ')
    customer.firstName = firstName
    customer.lastName = lastName
    if (input.customer.nationalId) customer.nationalId = input.customer.nationalId

    await customer.save()

    // get items info to build order
    const items = input.items
    const populatedItems = []
    for (const item of items) {
      const userProduct = await UserProduct.findOne({ _id: item._id }).populate('product')
      if (!userProduct) throw new Error('Produto não está mais disponível na vitrine')

      const itemData = Product.merge(userProduct)
      itemData.product = userProduct.product._id
      itemData.quantity = item.quantity
      itemData.note = item.note
      delete itemData._id

      populatedItems.push(itemData)
    }

    // build order and recalculate totals
    const order = new Order({
      shortID: generateShortID(),
      origin: Origins.SHOPFRONT,
      company: input.merchant,
      customer: customer._id,
      customerName: customer.firstName + (customer.lastName || ''),
      delivery: input.delivery,
      items: populatedItems,
      requireConfirmation: true
    })

    // need to review this flow
    order.recalculateTotals(company)

    if (input.payments[0].method !== Payments.CASH) input.payments[0].received = order.total

    // For not accepting multiple payments the amount paid is always the total
    input.payments[0].value = order.total
    input.payments[0].pending = true
    input.payments[0].createdAt = null
    input.payments[0].category = IncomeCategories.SALE
    // We do not accept multiple payments from shopfront
    const payments = [input.payments[0]]

    order.set({ payments })

    await order.save()

    await order.createSaleMovements(company)

    // bill for this order
    await UserBill.addBillableItem(order)

    return order
  }
)

export const updateOrder = isAuthenticatedResolver.createResolver(
  async (parent, { id, input }, { user, company }, info) => {
    if (!ObjectID.isValid(id)) throw new Error('Id do pedido não é válido')

    const order = await Order.findOne({ _id: id, company: company._id })
    if (!order) throw new Error('Pedido não encontrado')

    // we need to limit what can be updated after order is on this statuses
    if ([OrderStatus.CLOSED, OrderStatus.CANCELED].includes(order.status)) {
      throw new Error('Não é possível atualizar informações de um pedido fechado!')
    }

    // check if user had the latest version of this order. Otherwise this could
    // generate conflicts on productionRequests
    if (input.updatedAt && order.updatedAt) {
      const senderUpdatedAt = moment(input.updatedAt)
      const apiUpdatedAt = moment(order.updatedAt)

      if (!apiUpdatedAt.isSame(senderUpdatedAt)) {
        throw new Error(
          'Pedido está desatualizado. Atualize sua lista de pedidos e faça a modificação novamente!'
        )
      }
    }

    if (input.customer) {
      if (!ObjectID.isValid(input.customer)) throw new Error('Customer id is not valid')

      const customer = await Customer.findById(input.customer)
      if (!customer) throw new Error('Usuário não encontrado')

      order.customer = input.customer
      order.customerName = normalizeText(`${customer.firstName} ${customer.lastName}`)
    }

    if ('title' in input) order.title = input.title
    if ('shouldGenerateInvoice' in input) order.shouldGenerateInvoice = input.shouldGenerateInvoice
    if (input.delivery) {
      if (order.delivery) {
        order.delivery.set(input.delivery)
      } else {
        order.set({ delivery: input.delivery })
      }
    }

    if (input.delivery && 'fee' in input.delivery) {
      order.delivery.fee = input.delivery.fee
    }

    if (input.fees) {
      order.set({ fees: input.fees })
    }

    if (input.items) {
      await order.createSaleUpdateMovements(
        input.items,
        company,
        user,
        input.shouldGenerateProductionRequest
      )
      order.set({ items: input.items })

      if (input.items.length === 0) {
        await order.cancel(company, user)
      }
    }

    if ('discount' in input) order.set({ discount: input.discount })

    // recalculate item subtotal
    order.recalculateTotals(company)

    if (input.payments) {
      if (input.payments[0].method !== Payments.CASH) input.payments[0].received = order.total

      // For not accepting multiple payments the amount paid is always the total
      input.payments[0].value = order.total
      input.payments[0].pending = true
      input.payments[0].createdAt = null
      input.payments[0].category = IncomeCategories.SALE
      // We do not accept multiple payments from shopfront
      order.set({ payments: [input.payments[0]] })
    }

    await order.save()

    return order
  }
)

export const addItems = isAuthenticatedResolver.createResolver(
  async (parent, { id, input }, { user, company }, info) => {
    const order = await Order.findOne({ _id: id, company: company._id })
    if (!order) throw new Error('Pedido não encontrado')

    // we need to limit what can be updated after order is on this statuses
    if ([OrderStatus.CLOSED, OrderStatus.CANCELED].includes(order.status)) {
      throw new Error('Não é possível atualizar informações de um pedido fechado!')
    }

    if (input.items) {
      // deep copy
      const currentItems = JSON.parse(JSON.stringify(order.items))

      // update quantity for existing items
      currentItems.map((item) => {
        const found = input.items.find((i) => i.product.toString() === item.product.toString())
        if (found) {
          item.quantity += found.quantity
          if (found.note) item.note = found.note
        }
        return item
      })

      // add new items
      for (const item of input.items) {
        const found = currentItems.find((i) => i.product.toString() === item.product.toString())

        // is a new item
        if (!found) {
          currentItems.push(item)
        }
      }

      await order.createSaleUpdateMovements(currentItems, company, user, true)

      order.set({ items: currentItems })

      if (order.items.length === 0) {
        await order.cancel(company, user)
      }
    }

    // recalculate item subtotal
    order.recalculateTotals(company)

    await order.save()

    return order
  }
)

export const addItemOrder = isAuthenticatedResolver.createResolver(
  async (parent, { id, input }, { user, company }, info) => {
    const conditions = { _id: id, company: company._id }

    const order = await Order.findOne(conditions)
    if (!order) throw new Error('Pedido não encontrado')

    const index = order.items.findIndex((item) => item.gtin === input.gtin)

    let update
    const options = { new: true }

    if (index >= 0) {
      update = { $inc: { 'items.$[item].quantity': 1 } }
      options.arrayFilters = [{ 'item.gtin': input.gtin }]
    } else {
      update = { $push: { items: input } }
    }

    const updatedOrder = await Order.findOneAndUpdate(conditions, update, options)

    updatedOrder.recalculateTotals(company)

    return updatedOrder.save()
  }
)

export const deleteItemOrder = isAuthenticatedResolver.createResolver(
  async (parent, { id, input }, { user, company }, info) => {
    const conditions = { _id: id, company: company._id }
    const update = { $pull: { items: { gtin: input.gtin } } }
    const options = { new: true }

    const updatedOrder = await Order.findOneAndUpdate(conditions, update, options)

    updatedOrder.recalculateTotals(company)

    return updatedOrder.save()
  }
)

export const addPayment = isAuthenticatedResolver.createResolver(
  async (parent, { id, input }, { user, company, pubsub }, info) => {
    const order = await Order.findOne({ _id: id, company: company._id })

    // we need to limit what can be updated after order is on this statuses
    if ([OrderStatus.CLOSED, OrderStatus.CANCELED].includes(order.status)) {
      throw new Error('Não é possível adicionar pagamentos a um pedido fechado!')
    }

    // check if payment is from new paymentMethod object or old string way
    if (!Object.values(Payments).includes(input.method)) {
      const found = company.paymentMethods.find((pay) => pay._id.toString() === input.method)

      if (!found) throw new Error('Forma de pagamento não encontrada!')

      input.fee =
        found.operationType === OperationTypes.PERCENTAGE
          ? parseFloat((found.fee * input.value).toFixed(2))
          : found.fee
      input.paymentMethod = found._id
      input.method = found.method
    }

    order.payments.push({ ...input, createdAt: new Date() })
    order.status = OrderStatus.PARTIALLY_PAID

    order.recalculateTotals(company)

    if (order.totalPaid >= order.total) {
      await order.close(pubsub, company, user)
    }

    await order.save()

    return order
  }
)

export const cancelOrder = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { user, company, pubsub }, info) => {
    const updatedOrder = await Order.findOne({ _id: input.id, company: company._id })
    if (!updatedOrder) throw new Error('Pedido não encontrado')

    if (
      ![
        OrderStatus.OPEN,
        OrderStatus.CONFIRMED,
        OrderStatus.PARTIALLY_PAID,
        OrderStatus.CLOSED
      ].includes(updatedOrder.status)
    ) {
      throw new Error('Pedido não pode ser cancelado')
    }

    updatedOrder.recalculateTotals(company)

    await updatedOrder.cancel(company, user)

    return updatedOrder.save()
  }
)

export const confirmOrder = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company, pubsub }, info) => {
    const updatedOrder = await Order.findOne({ _id: input.id, company: company._id })
    if (!updatedOrder) throw new Error('Pedido não encontrado')

    updatedOrder.recalculateTotals(company)

    await updatedOrder.confirm()

    return updatedOrder.save()
  }
)

export const closeOrder = isAuthenticatedResolver.createResolver(
  async (parent, args, { user, company, pubsub }, info) => {
    const order = await Order.findOne({ _id: args.id, company: company._id })
    if (!order) throw new Error('Pedido não encontrado')

    if (
      ![OrderStatus.OPEN, OrderStatus.PARTIALLY_PAID, OrderStatus.CONFIRMED].includes(order.status)
    ) {
      throw new Error('Pedido não pode ser finalizado')
    }

    order.payments = order.payments.map((payment) => {
      payment.pending = false
      payment.createdAt = Date.now()
      return payment
    })

    order.recalculateTotals(company)

    await order.close(pubsub, company, user)

    await order.save()

    return order
  }
)

export const updateOrderInvoice = isAuthenticatedResolver.createResolver(
  async (parent, { id, status, message }, { company, user }, info) => {
    if (!ObjectID.isValid(id)) throw new Error('Order id is not valid')

    const order = await Order.findOne({ _id: id, company: company._id })
    if (!order) throw new Error('Order not found')

    if (!order.invoice) throw new Error('Order dont have an invoice to update')

    order.invoice.status = status

    if (status === SalesInvoiceStatus.ERROR) {
      order.invoice.error = message
    } else {
      order.invoice.responseSAT = message
      // parse message
      try {
        const parsedResponse = SAT.parseResponse(message)

        if (parsedResponse.accessKey && parsedResponse.QRCode) {
          order.invoice.accessKey = parsedResponse.accessKey
          order.invoice.QRCode = parsedResponse.QRCode
          /**
          <CFe>
            <infCFe>
              <total>
                <ICMSTot>
                  <vICMS>0.00</vICMS> // valor total do ICMS
                  <vProd>12.30</vProd> // valor total dos produtos e serviços
                  <vDesc>0.00</vDesc> // valor total dos descontos sobre item
                  <vPIS>0.00</vPIS> // valor total do PIS
                  <vCOFINS>0.00</vCOFINS> // valor total do COFINS
                  <vPISST>0.00</vPISST> // valor total do PIS-ST
                  <vCOFINSST>0.00</vCOFINSST> // valor total do COFINS-ST
                  <vOutro>0.00</vOutro> // valor total de outras despesas acessórias sobre item
                </ICMSTot>
                <vCFe>12.30</vCFe> // somatório do valor dos itens
              </total>
            </infCFe>
          </CFe>
           */
          // let's parse the generated NFCe and get the totals info
          try {
            order.invoice.CFeSAT = Buffer.from(parsedResponse.CFeSAT, 'base64').toString('utf-8')
            const cfe = convert.xml2js(order.invoice.CFeSAT, { compact: true, addParent: true })

            const { vICMS, vPIS, vCOFINS, vPISST, vCOFINSST } = cfe.CFe.infCFe.total.ICMSTot

            order.invoice.taxes = {
              icms: parseFloat(vICMS._text),
              pis: parseFloat(vPIS._text),
              cofins: parseFloat(vCOFINS._text),
              pisst: parseFloat(vPISST._text),
              cofinsst: parseFloat(vCOFINSST._text)
            }

            console.log('taxes:', order.invoice.taxes)
          } catch (e) {
            console.log('ERROR:', e)
          }
        } else {
          order.invoice.error = parsedResponse.messageCode
          order.invoice.status = SalesInvoiceStatus.ERROR
        }
      } catch (e) {
        order.invoice.status = SalesInvoiceStatus.ERROR
        order.invoice.error = message
        logger.error(`[updateOrderInvoice] FAILED TO PARSE SAT RESPONSE ${message} ${e}`)
      }
    }

    // increment invoice retries
    order.invoice.retries ? order.invoice.retries++ : (order.invoice.retries = 1)

    order.markModified('invoice')

    order.recalculateTotals(company)

    // create expenses from taxes
    if (order.totalTaxes > 0) {
      await FinancialStatement.createMovement(
        {
          value: order.totalTaxes,
          paid: true,
          order: order._id,
          category: ExpenseCategories.TAXES,
          description: `impostos do pedido #${order.shortID}`,
          dueAt: new Date()
        },
        company?._id || order.company,
        user?._id || undefined,
        FinancialOperations.EXPENSE
      )
    }

    return order.save()
  }
)

export const generateInvoice = isAuthenticatedResolver.createResolver(
  async (parent, { id }, { company, pubsub }, info) => {
    const order = await Order.findOne({ _id: id, company: company._id })
    if (!order) throw new Error('Pedido não encontrado!')

    order.shouldGenerateInvoice = true

    await order.sendToSAT(pubsub)

    return order
  }
)

export const sendInvoiceEmail = isAuthenticatedResolver.createResolver(
  async (parent, { input: { orderId, email } }, { company }, info) => {
    const order = await Order.findOne({ _id: orderId, company: company._id })
    if (!order) throw new Error('Pedido não encontrado!')

    if (order?.invoice?.status !== SalesInvoiceStatus.SUCCESS) {
      throw new Error('O pedido não tem uma nota fiscal!')
    }

    // send email - https://myaccount.google.com/u/1/lesssecureapps
    mail.send(
      {
        to: email,
        subject: 'Aqui está a sua Nota fiscal gerada pela Mee :)',
        htmlData: {
          link:
            'https://satsp.fazenda.sp.gov.br/COMSAT/Public/ConsultaPublica/ConsultaPublicaCfe.aspx',
          accessKey: order?.invoice?.accessKey
        }
      },
      'invoice.html'
    )

    return order
  }
)

export const downloadInvoices = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    console.log('input:', input)
    let conditions = { company: company._id }

    conditions = createQueryFilter(input?.filter, conditions)

    const orders = await Order.find({
      ...conditions,
      'invoice.status': SalesInvoiceStatus.SUCCESS,
      'invoice.QRCode': { $exists: true }
    })
      .sort({ createdAt: -1 })
      .lean()

    const files = []

    for (const order of orders) {
      if (!order.invoice || order.invoice.error || !order.invoice.responseSAT) continue

      const parsedResponse = SAT.parseResponse(order.invoice.responseSAT)

      if (parsedResponse.CFeSAT) {
        const nfce = Buffer.from(parsedResponse.CFeSAT, 'base64').toString('utf-8')
        files.push({ fileName: `${order._id}.xml`, content: nfce })
      }
    }

    const uri = await storage.uploadZip({
      bucketName: 'mee-images',
      files,
      zipFileName: `${company._id.toString()}_${moment().format('DD-MM-YYYY')}.zip`
    })

    return uri
  }
)
