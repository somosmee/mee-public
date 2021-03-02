import gql from 'graphql-tag'

export const SHOPFRONT_ADDRESS_ATTRIBUTES = gql`
  fragment shopfrontAddressAttributes on ShopfrontAddress {
    street
    number
    complement
    district
    city
    state
    postalCode
    lat
    lng
  }
`

export const SHOPFRONT_ATTRIBUTES = gql`
  fragment shopfrontAttributes on Shopfront {
    _id
    merchant
    banner
    picture
    name
    address {
      ...shopfrontAddressAttributes
    }
    products {
      _id
      name
      description
      image
      price
    }
    delivery {
      fee
      distance
      condition
    }
  }
  ${SHOPFRONT_ADDRESS_ATTRIBUTES}
`
