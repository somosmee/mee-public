import gql from 'graphql-tag'

import { PAGINATION_ATTRIBUTES } from 'src/graphql/fragments'
import { ORDER_ATTRIBUTES } from 'src/graphql/order/fragments'
import { PRODUCT_ATTRIBUTES } from 'src/graphql/product/fragments'

export const ORDER_SUBSCRIPTION = gql`
  subscription($input: OrderInput) {
    order(input: $input) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const GET_ORDER = gql`
  query($id: ID!) {
    order(id: $id) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const GET_ORDER_PREVIEW = gql`
  query($id: ID!) {
    orderPreview(id: $id) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const CREATE_ORDER = gql`
  mutation createOrder($nationalId: String, $input: CreateOrderInput!) {
    createOrder(nationalId: $nationalId, input: $input) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const UPDATE_ORDER = gql`
  mutation updateOrder($id: ID!, $input: UpdateOrderInput!) {
    updateOrder(id: $id, input: $input) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const ADD_ITEMS = gql`
  mutation addItems($id: ID!, $input: AddItemsInput!) {
    addItems(id: $id, input: $input) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const ADD_ITEM_ORDER = gql`
  mutation($id: ID!, $input: AddItemOrderInput!) {
    addItemOrder(id: $id, input: $input) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const DELETE_ITEM_ORDER = gql`
  mutation($id: ID!, $input: DeleteItemOrderInput!) {
    deleteItemOrder(id: $id, input: $input) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const ADD_PAYMENT = gql`
  mutation($id: ID!, $input: PaymentInput!) {
    addPayment(id: $id, input: $input) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const CANCEL_ORDER = gql`
  mutation($input: CancelOrderInput!) {
    cancelOrder(input: $input) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const CONFIRM_ORDER = gql`
  mutation($input: ConfirmOrderInput!) {
    confirmOrder(input: $input) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const CLOSE_ORDER = gql`
  mutation($id: ID!) {
    closeOrder(id: $id) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const GENERATE_INVOICE = gql`
  mutation($id: ID!) {
    generateInvoice(id: $id) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const SEND_INVOICE_EMAIL = gql`
  mutation($input: InvoiceEmailInput!) {
    sendInvoiceEmail(input: $input) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const ORDERS = gql`
  query($input: OrdersInput) {
    orders(input: $input) {
      orders {
        ...orderAttributes
      }
      pagination {
        ...paginationAttributes
      }
    }
  }
  ${ORDER_ATTRIBUTES}
  ${PAGINATION_ATTRIBUTES}
`

export const SEARCH_ORDERS = gql`
  query searchOrders($text: String) {
    searchOrders(text: $text) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const CREATE_ORDER_SHOPFRONT = gql`
  mutation($input: CreateOrderShopfrontInput!) {
    createOrderShopfront(input: $input) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const GET_DELIVERY_DETAILS = gql`
  query($input: DeliveryDetailsInput!) {
    getDeliveryDetails(input: $input) {
      fee
      distance
    }
  }
`

export const GET_SUGGESTIONS = gql`
  query($input: SuggestionsInput!) {
    getSuggestions(input: $input) {
      ...productAttributes
    }
  }
  ${PRODUCT_ATTRIBUTES}
`

export const DOWNLOAD_INVOICES = gql`
  mutation($input: DownloadInvoicesInput!) {
    downloadInvoices(input: $input)
  }
`
