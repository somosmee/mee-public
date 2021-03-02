module.exports = {
  async up(db, client) {
    const users = await db.collection('users').find()

    while (await users.hasNext()) {
      const user = await users.next()
      const company = await db.collection('companies').findOne({ 'members.user': user._id })

      if (company && !company.productionLines && user.productionLines) {
        await db.collection('companies').findOneAndUpdate(
          { _id: company._id },
          {
            $set: { productionLines: user.productionLines }
          }
        )

        await db.collection('users').findOneAndUpdate(
          { _id: user._id },
          {
            $unset: { productionLines: '' }
          }
        )
      }
    }
  },

  async down(db, client) {}
}
