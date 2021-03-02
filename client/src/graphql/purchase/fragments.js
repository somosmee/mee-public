import gql from 'graphql-tag'

export const INVOICE_ATTRIBUTES = gql`
  fragment invoiceAttributes on Invoice {
    accessKey
  }
`
