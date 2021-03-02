require('../src/utils/prototypes')

module.exports = {
  async up(db) {
    const purchases = await db.collection('purchases').find({})

    while (await purchases.hasNext()) {
      const purchase = await purchases.next()
      const invoice = await db.collection('invoices').findOne({ accessKey: purchase.accessKey })

      if (invoice) {
        await db.collection('purchases')
          .findOneAndUpdate({ _id: purchase._id },
            { $set: { invoice: invoice._id } })
      }
    }

    try {
      await db.collection('purchases').dropIndex('accessKey_1')
    } catch (e) {
      console.log('index dont exist anymore, no problem that only happens locally')
    }

    await db.collection('purchases').updateMany({}, {
      $unset: {
        accessKey: '',
        serie: '',
        number: ''
      }
    })
  },

  async down(db) {
    const purchases = await db.collection('purchases').find({})

    while (await purchases.hasNext()) {
      const purchase = await purchases.next()
      const invoice = await db.collection('invoices').findOne({ _id: purchase.invoice })

      if (invoice) {
        await db.collection('purchases')
          .findOneAndUpdate({ _id: purchase._id },
            {
              $set: {
                accessKey: invoice.accessKey,
                serie: invoice.serie,
                number: invoice.number
              }
            })
      }

      await db.collection('purchases').createIndex({ accessKey: 1 }, {
        name: 'accessKey_1',
        unique: true,
        background: true
      })
    }
  }
}
