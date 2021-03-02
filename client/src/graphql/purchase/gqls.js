import gql from 'graphql-tag'

import { INVOICE_ATTRIBUTES } from './fragments'

export const GET_PURCHASE = gql`
  query($id: ID, $accessKey: String) {
    purchase(id: $id, accessKey: $accessKey) {
      _id
      accessKey
      serie
      number
      status
      total
      purchasedAt
      invoice {
        ...invoiceAttributes
      }
      items {
        _id
        product
        gtin
        name
        quantity
        measurement
        ncm
        unitPrice
        totalPrice
        status
      }
      supplier {
        _id
        nationalId
        displayName
        name
      }
    }
  }
  ${INVOICE_ATTRIBUTES}
`

export const GET_PURCHASES = gql`
  query($input: PurchasesInput) {
    purchases(input: $input) {
      purchases {
        _id
        accessKey
        serie
        number
        status
        total
        purchasedAt
        invoice {
          ...invoiceAttributes
        }
        items {
          _id
          product
          gtin
          name
          quantity
          measurement
          ncm
          unitPrice
          totalPrice
          status
        }
        supplier {
          _id
          nationalId
          displayName
          name
        }
      }
      pagination {
        page
        offset
        totalPages
        totalItems
      }
    }
  }
  ${INVOICE_ATTRIBUTES}
`

export const ADD_PURCHASE = gql`
  mutation($accessKey: String!) {
    addPurchase(accessKey: $accessKey) {
      _id
      accessKey
      serie
      number
      purchasedAt
      status
      total
      invoice {
        ...invoiceAttributes
      }
      items {
        _id
        product
        gtin
        name
        quantity
        measurement
        ncm
        unitPrice
        totalPrice
        status
      }
    }
  }
  ${INVOICE_ATTRIBUTES}
`

export const CREATE_PURCHASE_ITEM = gql`
  mutation($id: ID!, $input: CreatePurchaseItemInput!) {
    createPurchaseItem(id: $id, input: $input) {
      _id
      accessKey
      serie
      number
      purchasedAt
      status
      total
      invoice {
        ...invoiceAttributes
      }
      items {
        _id
        product
        gtin
        name
        quantity
        measurement
        ncm
        unitPrice
        totalPrice
        status
      }
    }
  }
  ${INVOICE_ATTRIBUTES}
`

export const UPDATE_PURCHASE_ITEM = gql`
  mutation($id: ID!, $item: ID!, $input: UpdatePurchaseItemInput!) {
    updatePurchaseItem(id: $id, item: $item, input: $input) {
      _id
      accessKey
      serie
      number
      purchasedAt
      status
      total
      invoice {
        ...invoiceAttributes
      }
      items {
        _id
        product
        gtin
        name
        quantity
        measurement
        ncm
        unitPrice
        totalPrice
        status
      }
    }
  }
  ${INVOICE_ATTRIBUTES}
`

export const IMPORT_PURCHASE_ITEMS = gql`
  mutation($id: ID!) {
    importPurchaseItems(id: $id) {
      _id
      accessKey
      serie
      number
      purchasedAt
      status
      total
      invoice {
        ...invoiceAttributes
      }
      items {
        _id
        product
        gtin
        name
        quantity
        measurement
        ncm
        unitPrice
        totalPrice
        status
      }
    }
  }
  ${INVOICE_ATTRIBUTES}
`

export const ADD_MANUAL_PURCHASE = gql`
  mutation($input: PurchaseInput!) {
    addManualPurchase(input: $input) {
      _id
      purchasedAt
      status
      total
      invoice {
        ...invoiceAttributes
      }
      items {
        _id
        product
        gtin
        name
        quantity
        measurement
        ncm
        unitPrice
        totalPrice
        status
      }
    }
  }
  ${INVOICE_ATTRIBUTES}
`
