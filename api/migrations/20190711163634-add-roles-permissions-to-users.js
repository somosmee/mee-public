module.exports = {
  async up(db) {
    let companyNumber = 0
    const users = await db.collection('users').find({})

    while (await users.hasNext()) {
      const user = await users.next()


      user.role = 'employer'
      user.permissions = {
        myStore: true,
        reports: true,
        checkout: true,
        products: true,
        orders: {
          create: true,
          edit: true,
          list: true,
          closeOrder: true,
          addPayment: true,
          addItem: true
        },
        tags: true,
        purchases: true,
        suppliers: true
      }
      if (!user.companyNumber) {
        companyNumber += 1
        user.companyNumber = companyNumber
      }

      await db.collection('users').findOneAndUpdate({ _id: user._id }, { $set: user })
    }
  },

  async down(db) {
    await db.collection('users').updateMany({}, { '$unset': { role: '', permissions: '' } })
  }
}
