import gql from 'graphql-tag'

import { PAGINATION_ATTRIBUTES } from 'src/graphql/fragments'

import { FINANCIAL_STATEMENT_ATTRIBUTES } from './fragments'

export const GET_FINANCIAL_STATEMENTS = gql`
  query($input: FinancialStatementInput) {
    financialStatements(input: $input) {
      financialStatements {
        ...financialStatementAttributes
      }
      pagination {
        ...paginationAttributes
      }
    }
  }
  ${FINANCIAL_STATEMENT_ATTRIBUTES}
  ${PAGINATION_ATTRIBUTES}
`

export const CREATE_FINANCIAL_STATEMENT = gql`
  mutation($input: CreateFinancialStatementInput!) {
    createFinancialStatement(input: $input) {
      ...financialStatementAttributes
    }
  }
  ${FINANCIAL_STATEMENT_ATTRIBUTES}
`

export const DELETE_FINANCIAL_STATEMENT = gql`
  mutation($input: DeleteFinancialStatementInput!) {
    deleteFinancialStatement(input: $input) {
      _id
    }
  }
`
