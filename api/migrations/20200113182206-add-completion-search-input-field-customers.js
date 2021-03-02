require('../src/utils/prototypes')

module.exports = {
  async up(db) {
    const customers = await db.collection('customers').find({})
    while (await customers.hasNext()) {
      const customer = await customers.next()
      customer._completion = customer.mobile.generateCompletionIndex()
      await db.collection('customers').findOneAndUpdate({ _id: customer._id }, { $set: customer })
    }
  },

  async down(db) {
    await db.collection('customers').updateMany({}, { $unset: { _completion: 1 } })
  }
}
