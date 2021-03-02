import { serial as test } from 'ava'
import { validate } from 'src/security'

import { mapOrderToInvoice } from 'src/mapper/invoice/sat'
import {
  order,
  orderCompany,
  orderCustomer,
  orderNonCumulative,
  orderNonCumulativeCompany,
  orderNonCumulativeCustomer,
  orderProduction,
  orderProductionCompany,
  orderProductionCustomer,
  orderColchetesCompany,
  orderColchetes,
  orderColchetesDiscount
} from 'src/mapper/invoice/sat/specs/payloads'

import { CNPJ_MEE } from 'src/utils/constants'

test('should parse order obect to XML Invoice Structure correctly', async (t) => {
  const {
    delivery: { address },
    items: [firstItem]
  } = order
  const invoice = mapOrderToInvoice(order, orderCompany, orderCustomer)

  // console.log(convert.json2xml(invoice, { compact: true, ignoreComment: true, spaces: 4, fullTagEmptyElement: true }))

  t.not(invoice, undefined)
  t.not(invoice.CFe, undefined)
  t.not(invoice.CFe.infCFe, undefined)

  const { ide, emit, dest, entrega, det, pgto } = invoice.CFe.infCFe

  // ide
  t.not(ide, undefined)
  t.not(!!ide.CNPJ, false)
  t.is(ide.CNPJ, CNPJ_MEE)
  t.not(!!ide.signAC, false)
  t.is(validate(CNPJ_MEE + orderCompany.nationalId, ide.signAC), true)
  t.is(ide.numeroCaixa, '001')

  // emit
  t.not(emit, undefined)
  t.is(emit.CNPJ, orderCompany.nationalId)
  t.is(emit.IE, orderCompany.stateId)
  t.is(emit.indRatISSQN, 'N') // TODO: CHANGE THIS DEFAULT VALUE

  // dest
  t.not(dest, undefined)

  t.not(entrega, undefined)
  t.deepEqual(entrega, {
    xLgr: address.street,
    nro: address.number,
    xCpl: address.complement,
    xBairro: address.district,
    xMun: address.city,
    UF: 'SP'
  })

  // det
  t.not(det, undefined)

  const [product] = det
  t.deepEqual(product, {
    _attributes: {
      nItem: '1'
    },
    imposto: {
      ICMS: {
        ICMS00: {
          CST: '00',
          Orig: '0',
          pICMS: '1.25'
        }
      },
      PIS: {
        PISAliq: {
          CST: '01',
          pPIS: '0.0065',
          vBC: '289.09'
        }
      },
      COFINS: {
        COFINSAliq: {
          CST: '01',
          pCOFINS: '0.0300',
          vBC: '289.09'
        }
      }
    },
    prod: {
      CFOP: '5102',
      cProd: firstItem.gtin,
      xProd: firstItem.name,
      uCom: 'un',
      qCom: `${firstItem.quantity}.0000`,
      vUnCom: firstItem.price.toFixed(2),
      indRegra: 'A'
    }
  })

  // pgto
  t.not(pgto, undefined)
  t.deepEqual(pgto.MP, [
    { cMP: '01', vMP: '100.00' },
    { cMP: '03', vMP: '189.09' }
  ])
})

/* PIS & CONFINS */

test('should calculate PIS on cumulative regime with the correct value', async (t) => {
  const invoice = mapOrderToInvoice(order, orderCompany, orderCustomer)

  t.not(invoice, undefined)
  t.not(invoice.CFe, undefined)
  t.not(invoice.CFe.infCFe, undefined)

  const { det } = invoice.CFe.infCFe
  const [firstProduct] = det

  t.is(det.length, 6)
  t.not(firstProduct.imposto, undefined)
  t.not(firstProduct.imposto.PIS, undefined)

  const {
    PIS: { PISAliq }
  } = firstProduct.imposto

  t.not(PISAliq, undefined)
  t.is(PISAliq.CST, '01') // Operação Tributável (base de cálculo = valor da operação alíquota normal (cumulativo/não cumulativo))
  t.is(PISAliq.vBC, '289.09') // Valor da Base de Cálculo do PIS
  t.is(PISAliq.pPIS, '0.0065') // Alíquota do PIS (em percentual)
})

