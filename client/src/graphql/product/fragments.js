import gql from 'graphql-tag'

export const PRODUCT_MODIFIERS_ATTRIBUTES = gql`
  fragment productModifiersAttributes on ProductModifier {
    id
    name
    price
  }
`

export const PRODUCT_BUNDLE_ATTRIBUTES = gql`
  fragment productBundleAttributes on ProductBundle {
    product
    quantity
    name
    gtin
  }
`

export const PRODUCT_ATTRIBUTES = gql`
  fragment productAttributes on Product {
    _id
    gtin
    name
    description
    image
    balance
    price
    measurement
    ncm
    confidence
    modifiers {
      ...productModifiersAttributes
    }
    bundle {
      ...productBundleAttributes
    }
    internal
    productionLine
    deletedAt
    createdAt
    updatedAt
  }
  ${PRODUCT_MODIFIERS_ATTRIBUTES}
  ${PRODUCT_BUNDLE_ATTRIBUTES}
`

export const PRODUCT_BY_GTIN_ATTRIBUTES = gql`
  fragment productGTINAttributes on ProductUniversal {
    _id
    gtin
    name
    description
    measurement
    ncm
    deletedAt
    createdAt
    updatedAt
  }
`
