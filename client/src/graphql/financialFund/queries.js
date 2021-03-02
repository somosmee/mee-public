import gql from 'graphql-tag'

import { FINANCIAL_FUND_ATTRIBUTES } from './fragments'

export const GET_FINANCIAL_FUNDS = gql`
  query($input: FinancialFundsInput) {
    financialFunds(input: $input) {
      ...financialFundAttributes
    }
  }
  ${FINANCIAL_FUND_ATTRIBUTES}
`

export const CREATE_FINANCIAL_FUND = gql`
  mutation($input: CreateFinancialFundInput!) {
    createFinancialFund(input: $input) {
      ...financialFundAttributes
    }
  }
  ${FINANCIAL_FUND_ATTRIBUTES}
`

export const UPDATE_FINANCIAL_FUND = gql`
  mutation($input: UpdateFinancialFundInput!) {
    updateFinancialFund(input: $input) {
      ...financialFundAttributes
    }
  }
  ${FINANCIAL_FUND_ATTRIBUTES}
`

export const DELETE_FINANCIAL_FUND = gql`
  mutation($input: DeleteFinancialFundInput!) {
    deleteFinancialFund(input: $input) {
      id
    }
  }
`

export const ADJUST_FINANCIAL_FUND = gql`
  mutation adjustFinancialFund($input: AdjustFinancialFundInput!) {
    adjustFinancialFund(input: $input) {
      ...financialFundAttributes
    }
  }
  ${FINANCIAL_FUND_ATTRIBUTES}
`
