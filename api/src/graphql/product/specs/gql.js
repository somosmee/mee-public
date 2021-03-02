export const CREATE_PRODUCT = `
  mutation createProduct($input: CreateProductInput!){
    createProduct(input: $input) {
      internal
      gtin
      name
      balance
      price
      measurement
      tax {
        icmsOrigin
        icmsTaxPercentage
      }
      modifiers {
        id
        name
        price
      }
      bundle {
        product
        quantity
        name
        gtin
      }
    }
  }
`
export const UPDATE_PRODUCT = `
mutation updateProduct($input: UpdateProductInput!){
  updateProduct(input: $input) {
    internal
    gtin
    name
    balance
    price
    measurement
    tax {
      icmsOrigin
      icmsTaxPercentage
    }
    modifiers {
      id
      name
      price
    }
    bundle {
      product
      quantity
      name
      gtin
    }
  }
}
`

export const GET_PRODUCTS = `
  query($input: ProductsInput) {
    products(input: $input) {
      products {
        _id
        gtin
        name
        description
        balance
        price
        measurement
        ncm
        tax {
          icmsOrigin
          icmsTaxPercentage
        }
        modifiers {
          id
          name
          price
        }
        internal
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
