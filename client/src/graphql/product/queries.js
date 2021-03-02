import gql from 'graphql-tag'

import { PRODUCT_ATTRIBUTES, PRODUCT_BY_GTIN_ATTRIBUTES } from 'src/graphql/product/fragments'

export const GET_PRODUCT = gql`
  query($input: ProductInput!) {
    product(input: $input) {
      ...productAttributes
    }
  }
  ${PRODUCT_ATTRIBUTES}
`

export const GET_PRODUCT_BY_GTIN = gql`
  query($input: ProductInput!) {
    productGTIN(input: $input) {
      ...productGTINAttributes
    }
  }
  ${PRODUCT_BY_GTIN_ATTRIBUTES}
`

export const GET_PRODUCTS = gql`
  query($input: ProductsInput) {
    products(input: $input) {
      products {
        ...productAttributes
      }
      pagination {
        page
        offset
        totalPages
        totalItems
      }
    }
  }
  ${PRODUCT_ATTRIBUTES}
`

export const CREATE_PRODUCT = gql`
  mutation createProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      ...productAttributes
    }
  }
  ${PRODUCT_ATTRIBUTES}
`

export const UPDATE_PRODUCT = gql`
  mutation($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      ...productAttributes
    }
  }
  ${PRODUCT_ATTRIBUTES}
`

export const SEARCH_PRODUCTS = gql`
  query searchProducts($text: String) {
    searchProducts(text: $text) {
      ...productAttributes
    }
  }
  ${PRODUCT_ATTRIBUTES}
`

export const DELETE_PRODUCT = gql`
  mutation($input: DeleteProductInput!) {
    deleteProduct(input: $input) {
      _id
    }
  }
`

export const IMPORT_PRODUCTS = gql`
  mutation($input: ImportProductsInput!) {
    importProducts(input: $input)
  }
`
