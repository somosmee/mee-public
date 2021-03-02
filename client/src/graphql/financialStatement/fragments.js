import gql from 'graphql-tag'

export const FINANCIAL_STATEMENT_ATTRIBUTES = gql`
  fragment financialStatementAttributes on FinancialStatement {
    _id
    order
    purchase
    value
    paid
    dueAt
    operation
    description
    category
  }
`
