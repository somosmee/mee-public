const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

const DefaultExpenseCategories = Object.freeze([
  {
    _id: new ObjectId('600074a4981c03d9baa2db6d'),
    name: 'Despesas Gerais',
    color: '#F57C00'
  },
  {
    _id: new ObjectId('6000751d981c03d9baa2db6f'),
    name: 'Compras Estoque',
    color: '#9C27B0'
  },
  {
    _id: new ObjectId('60007533981c03d9baa2db70'),
    name: 'Impostos',
    color: '#F44336'
  },
  {
    _id: new ObjectId('60007579981c03d9baa2db71'),
    name: 'Taxas meio de pagamento',
    color: '#FF5722'
  },
  {
    _id: new ObjectId('60007599981c03d9baa2db72'),
    name: 'Ajuste',
    color: '#607D8B'
  }
])

const DefaultIncomeCategories = Object.freeze([
  {
    _id: new ObjectId('600075bf981c03d9baa2db73'),
    name: 'Vendas',
    color: '#4CAF50'
  },
  {
    _id: new ObjectId('600075d6981c03d9baa2db74'),
    name: 'Receitas Gerais',
    color: '#2196F3'
  },
  {
    _id: new ObjectId('600075e7981c03d9baa2db75'),
    name: 'Ajuste',
    color: '#607D8B'
  }
])

module.exports = {
  async up(db, client) {
    await db.collection('companies').updateMany(
      {},
      {
        $set: {
          expenseCategories: DefaultExpenseCategories,
          incomeCategories: DefaultIncomeCategories
        }
      }
    )
  },

  async down(db, client) {
    await db.collection('companies').updateMany(
      {},
      {
        $unset: {
          expenseCategories: '',
          incomeCategories: ''
        }
      }
    )
  }
}
