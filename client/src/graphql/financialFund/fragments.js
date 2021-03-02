import gql from 'graphql-tag'

export const FINANCIAL_FUND_ATTRIBUTES = gql`
  fragment financialFundAttributes on FinancialFund {
    id
    name
    category
    balance
    hasOpenedRegister
  }
`
