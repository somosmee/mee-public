import { serial as test } from 'ava'
import jsonschema from 'jsonschema'

import { mapOrderToNFe } from 'src/mapper/invoice/nfe'
import { order } from 'src/mapper/invoice/nfe/specs/payload'
import { schemaNFe } from 'src/mapper/invoice/nfe/specs/schemas'

const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

test('should map order to nfe API schema', async (t) => {
  const nfeData = mapOrderToNFe(order)

  t.not(nfeData, undefined)
  t.not(nfeData, null)
  t.is(jsonschema.validate(nfeData, schemaNFe).valid, true)
})

test('should allow no customer on order object', async (t) => {
  const orderCopy = clone(order)

  delete orderCopy.customer

  const nfeData = mapOrderToNFe(order)

  t.not(nfeData, undefined)
  t.not(nfeData, null)
  t.is(jsonschema.validate(nfeData, schemaNFe).valid, true)
})
