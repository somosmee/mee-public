import gql from 'graphql-tag'

import { COMPANY_ATTRIBUTES } from 'src/graphql/fragments'

export const GET_SETTINGS = gql`
  query {
    settings @client {
      options {
        dark
        salesType
        performace
      }
    }
  }
`

export const SET_SETTINGS = gql`
  mutation($option: String!, $value: String!) {
    setSettings(option: $option, value: $value) @client
  }
`

export const CREATE_PRICE_RULE = gql`
  mutation($input: CreatePriceRuleInput!) {
    createPriceRule(input: $input) {
      ...companyAttributes
    }
  }
  ${COMPANY_ATTRIBUTES}
`

export const UPDATE_PRICE_RULE = gql`
  mutation($input: UpdatePriceRuleInput!) {
    updatePriceRule(input: $input) {
      ...companyAttributes
    }
  }
  ${COMPANY_ATTRIBUTES}
`

export const DELETE_PRICE_RULE = gql`
  mutation($input: DeletePriceRuleInput!) {
    deletePriceRule(input: $input) {
      ...companyAttributes
    }
  }
  ${COMPANY_ATTRIBUTES}
`
