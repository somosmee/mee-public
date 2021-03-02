import gql from 'graphql-tag'

export const INVENTORY_ATTRIBUTES = gql`
  fragment inventoryAttributes on Inventory {
    _id
    reason
    quantity
    balance
    product {
      _id
      gtin
      name
      description
      measurement
      createdAt
      updatedAt
    }
    deletedAt
    createdAt
    updatedAt
  }
`
