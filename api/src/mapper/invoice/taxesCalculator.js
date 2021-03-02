/**
 * Calculate taxes in Brazil (ICMS and PIS/COFINS)
 */

const icmsUFFees = {
  AC: 0.17,
  AL: 0.12,
  AM: 0.18,
  AP: 0.18,
  BA: 0.18,
  CE: 0.18,
  DF: 0.18,
  ES: 0.17,
  GO: 0.17,
  MA: 0.18,
  MT: 0.17,
  MS: 0.17,
  MG: 0.18,
  PA: 0.17,
  PB: 0.18,
  PR: 0.18,
  PE: 0.18,
  PI: 0.18,
  RN: 0.18,
  RS: 0.18,
  RJ: 0.2,
  RO: 0.175,
  RR: 0.17,
  SC: 0.17,
  SP: 0.18,
  SE: 0.18,
  TO: 0.18
}

const icmsNoTax = ['40', '41', '60']
const csosnNoTax = ['103', '300', '400', '203', '500']

const calculateICMS = (uf, icms, csosn, total) => {
  if (icmsNoTax.includes(icms)) return 0.0
  if (csosnNoTax.includes(csosn)) return 0.0

  const fee = icmsUFFees[uf.toUpperCase()]
  if (!fee) throw new Error('Taxa de ICMS não foi encontrada para esse estado')
  return parseFloat(total * fee)
}

const pisCofinsNoTax = ['07']
const pisCofinsFees = {
  cumulative: { pis: 0.0065, cofins: 0.03 },
  nonCumulative: { pis: 0.0165, cofins: 0.076 }
}

const calculatePISCOFINS = (incidenceRegime, pisCofinsTaxGroup, total) => {
  if (pisCofinsNoTax.includes(pisCofinsTaxGroup)) return 0.0

  const fees = pisCofinsFees[incidenceRegime]

  return total * (fees.pis + fees.cofins)
}

const calculate = (uf, icms, csosn, incidenceRegime, pisCofinsTaxGroup, total) => {
  return (
    calculateICMS(uf, icms, csosn, total) +
    calculatePISCOFINS(incidenceRegime, pisCofinsTaxGroup, total)
  )
}

export default { calculate, calculateICMS, calculatePISCOFINS }
