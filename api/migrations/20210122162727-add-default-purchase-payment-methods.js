const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

const OperationTypes = Object.freeze({
  PERCENTAGE: 'percentage',
  ABSOLUTE: 'absolute'
})

const Payments = Object.freeze({
  CASH: 'cash',
  CREDIT: 'credit',
  DEBT: 'debt',
  VOUCHER: 'voucher',
  PIX: 'pix'
})

module.exports = {
  async up(db, client) {
    await db.collection('companies').updateMany(
      {},
      {
        $set: {
          purchasePaymentMethods: [
            {
              _id: new ObjectId('600afc58f705d47058f4d801'),
              name: 'Dinheiro',
              fee: 0.0,
              operationType: OperationTypes.PERCENTAGE,
              method: Payments.CASH
            },
            {
              _id: new ObjectId('600afc60f705d47058f4d802'),
              name: 'Crédito',
              fee: 0.0,
              operationType: OperationTypes.PERCENTAGE,
              method: Payments.CREDIT
            },
            {
              _id: new ObjectId('600afc68f705d47058f4d803'),
              name: 'Débito',
              fee: 0.0,
              operationType: OperationTypes.PERCENTAGE,
              method: Payments.DEBT
            },
            {
              _id: new ObjectId('600afc6ff705d47058f4d804'),
              name: 'Voucher',
              fee: 0.0,
              operationType: OperationTypes.PERCENTAGE,
              method: Payments.VOUCHER
            },
            {
              _id: new ObjectId('600afc77f705d47058f4d805'),
              name: 'PIX',
              fee: 0.0,
              operationType: OperationTypes.PERCENTAGE,
              method: Payments.PIX
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
