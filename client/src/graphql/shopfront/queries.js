import gql from 'graphql-tag'

import { SHOPFRONT_ATTRIBUTES } from './fragments'

export const GET_SHOPFRONT = gql`
  {
    shopfront {
      ...shopfrontAttributes
    }
  }
  ${SHOPFRONT_ATTRIBUTES}
`

export const GET_SHOPFRONTS = gql`
  query($id: ID!) {
    shopfronts(id: $id) {
      ...shopfrontAttributes
    }
  }
  ${SHOPFRONT_ATTRIBUTES}
`

export const ADD_PRODUCT_SHOPFRONT = gql`
  mutation($input: AddProductShopfrontInput!) {
    addProductShopfront(input: $input) {
      ...shopfrontAttributes
    }
  }
  ${SHOPFRONT_ATTRIBUTES}
`

export const DELETE_PRODUCT_SHOPFRONT = gql`
  mutation($input: DeleteProductShopfrontInput!) {
    deleteProductShopfront(input: $input) {
      ...shopfrontAttributes
    }
  }
  ${SHOPFRONT_ATTRIBUTES}
`
