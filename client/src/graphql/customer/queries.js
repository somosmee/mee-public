import gql from 'graphql-tag'

import { PAGINATION_ATTRIBUTES } from 'src/graphql/fragments'

import { CUSTOMER_ATTRIBUTES } from './fragments'

export const GET_CUSTOMER = gql`
  query($input: CustomerInput!) {
    customer(input: $input) {
      ...customerAttributes
    }
  }
  ${CUSTOMER_ATTRIBUTES}
`

export const GET_CUSTOMERS = gql`
  query customers($input: CustomersInput) {
    customers(input: $input) {
      customers {
        ...customerAttributes
      }
      pagination {
        ...paginationAttributes
      }
    }
  }
  ${CUSTOMER_ATTRIBUTES}
  ${PAGINATION_ATTRIBUTES}
`

export const CREATE_CUSTOMER = gql`
  mutation($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      ...customerAttributes
    }
  }
  ${CUSTOMER_ATTRIBUTES}
`

export const UPDATE_CUSTOMER = gql`
  mutation($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      ...customerAttributes
    }
  }
  ${CUSTOMER_ATTRIBUTES}
`

export const DELETE_CUSTOMER = gql`
  mutation($input: DeleteCustomerInput!) {
    deleteCustomer(input: $input) {
      ...customerAttributes
    }
  }
  ${CUSTOMER_ATTRIBUTES}
`

export const CREATE_CUSTOMER_ADDRESS = gql`
  mutation($input: CreateCustomerAddressInput!) {
    createCustomerAddress(input: $input) {
      ...customerAttributes
    }
  }
  ${CUSTOMER_ATTRIBUTES}
`

export const UPDATE_CUSTOMER_ADDRESS = gql`
  mutation($input: UpdateCustomerAddressInput!) {
    updateCustomerAddress(input: $input) {
      ...customerAttributes
    }
  }
  ${CUSTOMER_ATTRIBUTES}
`

export const DELETE_CUSTOMER_ADDRESS = gql`
  mutation($input: DeleteCustomerAddressInput!) {
    deleteCustomerAddress(input: $input) {
      ...customerAttributes
    }
  }
  ${CUSTOMER_ATTRIBUTES}
`
export const SEARCH_CUSTOMERS = gql`
  query($text: String) {
    searchCustomers(text: $text) {
      ...customerAttributes
    }
  }
  ${CUSTOMER_ATTRIBUTES}
`
