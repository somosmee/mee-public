import validate from 'src/mapper/invoice/nfe/validate'
import taxesCalculator from 'src/mapper/invoice/taxesCalculator'

const fieldTranslation = {
  'company.nationalId': 'CNPJ',
  'company.name': 'Razão Social',
  'company.stateId': 'Inscrição Estadual',
  'company.tax.regime': 'Regime Tributário',
  'company.address': 'Endereço Emitente',
  'customer.nationalId': 'CPF do cliente'
}

const measurementMap = {
  unit: 'UN'
}

const prettifyError = (fn, ...params) => {
  try {
    fn(...params)
  } catch (e) {
    const data = JSON.parse(e.message)

    let message = data.error.details[0].message
    message = message
      .replace('"', '')
      .replace('"', '')
      .replace('is required', 'é obrigatório')

    for (const key of Object.keys(fieldTranslation)) {
      message = message.replace(key, fieldTranslation[key])
    }

    throw new Error(message)
  }
}

export const mapOrderToNFe = (order) => {
  prettifyError(validate.orderInput, order)

  const company = order.company
  const customer = order.customer

  const mapProduct = (item) => ({
    codigo: item.product._id.toString(),
    descricao:
      process.env.NODE_ENV === 'prod'
        ? item.product.name
        : 'NOTA FISCAL EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL',
    ean: item.product.internal ? 'SEM GTIN' : item.product.gtin,
    ean_tributavel: item.product.internal ? 'SEM GTIN' : item.product.gtin,
    ncm: item.product.ncm.replace(/\./g, ''),
    cfop: '5102', // sales from purchased or acquired products
    unidade_comercial: measurementMap[item.measurement],
    unidade_tributavel: measurementMap[item.measurement],
    quantidade_comercial: item.quantity,
    quantidade_tributavel: item.quantity,
    valor_unitario_comercial: item.price,
    valor_unitario_tributavel: item.price,
    valor_total_bruto: item.subtotal,
    ind_total: 1,
    icms_origem: parseInt(company.tax.icmsOrigin),
    icms_modalidade: company.tax.icmsTaxGroup,
    icms_csosn: company.tax.icmsCSOSN,
    pis_modalidade: company.tax.pisCofinsTaxGroup,
    cofins_modalidade: company.tax.pisCofinsTaxGroup,
    valor_tributos_aprox: taxesCalculator.calculate(
      company.address.state,
      company.tax.icmsRegime,
      company.tax.icmsCSOSN,
      company.tax.incidenceRegime,
      company.tax.pisCofinsTaxGroup,
      item.subtotal
    )
  })

  const mapCustomer = (customer) => {
    if (!customer) return undefined

    if (customer.business?.nationalId) {
      return {
        tipo_documento: 'CNPJ',
        numero_documento: customer.business?.nationalId,
        indicador_ie: 9
      }
    } else if (customer.nationalId) {
      return {
        tipo_documento: 'CPF',
        numero_documento: customer.nationalId,
        indicador_ie: 9
      }
    } else {
      return undefined
    }
  }

  return {
    emitente: {
      cnpj: company.nationalId
        .replace(/\./g, '')
        .replace(/\//g, '')
        .replace(/-/g, ''),
      nome_fantasia: company.name,
      razao_social: company.name,
      inscricao_estadual: company.stateId.replace(/\./g, ''),
      codigo_de_regime_tributario: company.tax.regime,
      // endereço
      endereco_logradouro: company.address.street,
      endereco_numero: company.address.number,
      endereco_bairro: company.address.district,
      endereco_complemento: company.address.complement || undefined,
      endereco_municipio: company.address.city,
      endereco_uf: company.address.state,
      endereco_cep: company.address.postalCode.replace('-', '')
    },
    cliente: mapCustomer(customer),
    produtos: order.items.map(mapProduct),
    responsavel_tecnico: {
      nationalId: '35725558000119',
      contato: 'Mee',
      email: 'oi@somosmee.com',
      fone: '11987762113'
    },
    natureza_operacao: 'VENDA',
    forma_pagamento: 0,
    tipo_pagamento: 1,
    modelo: 65,
    serie: '1',
    numero_nf: '111', // Número do Documento Fiscal. Faixa: 1–999999999
    tipo_documento: 1,
    municipio: company.tax.ibgeCityCode,
    tipo_impressao_danfe: 4,
    forma_emissao: '1',
    cliente_final: 1,
    indicador_destino: 1,
    indicador_presencial: 1,
    finalidade_emissao: '1',
    processo_emissao: '0',
    transporte_modalidade_frete: 9,
    informacoes_adicionais_interesse_fisco: 'venda para consumidor final',
    totais_tributos_aproximado: taxesCalculator.calculate(
      company.address.state,
      company.tax.icmsRegime,
      company.tax.icmsCSOSN,
      company.tax.incidenceRegime,
      company.tax.pisCofinsTaxGroup,
      order.subtotal
    )
  }
}

export default { mapOrderToNFe }
