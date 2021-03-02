import test from 'ava'

import SAT from 'src/SAT'
import { enviarDadosVendaSuccess, expectedParsedMessage } from 'src/SAT/specs/payload'

test('should parse success response enviarDadosVenda', async (t) => {
  const parsed = SAT.parseResponse(enviarDadosVendaSuccess)
  t.not(parsed, undefined)
  t.is(parsed.CFeSAT, expectedParsedMessage.CFeSAT)
  t.is(parsed.errorCode, expectedParsedMessage.errorCode)
  t.is(parsed.messageCode, expectedParsedMessage.messageCode)
  t.is(parsed.messageReference, expectedParsedMessage.messageReference)
  t.is(parsed.messageSEFAZ, expectedParsedMessage.messageSEFAZ)
  t.is(parsed.sessionNumber, expectedParsedMessage.sessionNumber)
  t.is(parsed.successCode, expectedParsedMessage.successCode)
  t.is(parsed.timestamp, expectedParsedMessage.timestamp)
  t.is(parsed.accessKey, expectedParsedMessage.accessKey)
  t.is(parsed.QRCode, expectedParsedMessage.QRCode)
})
