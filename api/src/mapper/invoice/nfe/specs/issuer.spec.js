import { serial as test } from 'ava'
import jsonschema from 'jsonschema'

import { mapOrderToNFe } from 'src/mapper/invoice/nfe'
import { order } from 'src/mapper/invoice/nfe/specs/payload'
import { schemaIssuer } from 'src/mapper/invoice/nfe/specs/schemas'

const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

test('should map order emitent to nfe API schema', async (t) => {
  const nfeData = mapOrderToNFe(order)

  t.not(nfeData, undefined)
  t.not(nfeData, null)
  t.is(jsonschema.validate(nfeData.emitente, schemaIssuer).valid, true)
})

test('should throw error if dont have nationalId', async (t) => {
  const orderCopy = clone(order)

  delete orderCopy.company.nationalId

  const error = t.throws(
    () => {
      mapOrderToNFe(orderCopy)
    },
    { instanceOf: Error }
  )

  t.is(error.message, 'CNPJ é obrigatório')
})

test('should throw error if dont have name', async (t) => {
  const orderCopy = clone(order)

  delete orderCopy.company.name

  const error = t.throws(
    () => {
      mapOrderToNFe(orderCopy)
    },
    { instanceOf: Error }
  )

  t.is(error.message, 'Razão Social é obrigatório')
})

test('should throw error if dont have stateId', async (t) => {
  const orderCopy = clone(order)

  delete orderCopy.company.stateId

  const error = t.throws(
    () => {
      mapOrderToNFe(orderCopy)
    },
    { instanceOf: Error }
  )

  t.is(error.message, 'Inscrição Estadual é obrigatório')
})

test('should throw error if dont have tax regime', async (t) => {
  const orderCopy = clone(order)

  delete orderCopy.company.tax.regime

  const error = t.throws(
    () => {
      mapOrderToNFe(orderCopy)
    },
    { instanceOf: Error }
  )

  t.is(error.message, 'Regime Tributário é obrigatório')
})

test('should throw error if dont have complete address info', async (t) => {
  const orderCopy = clone(order)

  delete orderCopy.company.address

  const error = t.throws(
    () => {
      mapOrderToNFe(orderCopy)
    },
    { instanceOf: Error }
  )

  t.is(error.message, 'Endereço Emitente é obrigatório')
})
