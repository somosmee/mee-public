export const isAccessKey = (accessKey) => {
  if (!accessKey) return false
  if (accessKey.length !== 44) return false

  const mod = 11
  const weights = [
    4,
    3,
    2,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2
  ]
  const checkDigit = parseInt(accessKey[accessKey.length - 1])

  const sum = weights.reduce((sum, weight, index) => sum + weight * parseInt(accessKey[index]))
  const remainder = sum % mod

  let result = Math.abs(mod - remainder)
  if (result >= 10) result = 0

  return checkDigit === result
}
