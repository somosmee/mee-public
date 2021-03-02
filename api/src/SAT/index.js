const NO_ERROR_CODE = '0000'
const ERROR_ACTIVATION_CODE = '06001'

const SAT_ERRORS = [ERROR_ACTIVATION_CODE]

export const parseResponse = (message) => {
  const chunks = message.split('|')

  // SAT returned an error lets save that message in the database
  if (chunks[2] !== NO_ERROR_CODE || SAT_ERRORS.find((value) => value === chunks[1])) {
    return {
      sessionNumber: chunks[0],
      successCode: chunks[1],
      errorCode: chunks[2],
      messageCode: chunks[3]
    }
  }

  if (chunks.length !== 12) throw new Error('Resposta do SAT não é válida')

  return {
    sessionNumber: chunks[0],
    successCode: chunks[1],
    errorCode: chunks[2],
    messageCode: chunks[3],
    messageReference: chunks[4],
    messageSEFAZ: chunks[5],
    CFeSAT: chunks[6],
    timestamp: chunks[7],
    accessKey: chunks[8],
    total: chunks[9],
    federalTaxID: chunks[10],
    QRCode: chunks[11]
  }
}

export default {
  parseResponse
}
