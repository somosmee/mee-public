module.exports = {
  async up(db, client) {
    const users = await db.collection('users').find()

    try {
      await db.collection('customers').dropIndex('grocery_1_mobile_1')
    } catch (e) {}

    while (await users.hasNext()) {
      const user = await users.next()
      const company = await db.collection('companies').findOne({ 'members.user': user._id })

      // orders
      await db.collection('orders').updateMany(
        { grocery: user._id },
        {
          $set: {
            company: company._id,
            createdBy: user._id
          },
          $unset: {
            grocery: ''
          }
        }
      )

      // customers
      await db.collection('customers').updateMany(
        { grocery: user._id },
        {
          $set: {
            company: company._id,
            createdBy: user._id
          },
          $unset: {
            grocery: ''
          }
        }
      )

      // financialStatements
      await db.collection('financialStatements').updateMany(
        { grocery: user._id },
        {
          $set: {
            company: company._id,
            createdBy: user._id
          },
          $unset: {
            grocery: ''
          }
        }
      )
      // inventory
      await db.collection('inventory').updateMany(
        { grocery: user._id },
        {
          $set: {
            company: company._id,
            createdBy: user._id
          },
          $unset: {
            grocery: ''
          }
        }
      )
      // invoices
      await db.collection('invoices').updateMany(
        { grocery: user._id },
        {
          $set: {
            company: company._id,
            createdBy: user._id
          },
          $unset: {
            grocery: ''
          }
        }
      )
      // purchases
      await db.collection('purchases').updateMany(
        { grocery: user._id },
        {
          $set: {
            company: company._id,
            createdBy: user._id
          },
          $unset: {
            grocery: ''
          }
        }
      )
      // suppliers
      await db.collection('suppliers').updateMany(
        { grocery: user._id },
        {
          $set: {
            company: company._id,
            createdBy: user._id
          },
          $unset: {
            grocery: ''
          }
        }
      )
      // userBill
      await db.collection('userBill').updateMany(
        { grocery: user._id },
        {
          $set: {
            company: company._id,
            createdBy: user._id
          },
          $unset: {
            grocery: ''
          }
        }
      )
      // usersProducts
      await db.collection('usersProducts').updateMany(
        { grocery: user._id },
        {
          $set: {
            company: company._id,
            createdBy: user._id
          },
          $unset: {
            grocery: ''
          }
        }
      )
      // productionRequest
      await db.collection('productionRequests').updateMany(
        { grocery: user._id },
        {
          $set: {
            company: company._id,
            createdBy: user._id
          },
          $unset: {
            grocery: ''
          }
        }
      )
    }

    await db.collection('customers').createIndex({ company: 1, mobile: 1 }, { unique: true })
  },

  async down(db, client) {
    const users = await db.collection('users').find()

    try {
      await db.collection('customers').dropIndex('company_1_mobile_1')
    } catch (e) {}

    while (await users.hasNext()) {
      const user = await users.next()
      const company = await db.collection('companies').findOne({ 'members.user': user._id })

      if (!company) continue

      // orders
      await db.collection('orders').updateMany(
        { company: company._id },
        {
          $set: {
            grocery: user._id
          },
          $unset: {
            company: '',
            createdBy: ''
          }
        }
      )

      // customers
      await db.collection('customers').updateMany(
        { company: company._id },
        {
          $set: {
            grocery: user._id
          },
          $unset: {
            company: '',
            createdBy: ''
          }
        }
      )

      // financialStatements
      await db.collection('financialStatements').updateMany(
        { company: company._id },
        {
          $set: {
            grocery: user._id
          },
          $unset: {
            company: '',
            createdBy: ''
          }
        }
      )
      // inventory
      await db.collection('inventory').updateMany(
        { company: company._id },
        {
          $set: {
            grocery: user._id
          },
          $unset: {
            company: '',
            createdBy: ''
          }
        }
      )
      // invoices
      await db.collection('invoices').updateMany(
        { company: company._id },
        {
          $set: {
            grocery: user._id
          },
          $unset: {
            company: '',
            createdBy: ''
          }
        }
      )
      // purchases
      await db.collection('purchases').updateMany(
        { company: company._id },
        {
          $set: {
            grocery: user._id
          },
          $unset: {
            company: '',
            createdBy: ''
          }
        }
      )
      // suppliers
      await db.collection('suppliers').updateMany(
        { company: company._id },
        {
          $set: {
            grocery: user._id
          },
          $unset: {
            company: '',
            createdBy: ''
          }
        }
      )
      // userBill
      await db.collection('userBill').updateMany(
        { company: company._id },
        {
          $set: {
            grocery: user._id
          },
          $unset: {
            company: '',
            createdBy: ''
          }
        }
      )
      // usersProducts
      await db.collection('usersProducts').updateMany(
        { company: company._id },
        {
          $set: {
            grocery: user._id
          },
          $unset: {
            company: '',
            createdBy: ''
          }
        }
      )
      // productionRequest
      await db.collection('productionRequests').updateMany(
        { company: company._id },
        {
          $set: {
            grocery: user._id
          },
          $unset: {
            company: '',
            createdBy: ''
          }
        }
      )
    }

    await db.collection('customers').createIndex({ grocery: 1, mobile: 1 }, { unique: true })
  }
}
