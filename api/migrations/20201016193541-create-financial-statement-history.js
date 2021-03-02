const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

module.exports = {
  async up(db, client) {
    // income history
    const salesData = []
    const sales = await db.collection('orders').find({
      status: 'closed'
    })

    while (await sales.hasNext()) {
      const order = await sales.next()

      salesData.push({
        value: Math.abs(order.total),
        paid: true,
        order: order._id,
        category: 'sale',
        description: `venda do pedido #${order.shortID}`,
        dueAt: order.closedAt,
        grocery: new ObjectId(order.grocery),
        operation: 'income'
      })
    }

    // create incomes financial statements
    await db.collection('financialStatements').insertMany(salesData)

    // expense history
    const expensesData = []
    const expenses = await db.collection('purchases').find({
      status: 'success'
    })

    while (await expenses.hasNext()) {
      const purchase = await expenses.next()

      // recalculate total items subtotals
      if (!purchase.total) {
        purchase.total = parseFloat(
          purchase.items.reduce((total, item) => total + item.totalPrice, 0.0).toFixed(2)
        )
      }

      const supplier = await db.collection('suppliers').findOne({ _id: purchase.supplier })

      if (!supplier) throw new Error(`No supplier found for purchase ${JSON.stringify(purchase)}`)

      expensesData.push({
        value: -Math.abs(purchase.total),
        paid: true,
        purchase: purchase._id,
        category: 'inventory_purchase',
        description: supplier.displayName
          ? `compra realizada no ${supplier.displayName}`
          : 'compra',
        dueAt: purchase.purchasedAt || purchase.updatedAt,
        grocery: new ObjectId(purchase.grocery),
        operation: 'expense'
      })
    }

    // create expenses financial statements
    await db.collection('financialStatements').insertMany(expensesData)
  },

  async down(db, client) {
    await db.collection('financialStatements').deleteMany({})
  }
}
