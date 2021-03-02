import gql from 'graphql-tag'

import { COMPANY_ATTRIBUTES } from 'src/graphql/fragments'

export const DELETE_FINANCIAL_STATEMENT_CATEGORY = gql`
  mutation($input: DeleteFinancialStatementCategoryInput!) {
    deleteFinancialStatementCategory(input: $input) {
      ...companyAttributes
    }
  }
  ${COMPANY_ATTRIBUTES}
`
