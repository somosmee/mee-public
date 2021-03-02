import { PISPercentageFees, COFINSPercentageFees } from 'src/utils/enums'

export const mapImposto = (order, company) => {
  return {
    ICMS: mapICMS(order, company),
    PIS: mapPIS(order, company),
    COFINS: mapCOFINS(order, company)
  }
}

// https://portaldacontabilidade.clmcontroller.com.br/tributos/como-calcular-o-simples-nacional/
const mapICMS = (order, company) => {
  if (!company.tax) {
    throw new Error('É preciso preencher informações na aba de Impostos para emitir Nota Fiscal')
  }

  if (!company.tax?.regime) {
    throw new Error('É preciso preencher informações na aba de Impostos para emitir Nota Fiscal')
  }

  /*
    regime -> { 1: simples nacional, 2: Simples Nacional, excesso sublimite de receita bruta, 3: Regime Normal  }
    1 || 2 –> SIMPLES NACIONAL
    ('ICMSSN102', 'CSOSN=102, 300, 500', 'Orig, CSOSN')
    ('ICMSSN900', 'CSOSN=900', 'Orig, CSOSN, pICMS')

    // 3 -> Regime normal
    ('ICMS00', 'ICMS= 00, 20, 90', 'Orig, CST, pICMS')
    ('ICMS40', 'ICMS = 40, 41, 50, 60', 'Orig, CST')
   */

  const { regime, icmsCSOSN, icmsTaxGroup } = company.tax

  // Simples Nacional
  if (regime === '1' || regime === '2') {
    if (['102', '300', '400', '500'].find((value) => value === icmsCSOSN)) {
      return {
        ICMSSN102: {
          Orig: '0',
          CSOSN: icmsCSOSN
        }
      }
    } else if (icmsCSOSN === '900') {
      return {
        ICMSSN900: {
          Orig: '0',
          CSOSN: icmsCSOSN,
          pICMS: '1.25'
        }
      }
    }
  }

  // Regime Normal
  if (regime === '3') {
    if (['00', '20', '90'].find((value) => value === icmsTaxGroup)) {
      return {
        ICMS00: {
          Orig: '0',
          CST: icmsTaxGroup,
          pICMS: '1.25'
        }
      }
    } else if (['40', '41', '50', '60'].find((value) => value === icmsTaxGroup)) {
      return {
        ICMS40: {
          Orig: '0',
          CST: icmsTaxGroup
        }
      }
    }
  }

  return {
    ICMS00: {
      Orig: '0',
      CST: '00',
      pICMS: '1.25' // static for SP for now
    }
  }
}

// https://www.gazetadopovo.com.br/economia/reforma-tributaria-governo-efeitos-cbs-unificacao-pis-cofins/#:~:text=A%20primeira%20fase%20da%20proposta,%2C%20com%20al%C3%ADquota%20de%2012%25.&text=Por%20isso%2C%20a%20al%C3%ADquota%20%C3%A9,%2C6%25%20para%20a%20Cofins.
/*
A principal alteração promovida pela CBS diz respeito à cumulatividade da tributação.
Hoje, o recolhimento do PIS/Pasep e da Cofins ocorre em dois regimes diferentes.
No cumulativo, com alíquota menor (0,65% para o PIS e 3% para a Cofins), o valor da tributação vai se somando ao longo da cadeia de produção.
As empresas submetidas a esse regime geralmente são menores e declaram seus ganhos pelo chamado lucro presumido.

No não cumulativo, por sua vez, as empresas podem abater o que já foi pago em etapas anteriores, por meio de créditos.
Por isso, a alíquota é mais alta, de 1,65% para o PIS e 7,6% para a Cofins.
Nesses casos, as empresas são maiores e declaram os rendimentos à Receita Federal pelos valores de lucro real.

Com a CBS, tudo passará a ser não cumulativo, com alíquota única de 12%.
Segundo o governo, a nova contribuição será um tributo semelhante a um imposto sobre valor agregado (IVA), isto é,
os empresários deverão pagar a alíquota somente sobre o que for adicionado ao produto.

Outra alteração deve extinguir o chamado cálculo "por dentro", algo que só existe no Brasil. Hoje, a base para o cálculo do imposto já inclui o valor da alíquota, o que eleva o montante a ser pago. Se a base for de R$ 100, por exemplo, no regime "por dentro" o valor do imposto seria cobrado sobre R$ 112. Com isso, o contribuinte pagaria R$ 13,44 – e não R$ 12, o que corresponde ao valor da alíquota. Na CBS, o cálculo será "por fora" – sem a inclusão do valor da alíquota –, eliminando a "jabuticaba" criada no regime brasileiro.
*/
const mapPIS = (order, company) => {
  if (!company?.tax?.incidenceRegime || !company?.tax?.regime) {
    throw new Error('É preciso preencher informações na aba de Impostos para emitir Nota Fiscal')
  }

  const { regime } = company.tax

  // Simples Nacional
  if (regime === '1' || regime === '2') {
    return {
      PISSN: {
        CST: '49'
      }
    }
  } else if (regime === '3') {
    return {
      PISAliq: {
        CST: '01',
        vBC: order.total.toFixed(2),
        pPIS: PISPercentageFees[company.tax.incidenceRegime].toFixed(4)
      }
    }
  }
}

const mapCOFINS = (order, company) => {
  if (!company?.tax?.incidenceRegime || !company?.tax?.regime) {
    throw new Error('É preciso preencher informações na aba de Impostos para emitir Nota Fiscal')
  }

  const { regime } = company.tax

  if (regime === '1' || regime === '2') {
    return {
      COFINSSN: {
        CST: '49'
      }
    }
  } else if (regime === '3') {
    return {
      COFINSAliq: {
        CST: '01',
        vBC: order.total.toFixed(2),
        pCOFINS: COFINSPercentageFees[company.tax.incidenceRegime].toFixed(4)
      }
    }
  }
}
