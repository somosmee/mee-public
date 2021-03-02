import gql from 'graphql-tag'

export const GET_CART = gql`
  query {
    shopfrontCart @client {
      items {
        _id
        image
        name
        note
        description
        price
        quantity
        subtotal
      }
      payments {
        method
        received
      }
      delivery {
        fee
        method
        address {
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
      }
      subtotal
      nationalId
    }
  }
`

export const RESET_CART = gql`
  mutation {
    resetSFCart @client
  }
`

export const ADD_ITEM_CART = gql`
  mutation($input: AddItemCartInput!) {
    addItemCart(input: $input) @client
  }
`

export const REMOVE_ITEM_CART = gql`
  mutation($input: RemoveItemCartInput!) {
    removeItemCart(input: $input) @client
  }
`

export const INCREASE_ITEM = gql`
  mutation($index: Int!) {
    increaseItemCart(index: $index) @client
  }
`

export const DECREASE_ITEM = gql`
  mutation($index: Int!) {
    decreaseItemCart(index: $index) @client
  }
`

export const ADD_PAYMENT_CART = gql`
  mutation($input: AddPaymentMethodCartInput!) {
    addPaymentCart(input: $input) @client
  }
`

export const ADD_FEDERAL_TAX_NUMBER_CART = gql`
  mutation($input: AddFederalTaxNumberCartInput!) {
    addFederalTaxNumberCart(input: $input) @client
  }
`

export const DELETE_FEDERAL_TAX_NUMBER_CART = gql`
  mutation {
    deleteFederalTaxNumberCart @client
  }
`

export const UPDATE_QUANTITY_ITEM_CART = gql`
  mutation($input: ItemInput!) {
    updateQuantityItemCart(input: $input) @client
  }
`

export const UPDATE_DELIVERY_CART = gql`
  mutation($input: UpdateDeliveryCartInput!) {
    updateDeliveryCart(input: $input) @client
  }
`
