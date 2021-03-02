module.exports = {
  async up(db) {
    const users = await db.collection('users').find({})

    while (await users.hasNext()) {
      const user = await users.next()

      if (user.role === 'admin' || user.role === 'employer') {
        user.permissions.deliveries = true
      } else {
        user.permissions.deliveries = false
      }

      await db.collection('users').findOneAndUpdate({ _id: user._id }, { $set: user })
    }
  },

  async down(db) {
    const users = await db.collection('users').find({})

    while (await users.hasNext()) {
      const user = await users.next()
      user.permissions.deliveries = false

      await db.collection('users').findOneAndUpdate({ _id: user._id }, { $set: user })
    }
  }
}
