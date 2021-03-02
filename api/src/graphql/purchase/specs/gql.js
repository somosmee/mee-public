export const GET_PURCHASES = `
  query($input: PurchasesInput) {
    purchases(input: $input) {
      purchases {
        _id
        accessKey
        serie
        number
        status
        purchasedAt
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
`

export const ADD_MANUAL_PURCHASE = `
  mutation($input: PurchaseInput!) {
    addManualPurchase(input: $input) {
      _id
      purchasedAt
      status
      supplier {
        _id
      }
      company {
        _id
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
      total
    }
  }
`
