export const parsePrice = value => {
  let clean = value.toString()
  clean = clean.replace('R$ ', '')
  clean = clean.replace('.', '')
  return clean
}
