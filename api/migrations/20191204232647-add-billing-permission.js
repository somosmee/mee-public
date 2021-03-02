module.exports = {
  async up(db) {
    const users = await db.collection('users').find({})

    while (await users.hasNext()) {
      const user = await users.next()

      user.permissions.billing = true

      await db.collection('users').findOneAndUpdate({ _id: user._id }, { $set: user })
    }
  },

  async down(db) {
    await db.collection('users').updateMany({}, { '$unset': { 'permissions.billing': '' } })
  }
}
