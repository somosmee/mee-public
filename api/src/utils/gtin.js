import { validate, getRealFormat } from 'gtin'

Number.prototype.pad = function(size) {
  var s = String(this)
  while (s.length < (size || 2)) {
    s = '0' + s
  }
  return s
}

/**
 * Format - GTIN-13
 *
 * [PPP][CCCC][IIIII][D]
 * P - GS1 Prefix [200-299]
 * C - Company Number [1-9999]
 * I - Item Number [1-99999]
 * D - Check Digit
 */

const GS1_PREFIX_MIN = 200
const GS1_PREFIX_MAX = 299
const ITEM_NUMBER_MIN = 1
const ITEM_NUMBER_MAX = 99999

export const SUPPORTED_FORMATS = ['GTIN-13']

export const generate = (companyNumber, lastGtin) => {
  let gtinWithoutCheckDigit

  if (companyNumber && lastGtin) {
    const lastGs1Prefix = parseInt(lastGtin.slice(0, 3))
    const nextItemNumber = parseInt(lastGtin.slice(7, 12)) + 1

    if (nextItemNumber > ITEM_NUMBER_MAX) {
      const nextGs1Prefix = lastGs1Prefix + 1

      if (nextGs1Prefix > GS1_PREFIX_MAX) {
        throw new Error('GS1 prefix has reached the limit')
      }

      gtinWithoutCheckDigit = `${nextGs1Prefix}${companyNumber.pad(4)}${ITEM_NUMBER_MIN.pad(5)}`
    } else {
      gtinWithoutCheckDigit = `${lastGs1Prefix}${companyNumber.pad(4)}${nextItemNumber.pad(5)}`
    }
  } else if (companyNumber) {
    gtinWithoutCheckDigit = `${GS1_PREFIX_MIN}${companyNumber.pad(4)}${ITEM_NUMBER_MIN.pad(5)}`
  } else {
    throw new Error('Company number or last gtin are required')
  }

  const sum = gtinWithoutCheckDigit
    .split('')
    .reverse()
    .reduce((sum, number, index) => {
      const value = index % 2 === 0 ? parseInt(number) * 3 : parseInt(number) * 1
      return sum + value
    }, 0)

  const remainder = sum % 10
  const nearestMultipleOfTen = remainder === 0 ? sum : 10 - remainder + sum
  const checkDigit = nearestMultipleOfTen - sum
  const gtin = gtinWithoutCheckDigit + checkDigit

  if (validate(gtin) && SUPPORTED_FORMATS.includes(getRealFormat(gtin))) return gtin

  throw new Error('Erro ao gerar gtin')
}
