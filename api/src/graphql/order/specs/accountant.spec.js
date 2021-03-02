// THIS FILE IS A SCRIPT TO GENERATE THE INVOICE XML TO THE ACCOUNTANT
import { serial as test } from 'ava'
import { execSync } from 'child_process'
import fs from 'fs'

import SAT from 'src/SAT'

import { Order } from 'src/models'

test.beforeEach(async (t) => {
  await Order.deleteMany({})
})

test.skip('should generate xml files for the accountant', async (t) => {
  const dir = '/Users/guilherme/Desktop/orders-full.json'
  const stdout = await execSync(
    `mongoimport --db mee --port 27020 --collection orders --type json --file "${dir}" --jsonArray`
  )

  console.log('stdout:', stdout)

  const count = await Order.countDocuments({})

  console.log('count:', count)

  const orders = await Order.find({ company: '5fd604714afe55001cfe1ec6', status: 'closed' })

  console.log('orders:', orders.length)

  let countInvoices = 0

  for (const order of orders) {
    if (!order.invoice || order.invoice.error || !order.invoice.responseSAT) continue

    const parsedResponse = SAT.parseResponse(order.invoice.responseSAT)

    if (parsedResponse.CFeSAT) {
      countInvoices++
      const nfce = Buffer.from(parsedResponse.CFeSAT, 'base64').toString('utf-8')
      fs.writeFile(`/Users/guilherme/Desktop/colchetes/${order._id.toString()}.xml`, nfce, function(
        err
      ) {
        if (err) return console.log(err)
      })
    }
  }

  console.log('countInvoices:', countInvoices)

  t.is(true, false)
})
