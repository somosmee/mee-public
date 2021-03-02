module.exports = {
  async up(db) {
    const users = await db.collection('users').find({})

    while (await users.hasNext()) {
      const user = await users.next()

      if (user.role === 'admin' || user.role === 'employer' || user.role === 'employee') {
        user.permissions.sales = true
      } else {
        user.permissions.sales = false
      }

      await db
        .collection('users')
        .findOneAndUpdate({ _id: user._id }, [{ $set: user }, { $unset: 'permissions.checkout' }])
    }
  },

  async down(db) {
    const users = await db.collection('users').find({})

    while (await users.hasNext()) {
      const user = await users.next()

      if (user.role === 'admin' || user.role === 'employer' || user.role === 'employee') {
        user.permissions.checkout = true
      } else {
        user.permissions.checkout = false
      }

      await db
        .collection('users')
        .findOneAndUpdate({ _id: user._id }, [{ $set: user }, { $unset: 'permissions.sales' }])
    }
  }
}
