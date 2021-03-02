import gql from 'graphql-tag'

export const CUSTOMER_ADDRESS_ATTRIBUTES = gql`
  fragment customerAddressAttributes on CustomerAddress {
    _id
    street
    number
    complement
    district
    city
    state
    postalCode
  }
`

export const CUSTOMER_ATTRIBUTES = gql`
  fragment customerAttributes on Customer {
    _id
    email
    nationalId
    firstName
    lastName
    birthday
    mobile
    receiveOffers
    addresses {
      ...customerAddressAttributes
    }
    business {
      nationalId
      name
    }
    deletedAt
  }
  ${CUSTOMER_ADDRESS_ATTRIBUTES}
`
