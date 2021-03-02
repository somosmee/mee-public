import {
  CREATE_FINANCIAL_FUND,
  DELETE_FINANCIAL_FUND,
  UPDATE_FINANCIAL_FUND
} from 'src/graphql/financialFund/specs/gql.js'
import { CREATE_ORDER, ADD_PAYMENT, CANCEL_ORDER } from 'src/graphql/order/specs/gql'

import {
  PRODUCT_1,
  PRODUCT_2,
  PRODUCT_3,
  USER_PRODUCT_1,
  USER_PRODUCT_2,
  USER_PRODUCT_3
} from 'src/test/common/payloads/products'

export const createOrderMutation = async (mutate) => {
  const variables = {
    input: {
      items: [
        {
          product: PRODUCT_1._id,
          gtin: PRODUCT_1.gtin,
          name: PRODUCT_1.name,
          description: PRODUCT_1.description,
          price: USER_PRODUCT_1.price,
          measurement: PRODUCT_1.measurement,
          ncm: PRODUCT_1.ncm,
          quantity: 1,
          note: ''
        },
        {
          product: PRODUCT_2._id,
          gtin: PRODUCT_2.gtin,
          name: PRODUCT_2.name,
          description: PRODUCT_2.description,
          price: USER_PRODUCT_2.price,
          measurement: PRODUCT_2.measurement,
          ncm: PRODUCT_2.ncm,
          quantity: 2,
          note: ''
        },
        {
          product: PRODUCT_3._id,
          gtin: PRODUCT_3.gtin,
          name: PRODUCT_3.name,
          description: PRODUCT_3.description,
          price: USER_PRODUCT_3.price,
          measurement: PRODUCT_3.measurement,
          ncm: PRODUCT_3.ncm,
          quantity: 3,
          note: ''
        }
      ]
    }
  }

  const response = await mutate(CREATE_ORDER, { variables })

  return { response, variables }
}

export const addPaymentMutation = async (mutate, orderId, value) => {
  const variables = {
    id: orderId,
    input: {
      method: 'cash',
      value: value,
      received: value
    }
  }

  const response = await mutate(ADD_PAYMENT, { variables })

  return { response, variables }
}

export const cancelPaymentMutation = async (mutate, orderId) => {
  const variables = { input: { id: orderId } }
  const response = await mutate(CANCEL_ORDER, { variables })

  return { response, variables }
}

/* FINANCIAL FUND */

export const createFinancialFund = async (mutate, variables) => {
  const response = await mutate(CREATE_FINANCIAL_FUND, { variables })

  return response
}

export const deleteFinancialFund = async (mutate, variables) => {
  const response = await mutate(DELETE_FINANCIAL_FUND, { variables })

  return response
}

export const updateFinancialFund = async (mutate, variables) => {
  const response = await mutate(UPDATE_FINANCIAL_FUND, { variables })

  return response
}
