const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

module.exports = {
  async up(db) {
    const orders = await db.collection('orders').find({})

    while (await orders.hasNext()) {
      const order = await orders.next()

      if (order.delivery && order.delivery && order.delivery.address && !order.delivery.address._id) {
        await db.collection('orders')
          .findOneAndUpdate({ _id: order._id }, {
            $set: {
              'delivery.address._id': new ObjectId()
            }
          })
      }
    }
  },

  async down(db) {}
}
