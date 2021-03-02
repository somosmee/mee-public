import gql from 'graphql-tag'

export const GET_SUPPLIERS = gql`
  query($input: SuppliersInput) {
    suppliers(input: $input) {
      suppliers {
        _id
        nationalId
        displayName
        name
        url
        phone
        description
        deletedAt
        createdAt
        updatedAt
      }
      pagination {
        page
        offset
        totalPages
        totalItems
      }
    }
  }
`

export const GET_SUPPLIER = gql`
  query($id: ID!) {
    supplier(id: $id) {
      _id
      nationalId
      displayName
      name
      url
      phone
      description
      deletedAt
      createdAt
      updatedAt
    }
  }
`

export const CREATE_SUPPLIER = gql`
  mutation($input: CreateSupplierInput!) {
    createSupplier(input: $input) {
      _id
      nationalId
      displayName
      name
      url
      phone
      description
      deletedAt
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_SUPPLIER = gql`
  mutation($id: ID!, $input: UpdateSupplierInput!) {
    updateSupplier(id: $id, input: $input) {
      _id
      nationalId
      displayName
      name
      url
      phone
      description
      deletedAt
      createdAt
      updatedAt
    }
  }
`

export const DELETE_SUPPLIER = gql`
  mutation($id: ID!) {
    deleteSupplier(id: $id) {
      _id
      nationalId
      displayName
      name
      url
      phone
      description
      deletedAt
      createdAt
      updatedAt
    }
  }
`

export const SEARCH_SUPPLIERS = gql`
  query($text: String) {
    searchSuppliers(text: $text) {
      _id
      nationalId
      displayName
      name
      url
      phone
      description
      deletedAt
      createdAt
      updatedAt
    }
  }
`
