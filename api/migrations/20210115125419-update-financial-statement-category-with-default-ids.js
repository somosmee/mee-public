const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

const ExpenseCategories = Object.freeze({
  GENERAL_EXPENSE: new ObjectId('600074a4981c03d9baa2db6d'),
  INVENTORY_PURCHASE: new ObjectId('6000751d981c03d9baa2db6f'),
  TAXES: new ObjectId('60007533981c03d9baa2db70'),
  PAYMENT_METHOD_FEE: new ObjectId('60007579981c03d9baa2db71'),
  ADJUSTMENT: new ObjectId('60007599981c03d9baa2db72')
})

const IncomeCategories = Object.freeze({
  SALE: new ObjectId('600075bf981c03d9baa2db73'),
  GENERAL_INCOME: new ObjectId('600075d6981c03d9baa2db74'),
  ADJUSTMENT: new ObjectId('600075e7981c03d9baa2db75')
})

module.exports = {
  async up(db, client) {
    const collection = 'financialStatements'

    await db.collection(collection).updateMany(
      { category: 'general_expense' },
      {
        $set: { category: ExpenseCategories.GENERAL_EXPENSE }
      }
    )

    await db.collection(collection).updateMany(
      { category: 'inventory_purchase' },
      {
        $set: { category: ExpenseCategories.INVENTORY_PURCHASE }
      }
    )

    await db.collection(collection).updateMany(
      { category: 'taxes' },
      {
        $set: { category: ExpenseCategories.TAXES }
      }
    )

    await db.collection(collection).updateMany(
      { category: 'payment_method_fee' },
      {
        $set: { category: ExpenseCategories.PAYMENT_METHOD_FEE }
      }
    )

    await db.collection(collection).updateMany(
      { category: 'adjustment', operation: 'expense' },
      {
        $set: { category: ExpenseCategories.ADJUSTMENT }
      }
    )

    await db.collection(collection).updateMany(
      { category: 'sale' },
      {
        $set: { category: IncomeCategories.SALE }
      }
    )

    await db.collection(collection).updateMany(
      { category: 'general_income' },
      {
        $set: { category: IncomeCategories.GENERAL_INCOME }
      }
    )

    await db.collection(collection).updateMany(
      { category: 'adjustment', operation: 'income' },
      {
        $set: { category: IncomeCategories.ADJUSTMENT }
      }
    )
  },

  async down(db, client) {
    const collection = 'financialStatements'
    await db.collection(collection).updateMany(
      { category: ExpenseCategories.GENERAL_EXPENSE },
      {
        $set: { category: 'general_expense' }
      }
    )

    await db.collection(collection).updateMany(
      { category: ExpenseCategories.INVENTORY_PURCHASE },
      {
        $set: { category: 'inventory_purchase' }
      }
    )

    await db.collection(collection).updateMany(
      { category: ExpenseCategories.TAXES },
      {
        $set: { category: 'taxes' }
      }
    )

    await db.collection(collection).updateMany(
      { category: ExpenseCategories.PAYMENT_METHOD_FEE },
      {
        $set: { category: 'payment_method_fee' }
      }
    )

    await db.collection(collection).updateMany(
      { category: ExpenseCategories.ADJUSTMENT, operation: 'expense' },
      {
        $set: { category: 'adjustment' }
      }
    )

    await db.collection(collection).updateMany(
      { category: IncomeCategories.SALE },
      {
        $set: { category: 'sale' }
      }
    )

    await db.collection(collection).updateMany(
      { category: IncomeCategories.GENERAL_INCOME },
      {
        $set: { category: 'general_income' }
      }
    )

    await db.collection(collection).updateMany(
      { category: IncomeCategories.ADJUSTMENT, operation: 'income' },
      {
        $set: { category: 'adjustment' }
      }
    )
  }
}
