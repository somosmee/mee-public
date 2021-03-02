const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

module.exports = {
  async up(db, client) {
    await db.collection('companies').updateMany(
      {},
      {
        $set: {
          paymentMethods: [
            {
              _id: new ObjectId('6001d2e0981c03d9baa2db77'),
              name: 'Dinheiro',
              fee: 0.0,
              operationType: 'percentage',
              method: 'cash'
            },
            {
              _id: new ObjectId('6001d2f1981c03d9baa2db78'),
              name: 'Crédito',
              fee: 0.0,
              operationType: 'percentage',
              method: 'credit'
            },
            {
              _id: new ObjectId('6001d2fc981c03d9baa2db79'),
              name: 'Débito',
              fee: 0.0,
              operationType: 'percentage',
              method: 'debt'
            },
            {
              _id: new ObjectId('6001d309981c03d9baa2db7a'),
              name: 'Voucher',
              fee: 0.0,
              operationType: 'percentage',
              method: 'voucher'
            },
            {
              _id: new ObjectId('6001d314981c03d9baa2db7b'),
              name: 'PIX',
              fee: 0.0,
              operationType: 'percentage',
              method: 'pix'
            }
          ]
        }
      }
    )
  },

  async down(db, client) {
    await db.collection('companies').updateMany(
      {},
      {
        $unset: {
          paymentMethods: ''
        }
      }
    )
  }
}
