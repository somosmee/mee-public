import gql from 'graphql-tag'

export const GET_CART = gql`
  query {
    cart @client {
      _id
      items {
        product
        gtin
        name
        description
        price
        measurement
        ncm
        quantity
        subtotal
        note
      }
      payments {
        method
        value
        createdAt
      }
      total
      nationalId
    }
  }
`

export const RESET_CART = gql`
  mutation {
    resetCart @client
  }
`

export const INIT_CART = gql`
  mutation($input: OrderInput!) {
    initCart(input: $input) @client
  }
`

export const ADD_ITEM_TO_CART = gql`
  mutation($input: ItemInput!) {
    addItemToCart(input: $input) @client
  }
`

export const REMOVE_ITEM_FROM_CART = gql`
  mutation($index: Int!) {
    removeItemFromCart(index: $index) @client
  }
`

export const ADD_NOTE_ITEM = gql`
  mutation($index: Int!, $input: AddNoteItemInput!) {
    addNoteItem(index: $index, input: $input) @client
  }
`

export const INCREASE_QUANTITY_ITEM = gql`
  mutation($index: Int!) {
    increaseQuantity(index: $index) @client
  }
`

export const DECREASE_QUANTITY_ITEM = gql`
  mutation($index: Int!) {
    decreaseQuantity(index: $index) @client
  }
`

export const ADD_CUSTOMER_TO_CART = gql`
  mutation($nationalId: String!) {
    addCustomerToCart(nationalId: $nationalId) @client
  }
`

export const SET_QUANTITY_ITEM = gql`
  mutation($index: Int!, $quantity: Int!) {
    setQuantity(index: $index, quantity: $quantity) @client
  }
`
