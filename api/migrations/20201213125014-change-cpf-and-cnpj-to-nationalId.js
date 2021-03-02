module.exports = {
  async up(db, client) {
    const customers = await db.collection('customers').find()

    while (await customers.hasNext()) {
      const customer = await customers.next()

      await db.collection('customers').findOneAndUpdate(
        { _id: customer._id },
        {
          $set: { nationalId: customer.cpf },
          $unset: { cpf: '' }
        }
      )
    }
  },

  async down(db, client) {
    const customers = await db.collection('customers').find()

    while (await customers.hasNext()) {
      const customer = await customers.next()

      await db.collection('customers').findOneAndUpdate(
        { _id: customer._id },
        {
          $set: { cpf: customer.nationalId },
          $unset: { nationalId: '' }
        }
      )
    }
  }
}
