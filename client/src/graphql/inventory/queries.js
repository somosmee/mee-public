import gql from 'graphql-tag'

import { PAGINATION_ATTRIBUTES } from 'src/graphql/fragments'

import { INVENTORY_ATTRIBUTES } from './fragments'

export const INVENTORY_ADJUSTMENT = gql`
  mutation($input: InventoryAdjustmentInput!) {
    inventoryAdjustment(input: $input) {
      ...inventoryAttributes
    }
  }
  ${INVENTORY_ATTRIBUTES}
`

export const GET_INVENTORY_MOVEMENTS = gql`
  query($input: InventoryMovementsInput!) {
    inventoryMovements(input: $input) {
      movements {
        ...inventoryAttributes
      }
      pagination {
        ...paginationAttributes
      }
    }
  }
  ${INVENTORY_ATTRIBUTES}
  ${PAGINATION_ATTRIBUTES}
`
