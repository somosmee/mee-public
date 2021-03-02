export const CREATE_PRODUCT = `
  mutation createProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      internal
      name
      description
      price
      measurement
    }
  }
`
