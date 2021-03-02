const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

const DefaultPaymentMethods = Object.freeze([
  {
    _id: new ObjectId('6001d2e0981c03d9baa2db77'),
    name: 'Dinheiro',
    fee: 0.0,
    operationType: 'percentage',
    method: 'cash'
  },
  {
    _id: new ObjectId('6001d2f1981c03d9baa2db78'),
    name: 'Crédito',
    fee: 0.0,
    operationType: 'percentage',
    method: 'credit'
  },
  {
    _id: new ObjectId('6001d2fc981c03d9baa2db79'),
    name: 'Débito',
    fee: 0.0,
    operationType: 'percentage',
    method: 'debt'
  },
  {
    _id: new ObjectId('6001d309981c03d9baa2db7a'),
    name: 'Voucher',
    fee: 0.0,
    operationType: 'percentage',
    method: 'voucher'
  },
  {
    _id: new ObjectId('6001d314981c03d9baa2db7b'),
    name: 'PIX',
    fee: 0.0,
    operationType: 'percentage',
    method: 'pix'
  }
])

const findMatches = (payments, value) => {
  const matches = []

  for (const payment of payments) {
    if (payment.value === value) matches.push(payment)
  }

  return matches
}

const savePaymentMethod = async (found, financialStatement, db) => {
  if (found) {
    const paymentMethod = DefaultPaymentMethods.find((pm) => pm.method === found.method)

    if (paymentMethod) {
      await db.collection('financialStatements').findOneAndUpdate(
        { _id: financialStatement._id },
        {
          $set: { paymentMethod }
        }
      )
    } else {
      console.log(`PAYMENT METHOD NOT FOUND ${financialStatement._id}`)
    }
  } else {
    console.log(`PAYMENT NOT FOUND ${financialStatement._id}`)
  }
}

const findPaymentWithNoStatement = async (matches, financialStatement, db) => {
  const data = [...matches]
  // get all statements from that order to check which one he doesnt have yet
  const statements = await db.collection('financialStatements').find({
    order: financialStatement.order,
    paymentMethod: { $exists: true },
    value: financialStatement.value
  })

  while (await statements.hasNext()) {
    const statement = await statements.next()

    const index = data.findIndex((x) => x.method === statement.paymentMethod.method)
    if (index >= 0) {
      data.splice(index, 1)
    }
  }

  if (data.length > 0) {
    return data[0]
  }
}

module.exports = {
  async up(db, client) {
    const financialStatements = await db.collection('financialStatements').find({
      order: { $exists: true },
      paymentMethod: { $exists: false }
    })

    while (await financialStatements.hasNext()) {
      const financialStatement = await financialStatements.next()

      const order = await db.collection('orders').findOne({ _id: financialStatement.order })

      if (order) {
        /*
          - check if it has payments with same values
          - if it does check which payment doesnt have an financial statement associated with it
          - associate the financial statement with the first one that doesnt have it and move on
         */

        const matches = findMatches(order.payments, financialStatement.value)

        if (matches.length === 1) {
          const found = matches[0]

          await savePaymentMethod(found, financialStatement, db)
        } else if (matches.length > 1) {
          console.log(`--- MUTILPLE MATCHES: ${financialStatement._id}`)
          const found = await findPaymentWithNoStatement(matches, financialStatement, db)

          await savePaymentMethod(found, financialStatement, db)
        } else {
          console.log(
            `(EXPECTED) NO PAYMENT MATCH FOUND ${financialStatement.order} ${financialStatement._id}`
          )
          // we need to delete this statement which matches the whole order
          // and create individual statements for every payment

          if (order.payments.length > 0) {
            for (const payment of order.payments) {
              const statement = {
                value: Math.abs(payment.value),
                paid: true,
                order: order._id,
                category: 'sale',
                description: `venda do pedido #${order.shortID}`,
                dueAt: order.closedAt,
                company: new ObjectId(order.company),
                operation: 'income',
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                createdBy: order.createdBy,
                paymentMethod: DefaultPaymentMethods.find((pay) => pay.method === payment.method)
              }

              await db.collection('financialStatements').insertOne(statement)
            }

            await db.collection('financialStatements').deleteOne({ _id: financialStatement._id })
          }
        }
      } else {
        console.log(`NO ORDER FOUND ${financialStatement.order} ${financialStatement._id}`)
      }
    }
  },
  async down(db, client) {
    await db.collection('financialStatements').updateMany(
      {},
      {
        $unset: {
          paymentMethod: ''
        }
      }
    )
  }
}
