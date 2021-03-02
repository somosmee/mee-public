import { serial as test } from 'ava'
import jsonschema from 'jsonschema'

import { mapOrderToNFe } from 'src/mapper/invoice/nfe'
import { order } from 'src/mapper/invoice/nfe/specs/payload'
import { schemaProducts } from 'src/mapper/invoice/nfe/specs/schemas'

const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

test('should map client to nfe API schema', async (t) => {
  const nfeData = mapOrderToNFe(order)

  t.not(nfeData, undefined)
  t.not(nfeData, null)
  t.is(jsonschema.validate(nfeData.produtos, schemaProducts).valid, true)
})

test('should throw error if dont have ncm', async (t) => {
  const orderCopy = clone(order)

  delete orderCopy.items[0].product.ncm

  const error = t.throws(
    () => {
      mapOrderToNFe(orderCopy)
    },
    { instanceOf: Error }
  )

  t.is(error.message, 'items[0].product.ncm é obrigatório')
})
