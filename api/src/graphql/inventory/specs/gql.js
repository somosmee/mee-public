export const INCREASE_INVENTORY = `
  mutation($input: IncreaseInventoryInput!) {
    increaseInventory(input: $input) {
      _id
      reason
      product {
        _id
      }
      quantity
      balance
      company {
        _id
      }
      createdAt
      updatedAt
    }
  }
`

export const DECREASE_INVENTORY = `
  mutation($input: DecreaseInventoryInput!) {
    decreaseInventory(input: $input) {
      _id
      reason
      product {
        _id
      }
      quantity
      balance
      company {
        _id
      }
      createdAt
      updatedAt
    }
  }
`

export const INVENTORY_ADJUSTMENT = `
  mutation($input: InventoryAdjustmentInput!) {
    inventoryAdjustment(input: $input) {
      _id
      reason
      product {
        _id
      }
      quantity
      balance
      company {
        _id
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_INVENTORY_MOVEMENTS = `
  query($input: InventoryMovementsInput!) {
    inventoryMovements(input: $input) {
      movements {
        _id
        reason
        quantity
        balance
        product {
          _id
        }
        purchase {
          _id
        }
        company {
          _id
        }
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
