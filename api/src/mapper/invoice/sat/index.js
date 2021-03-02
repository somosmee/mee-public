import { sign } from 'src/security'

import { mapPgto } from 'src/mapper/invoice/sat/payments.js'
import { mapProd } from 'src/mapper/invoice/sat/products.js'
import { mapImposto } from 'src/mapper/invoice/sat/taxes.js'

import { CNPJ_MEE } from 'src/utils/constants'
import logger from 'src/utils/logger'

export const mapOrderToInvoice = (order, company, customer) => {
  const invoice = {
    CFe: {
      infCFe: {
        _attributes: {
          versaoDadosEnt: company.email === 'bistrofogonapanela@gmail.com' ? '0.07' : '0.08'
        },
        ide: mapIde(company),
        emit: mapEmit(company),
        dest: mapDest(order, customer),
        ...(order.delivery && { entrega: mapEntrega(order.delivery) }),
        det: mapDet(order, company),
        total: ' ',
        pgto: mapPgto(order)
      }
    }
  }

  return invoice
}

// Product Details
export const mapDet = (order, company) => {
  let dividedDiscount = null
  // check if has discount and distribute among the items
  if (order.totalDiscount) dividedDiscount = order.totalDiscount / order.items.length

  return order.items.map((item, index) => {
    return {
      _attributes: {
        nItem: String(index + 1)
      },
      prod: mapProd(item, dividedDiscount),
      imposto: mapImposto(order, company)
    }
  })
}

export const mapIde = (company) => {
  if (!company || !company.nationalId) {
    throw new Error('Usuário precisa preencher informação de CNPJ para emitir CF-e')
  }

  return {
    CNPJ: CNPJ_MEE,
    signAC: sign(CNPJ_MEE + company.nationalId),
    numeroCaixa: '001'
  }
}

/**
 *  Missing parameters:
 *  Conditional - IM - Inscrição Municipal deve ser informado com ocorrer emissão conjugada
 *  Optional - cRegTribISSQN - Regime Especial de tributação do ISSQN
 * @param  {Object} company
 * @return {Object}
 */
export const mapEmit = (company) => {
  logger.warn('emit.indRatISSQN is being set with default value "N"')

  if (!company || !company.nationalId) {
    throw new Error('Usuário precisa preencher informação de CNPJ para emitir CF-e')
  }

  if (!company || !company.stateId) {
    throw new Error('Usuário precisa preencher informação de Inscrição estadual para emitir CF-e')
  }

  return {
    CNPJ: company.nationalId.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ''),
    IE: company.stateId.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ''),
    indRatISSQN: 'N' // TODO: default value for now but we need to check how / where / who to get this data from
  }
}

/**
 * Grupo de identificação do Destinatário do CF-e
 * @param  {[type]} order [description]
 * @param  {[type]} customer [description]
 * @return {[type]}       [description]
 */
export const mapDest = (order, customer) => {
  const data = {}

  if (order?.ifood?.customer) {
    const customer = order.ifood.customer

    data.CPF = customer.taxPayerIdentificationNumber
    data.xNome = customer.name
  } else if (customer) {
    if (customer.business && customer.business.nationalId) {
      data.CNPJ = customer.business.nationalId
      data.xNome = customer.business.name
    } else {
      if (customer.nationalId) data.CPF = customer.nationalId
      if (customer.firstName && customer.lastName) {
        data.xNome = customer.firstName + customer.lastName
      }
    }
  }

  return data
}

export const mapEntrega = (delivery) => {
  const { address } = delivery
  return {
    xLgr: address.street,
    nro: address.number,
    ...(address.complement && { xCpl: address.complement }),
    xBairro: address.district,
    xMun: address.city,
    UF: 'SP'
  }
}