test('should calculate COFINS on cumulative regime with the correct value', async (t) => {
  const invoice = mapOrderToInvoice(order, orderCompany, orderCustomer)

  t.not(invoice, undefined)
  t.not(invoice.CFe, undefined)
  t.not(invoice.CFe.infCFe, undefined)

  const { det } = invoice.CFe.infCFe
  const [firstProduct] = det

  t.is(det.length, 6)
  t.not(firstProduct.imposto, undefined)
  t.not(firstProduct.imposto.COFINS, undefined)

  const {
    COFINS: { COFINSAliq }
  } = firstProduct.imposto

  t.not(COFINSAliq, undefined)
  t.is(COFINSAliq.CST, '01') // Operação Tributável (base de cálculo = valor da operação alíquota normal (cumulativo/não cumulativo))
  t.is(COFINSAliq.vBC, '289.09') // Valor da Base de Cálculo do PIS
  t.is(COFINSAliq.pCOFINS, '0.0300') // Alíquota do COFINS (em percentual)
})

test('should calculate PIS on non cumulative regime with the correct value', async (t) => {
  const invoice = mapOrderToInvoice(
    orderNonCumulative,
    orderNonCumulativeCompany,
    orderNonCumulativeCustomer
  )

  t.not(invoice, undefined)
  t.not(invoice.CFe, undefined)
  t.not(invoice.CFe.infCFe, undefined)

  const { det } = invoice.CFe.infCFe
  const [firstProduct] = det

  t.is(det.length, 6)
  t.not(firstProduct.imposto, undefined)
  t.not(firstProduct.imposto.PIS, undefined)

  const {
    PIS: { PISAliq }
  } = firstProduct.imposto

  t.not(PISAliq, undefined)
  t.is(PISAliq.CST, '01') // Operação Tributável (base de cálculo = valor da operação alíquota normal (cumulativo/não cumulativo))
  t.is(PISAliq.vBC, '289.09') // Valor da Base de Cálculo do PIS
  t.is(PISAliq.pPIS, '0.0165') // Alíquota do PIS (em percentual)
})

test('should calculate COFINS on non cumulative regime with the correct value', async (t) => {
  const invoice = mapOrderToInvoice(
    orderNonCumulative,
    orderNonCumulativeCompany,
    orderNonCumulativeCustomer
  )

  t.not(invoice, undefined)
  t.not(invoice.CFe, undefined)
  t.not(invoice.CFe.infCFe, undefined)

  const { det } = invoice.CFe.infCFe
  const [firstProduct] = det

  t.is(det.length, 6)
  t.not(firstProduct.imposto, undefined)
  t.not(firstProduct.imposto.COFINS, undefined)

  const {
    COFINS: { COFINSAliq }
  } = firstProduct.imposto

  t.not(COFINSAliq, undefined)
  t.is(COFINSAliq.CST, '01') // Operação Tributável (base de cálculo = valor da operação alíquota normal (cumulativo/não cumulativo))
  t.is(COFINSAliq.vBC, '289.09') // Valor da Base de Cálculo do PIS
  t.is(COFINSAliq.pCOFINS, '0.0760') // Alíquota do COFINS (em percentual)
})

