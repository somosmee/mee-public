module.exports = {
  async up(db) {
    const users = await db.collection('users').find({})

    while (await users.hasNext()) {
      const user = await users.next()

      if (user.role === 'admin' || 'employer' ) {
        user.permissions.customers = true
      } else if (user.role === 'employee') {
        user.permissions.customers = false
      }

      await db.collection('users').findOneAndUpdate({ _id: user._id }, { $set: user })
    }
  },

  async down(db) {
    await db.collection('users').updateMany({}, { '$unset': { 'permissions.customers': '' } })
  }
}
