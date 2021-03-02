import { serial as test } from 'ava'
import jsonschema from 'jsonschema'

import { mapOrderToNFe } from 'src/mapper/invoice/nfe'
import { order } from 'src/mapper/invoice/nfe/specs/payload'
import { schemaClient } from 'src/mapper/invoice/nfe/specs/schemas'

test('should map client to nfe API schema', async (t) => {
  const nfeData = mapOrderToNFe(order)

  t.not(nfeData, undefined)
  t.not(nfeData, null)
  t.is(jsonschema.validate(nfeData.cliente, schemaClient).valid, true)
})