test('should map to a valid SIMONEs production invoice accepted by SAT', async (t) => {
  const invoice = mapOrderToInvoice(
    orderProduction,
    orderProductionCompany,
    orderProductionCustomer
  )

  t.not(invoice, undefined)
  t.not(invoice.CFe, undefined)
  t.not(invoice.CFe.infCFe, undefined)

  const { ide } = invoice.CFe.infCFe

  t.not(ide, undefined)
  t.is(ide.CNPJ, '35725558000119')
  t.is(
    ide.signAC,
    'q+Jz6HnJWL0Kdsf8nCPtD6jcIFDqkBPPoOt3rD+ez/u8JFE8wUof9tA9wLZdK2HqXeVGXCmG0UUBueGPwB1hzGjLMnIuaEOTIhngPhDtLWaZ5wsCeo9O26h94Al6kptlABC5BW5l7HcWnXtQbJxLuEyUrLzqV8FBrDmG4tjCQ61ppOQ7s2adFxkAJduUMq2fXIcKI5KyMtpMk0Gw+ziqJCwgXo029xepQeTtKtdTF03chEjIMqy2qesME5PhbiiKbSN1LE5rWT3DNtCfftjiBWubmYLgBCBJXoR0jaC6eQIoI0HTmVRuB8fZenmd/MC4MxzeUIfxpKtNXXfBar1n7w=='
  )
  t.is(ide.numeroCaixa, '001')

  const { emit } = invoice.CFe.infCFe

  t.is(emit.CNPJ, '27412532000192')
  t.is(emit.IE, '141895573117')
  // t.is(emit.cRegTribISSQN, ) // optional
  t.is(emit.indRatISSQN, 'N')

  const { dest } = invoice.CFe.infCFe

  t.is(dest.CNPJ, '03015395000194')
  t.is(dest.xNome, 'PlanMetal')

  const { det } = invoice.CFe.infCFe
  const [firstProduct] = det

  t.is(det.length, 1)
  t.deepEqual(firstProduct._attributes, { nItem: '1' })

  const { prod, imposto } = firstProduct

  t.not(prod, undefined)
  t.deepEqual(prod, {
    cProd: '2000001000021',
    xProd: 'Refeição',
    CFOP: '5102',
    uCom: 'un',
    qCom: '23.0000',
    vUnCom: '17.90',
    indRegra: 'A'
  })

  t.not(imposto, undefined)
  t.deepEqual(imposto, {
    PIS: {
      PISAliq: {
        CST: '01',
        vBC: '411.70',
        pPIS: '0.0065'
      }
    },
    COFINS: {
      COFINSAliq: {
        CST: '01',
        vBC: '411.70',
        pCOFINS: '0.0300'
      }
    },
    ICMS: {
      ICMS00: {
        Orig: '0',
        CST: '00',
        pICMS: '1.25'
      }
    }
  })

  const { total } = invoice.CFe.infCFe
  t.is(total, ' ')

  const { pgto } = invoice.CFe.infCFe

  t.not(pgto, undefined)
  t.is(pgto.MP.length, 1)
  const [firstPayment] = pgto.MP

  t.deepEqual(firstPayment, {
    cMP: '01',
    vMP: '411.70'
  })
})

test('should map COLCHETES production setup to SAT', async (t) => {
  const invoice = mapOrderToInvoice(orderColchetes, orderColchetesCompany)

  t.not(invoice, undefined)
  t.not(invoice.CFe, undefined)
  t.not(invoice.CFe.infCFe, undefined)

  const { ide } = invoice.CFe.infCFe

  t.not(ide, undefined)
  t.is(ide.CNPJ, '35725558000119')
  t.is(
    ide.signAC,
    'B9TWehm6I3fM4JVh43gKNF0f/dd3YzsSkFH+rSHw2VGv5zh0t+pPolfqhjSOJSDYoHseDIxWJbtQCPms1JuRyEAvLBqL0+LDRhQ4bHQPzAf72wNPkVp7jgKelDhSdkwEAVLABFVykuIu171ZixjocRK9ebX1Ojh3Irlphq0i/fpJiWA6LfcWuTU1wUR5yDFVdZk5oL8BGbzRvD3JOTrjPNu9pgawZIJ3cjHUVjcdSy8ObAZTl5CAiRO9/ZnNGdvSAvLj/d8G6B5+aQB03nDfDr3NimPl3cwXoFcCCMXJaujji2Q7baspBGNBQodQ/tN+09tL2pqo7x49WMn5PwoxMA=='
  )
  t.is(ide.numeroCaixa, '001')

  const { emit } = invoice.CFe.infCFe

  t.is(emit.CNPJ, '36277730000181')
  t.is(emit.IE, '128509549110')
  // t.is(emit.cRegTribISSQN, ) // optional
  t.is(emit.indRatISSQN, 'N')

  const { dest } = invoice.CFe.infCFe

  t.is(dest.CNPJ, undefined)
  t.is(dest.xNome, undefined)

  const { det } = invoice.CFe.infCFe
  const [firstProduct] = det

  t.is(det.length, 1)
  t.deepEqual(firstProduct._attributes, { nItem: '1' })

  const { prod, imposto } = firstProduct

  t.not(prod, undefined)
  t.deepEqual(prod, {
    cProd: '2000001000021',
    xProd: 'Refeição',
    CFOP: '5102',
    uCom: 'un',
    qCom: '23.0000',
    vUnCom: '17.90',
    indRegra: 'A'
  })

  t.not(imposto, undefined)
  t.deepEqual(imposto, {
    PIS: {
      PISSN: {
        CST: '49'
      }
    },
    COFINS: {
      COFINSSN: {
        CST: '49'
      }
    },
    ICMS: {
      ICMSSN102: {
        Orig: '0',
        CSOSN: '102'
      }
    }
  })

  const { total } = invoice.CFe.infCFe
  t.is(total, ' ')

  const { pgto } = invoice.CFe.infCFe

  t.not(pgto, undefined)
  t.is(pgto.MP.length, 1)
  const [firstPayment] = pgto.MP

  t.deepEqual(firstPayment, {
    cMP: '01',
    vMP: '411.70'
  })
})

