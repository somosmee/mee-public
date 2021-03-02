module.exports = {
  async up(db, client) {
    const suppliers = await db.collection('suppliers').find({})

    try {
      await db.collection('suppliers').dropIndex('grocery_1_federalTaxNumber_1')
    } catch (e) {}

    while (await suppliers.hasNext()) {
      const supplier = await suppliers.next()

      await db.collection('suppliers').findOneAndUpdate(
        { _id: supplier._id },
        {
          $set: { nationalId: supplier.federalTaxNumber },
          $unset: { federalTaxNumber: '' }
        }
      )
    }

    try {
      await db.collection('suppliers').createIndex({ company: 1, nationalId: 1 }, { unique: true })
    } catch (e) {}
  },

  async down(db, client) {}
}
