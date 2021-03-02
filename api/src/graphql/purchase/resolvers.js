import moment from 'moment'

import { Purchase, Invoice, Inventory, Product, FinancialStatement, Supplier } from 'src/models'

import { isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import {
  PurchaseItemStatus,
  Reasons,
  Operations,
  PurchaseStatus,
  FinancialOperations,
  ExpenseCategories,
  Payments
} from 'src/utils/enums'
import { createPaginationPayload, enforcePaginationParams } from 'src/utils/pagination'

export const addPurchase = isAuthenticatedResolver.createResolver(
  async (parent, args, { user, company }, info) => {
    const input = { ...args, company: company._id, createdBy: user._id }
    const newInvoice = new Invoice(input)
    await newInvoice.save()

    const newPurchase = new Purchase(input)
    newPurchase.invoice = newInvoice._id
    await newPurchase.save()

    Invoice.fetch(company._id, user._id, args.accessKey, newPurchase)

    return newPurchase
  }
)

export const addManualPurchase = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { user, company }, info) => {
    const newPurchase = new Purchase({
      ...input,
      company: company._id,
      createdBy: user._id,
      status: PurchaseStatus.SUCCESS,
      purchasedAt: input.purchasedAt || moment.utc().toDate()
    })

    // recalculate total items subtotals
    if (!newPurchase.total || newPurchase.total === 0) {
      newPurchase.total = parseFloat(
        newPurchase.items.reduce((total, item) => total + item.totalPrice, 0.0).toFixed(2)
      )
    }

    await newPurchase.save()

    for (const item of newPurchase.items) {
      item.purchase = newPurchase._id
      item.reason = Reasons.ACQUISITION
      await Inventory.createMovement({
        data: item,
        companyId: company._id,
        userId: user._id,
        operation: Operations.INCREASE
      })
    }

    const supplier = await Supplier.findOne({ _id: newPurchase.supplier })

    // create financial movement for this purchase
    let paymentMethod

    if (newPurchase.paymentMethod) {
      paymentMethod = company.purchasePaymentMethods.find(
        (pay) => pay._id.toString() === newPurchase.paymentMethod.toString()
      )
    }

    // if payment method is credit lets figure it out when this should be paid for real
    if (
      paymentMethod?.method === Payments.CREDIT &&
      paymentMethod?.closingDay &&
      paymentMethod?.paymentDay
    ) {
      // check if this month is closed
      const isCurrentCycleClosed = moment(newPurchase.purchasedAt).date() > paymentMethod.closingDay
      // change dueAt based on that
      const dueAt = isCurrentCycleClosed
        ? moment(newPurchase.purchasedAt)
          .set('date', paymentMethod.paymentDay)
          .set('month', moment(newPurchase.purchasedAt).month() + 1)
        : moment(newPurchase.purchasedAt).set('date', paymentMethod.paymentDay)

      await FinancialStatement.createMovement(
        {
          value: newPurchase.total,
          paid: true,
          purchase: newPurchase._id,
          category: ExpenseCategories.INVENTORY_PURCHASE,
          description: supplier?.displayName
            ? `compra realizada no ${supplier.displayName}`
            : 'compra manual',
          dueAt: dueAt,
          financialFund: newPurchase.financialFund,
          paymentMethod
        },
        company._id,
        user._id,
        FinancialOperations.EXPENSE
      )
    } else {
      await FinancialStatement.createMovement(
        {
          value: newPurchase.total,
          paid: true,
          purchase: newPurchase._id,
          category: ExpenseCategories.INVENTORY_PURCHASE,
          description: supplier?.displayName
            ? `compra realizada no ${supplier.displayName}`
            : 'compra manual',
          dueAt: newPurchase.purchasedAt,
          financialFund: newPurchase.financialFund,
          paymentMethod
        },
        company._id,
        user._id,
        FinancialOperations.EXPENSE
      )
    }

    return newPurchase
  }
)

export const createPurchaseItem = isAuthenticatedResolver.createResolver(
  async (parent, { id, input }, { company }, info) => {
    const product = await Product.createAndBindToUser(input, company._id)
    if (!product) throw new Error('Não foi possível vincular produto à loja')

    const purchase = await Purchase.findOne({ _id: id, company: company._id })
    if (!purchase) throw new Error('Compra não encontrada')

    purchase.items = purchase.items.map((item) => {
      if (item.gtin === product.gtin) {
        item.product = product._id
        item.status = PurchaseItemStatus.DRAFT
      }
      return item
    })
    purchase.markModified('items')

    return purchase.save()
  }
)

export const updatePurchaseItem = isAuthenticatedResolver.createResolver(
  async (parent, { id, input, ...args }, { company }, info) => {
    const purchase = await Purchase.findOne({ _id: id, company: company._id })
    if (!purchase) throw new Error('Compra não encontrada')
    const index = purchase.items.findIndex((item) => item._id.toString() === args.item)
    if (index < 0) throw new Error('Item não encontrado')

    purchase.items = purchase.items.map((item) => {
      if (item._id.toString() === args.item) {
        if (input.gtin) item.gtin = input.gtin
        if (input.quantity) {
          item.quantity = input.quantity
          item.unitPrice = parseFloat(
            parseFloat(purchase.items[index].totalPrice / input.quantity).toFixed(4)
          )
        }
      }
      return item
    })
    purchase.markModified('items')

    return purchase.save()
  }
)
export const importPurchaseItems = isAuthenticatedResolver.createResolver(
  async (parent, args, { user, company }, info) => {
    const conditions = { _id: args.id, company: company._id }
    const purchase = await Purchase.findOne(conditions)
    if (!purchase) throw new Error('Compra não encontrada')

    await Promise.all(
      purchase.items
        .filter((item) => item.status === PurchaseItemStatus.DRAFT && !!item.product)
        .map(async (item) => {
          item.purchase = purchase._id
          item.reason = Reasons.ACQUISITION
          const movement = await Inventory.createMovement({
            data: item,
            userId: user._id,
            companyId: company._id,
            operation: Operations.INCREASE
          })
          if (!movement) throw new Error('Não foi possível salvar a movimentação no estoque')
        })
    )

    const update = { $set: { 'items.$[element].status': PurchaseItemStatus.ADDED_TO_INVENTORY } }
    const options = { new: true, arrayFilters: [{ 'element.status': PurchaseItemStatus.DRAFT }] }
    const updatedPurchase = await Purchase.findOneAndUpdate(conditions, update, options)
    if (!updatedPurchase) throw new Error('Compra não encontrada')

    return updatedPurchase
  }
)

export const purchase = isAuthenticatedResolver.createResolver(
  async (parent, { id }, { company }, info) => {
    const purchase = await Purchase.findOne({ _id: id })
    if (!purchase) throw new Error('Compra não encontrada')

    return purchase
  }
)

export const purchases = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    const { first, skip } = enforcePaginationParams(input && input.pagination)

    const conditions = { company: company._id }
    const options = { skip: skip, limit: first }
    const purchases = await Purchase.find(conditions, null, options).sort({ purchasedAt: -1 })
    if (!purchases) throw new Error('Error while fetch purchases')

    const count = await Purchase.countDocuments(conditions)

    const purchasesPayload = {
      purchases,
      pagination: createPaginationPayload({ first, skip, count })
    }

    return purchasesPayload
  }
)
