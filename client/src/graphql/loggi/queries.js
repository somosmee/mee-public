import gql from 'graphql-tag'

import { COMPANY_ATTRIBUTES } from 'src/graphql/fragments'

export const UPDATE_LOGGI_CREDENTIALS = gql`
  mutation($input: UpdateCredentialsLoggiInput!) {
    updateCredentialsLoggi(input: $input) {
      ...companyAttributes
    }
  }
  ${COMPANY_ATTRIBUTES}
`

export const GET_ALL_SHOPS = gql`
  query {
    allShopsLoggi {
      edges {
        node {
          name
          pickupInstructions
          pk
          externalId
          address {
            pos
            addressSt
            addressData
          }
          chargeOptions {
            label
          }
        }
      }
    }
  }
`

export const GET_ALL_PACKAGES = gql`
  query($input: AllPackagesInput!) {
    allPackagesLoggi(input: $input) {
      edges {
        node {
          pk
          status
          orderId
          orderStatus
          isRemovable
          trackingKey
        }
      }
    }
  }
`

export const CREATE_ORDER = gql`
  mutation($input: CreateOrderLoggiInput!) {
    createOrderLoggi(input: $input) {
      pk
    }
  }
`