test('should map COLCHETES discount production setup to SAT', async (t) => {
  const invoice = mapOrderToInvoice(orderColchetesDiscount, orderColchetesCompany)

  t.not(invoice, undefined)
  t.not(invoice.CFe, undefined)
  t.not(invoice.CFe.infCFe, undefined)

  const { ide } = invoice.CFe.infCFe

  t.not(ide, undefined)
  t.is(ide.CNPJ, '35725558000119')
  t.is(
    ide.signAC,
    'B9TWehm6I3fM4JVh43gKNF0f/dd3YzsSkFH+rSHw2VGv5zh0t+pPolfqhjSOJSDYoHseDIxWJbtQCPms1JuRyEAvLBqL0+LDRhQ4bHQPzAf72wNPkVp7jgKelDhSdkwEAVLABFVykuIu171ZixjocRK9ebX1Ojh3Irlphq0i/fpJiWA6LfcWuTU1wUR5yDFVdZk5oL8BGbzRvD3JOTrjPNu9pgawZIJ3cjHUVjcdSy8ObAZTl5CAiRO9/ZnNGdvSAvLj/d8G6B5+aQB03nDfDr3NimPl3cwXoFcCCMXJaujji2Q7baspBGNBQodQ/tN+09tL2pqo7x49WMn5PwoxMA=='
  )
  t.is(ide.numeroCaixa, '001')

  const { emit } = invoice.CFe.infCFe

  t.is(emit.CNPJ, '36277730000181')
  t.is(emit.IE, '128509549110')
  // t.is(emit.cRegTribISSQN, ) // optional
  t.is(emit.indRatISSQN, 'N')

  const { dest } = invoice.CFe.infCFe

  t.is(dest.CNPJ, undefined)
  t.is(dest.xNome, undefined)

  const { det } = invoice.CFe.infCFe
  const [firstProduct] = det

  t.is(det.length, 1)
  t.deepEqual(firstProduct._attributes, { nItem: '1' })

  const { prod, imposto } = firstProduct

  t.not(prod, undefined)
  t.deepEqual(prod, {
    cProd: '2000001000021',
    xProd: 'Refeição',
    CFOP: '5102',
    uCom: 'un',
    vDesc: '33.33',
    qCom: '23.0000',
    vUnCom: '17.90',
    indRegra: 'A'
  })

  t.not(imposto, undefined)
  t.deepEqual(imposto, {
    PIS: {
      PISSN: {
        CST: '49'
      }
    },
    COFINS: {
      COFINSSN: {
        CST: '49'
      }
    },
    ICMS: {
      ICMSSN102: {
        Orig: '0',
        CSOSN: '102'
      }
    }
  })

  const { total } = invoice.CFe.infCFe
  t.is(total, ' ')

  const { pgto } = invoice.CFe.infCFe

  t.not(pgto, undefined)
  t.is(pgto.MP.length, 1)
  const [firstPayment] = pgto.MP

  t.deepEqual(firstPayment, {
    cMP: '01',
    vMP: '411.70'
  })
})
