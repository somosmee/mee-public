const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

module.exports = {
  async up(db, client) {
    const users = await db.collection('users').find()

    while (await users.hasNext()) {
      const user = await users.next()

      const companyData = {
        createdBy: user._id,
        number: user.companyNumber,
        name: user.companyName,
        members: [
          {
            _id: new ObjectId(),
            user: user._id,
            role: 'businessAdmin'
          }
        ],
        nationalId: user.cnpj,
        stateId: user.stateID,
        description: user.description,
        banner: user.banner,
        picture: user.picture,
        certificate: user.certificate,
        stripeCustomerId: user.stripeCustomerId,
        card: user.card,
        subscription: user.subscription,
        address: user.address,
        ifood: user.ifood,
        loggi: user.ifood,
        tax: user.tax,
        billableItems: user.billableItems,
        settings: user.settings,
        shopfront: user.shopfront
      }

      const unsetFields = Object.keys(companyData).reduce((acc, val) => ({ ...acc, [val]: '' }), {})

      await db.collection('users').findOneAndUpdate(
        { _id: user._id },
        {
          $unset: {
            ...unsetFields,
            proxies: '',
            employees: '',
            role: '',
            permissions: '',
            employer: '',
            accountant: ''
          }
        }
      )

      companyData.createdAt = user.createdAt
      companyData.updatedAt = user.updatedAt

      await db.collection('companies').insertOne(companyData)
    }
  },

  async down(db, client) {
    const companies = await db.collection('companies').find()

    while (await companies.hasNext()) {
      const company = await companies.next()
      const userId = company.members[0].user

      if (userId) {
        const { _id, __v, ...companyData } = company
        await db.collection('users').findOneAndUpdate(
          { _id: userId },
          {
            $set: {
              ...companyData
            }
          }
        )
        await db.collection('companies').deleteOne({ _id: company._id })
      }
    }
  }
}
