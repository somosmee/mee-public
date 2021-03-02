export const INVOICE_ATTRIBUTES = `
  fragment invoiceAttributes on Invoice {
    status
    accessKey
    QRCode
    message
  }
`

export const ORDER_MODIFIERS_ATTRIBUTES = `
  fragment orderModifiersAttributes on ItemModifier {
    name
    price
    quantity
    totalPrice
  }
`

export const DELIVERY_ADDRESS_ATTRIBUTES = `
  fragment deliveryAddressAttributes on DeliveryAddress {
    street
    number
    complement
    district
    city
    state
    postalCode
  }
`

export const ITEM_ATTRIBUTES = `
  fragment itemAttributes on Item {
    product
    gtin
    name
    description
    ncm
    price
    measurement
    quantity
    note
    modifiers {
      ...orderModifiersAttributes
    }
  }
  ${ORDER_MODIFIERS_ATTRIBUTES}
`

export const PAYMENT_ATTRIBUTES = `
  fragment paymentAttributes on Payment {
    method
    value
    received
    prepaid
    pending
    createdAt
  }
`

export const DELIVERY_ATTRIBUTES = `
  fragment deliveryAttributes on Delivery {
    fee
    address {
      ...deliveryAddressAttributes
    }
    method
  }
  ${DELIVERY_ADDRESS_ATTRIBUTES}
`

export const IFOOD_ORDER_ATTRIBUTES = `
  fragment ifoodOrderAttributes on IfoodOrder {
    reference
    status
    customer {
      name
      phone
      taxPayerIdentificationNumber
    }
    payments {
      name
      code
      value
      prepaid
      changeFor
    }
    benefits {
      value
      sponsorshipValues {
        IFOOD
        MERCHANT
      }
      target
    }
  }
`

export const COMPANY_ADDRESS_ATTRIBUTES = `
  fragment companyAddressAttributes on CompanyAddress {
    street
    number
    complement
    district
    city
    state
    postalCode
  }
`

export const CUSTOMER_ADDRESS_ATTRIBUTES = `
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

export const CUSTOMER_ATTRIBUTES = `
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
    createdAt
    updatedAt
  }
  ${CUSTOMER_ADDRESS_ATTRIBUTES}
`

export const ORDER_ATTRIBUTES = `
  fragment orderAttributes on Order {
    _id
    title
    status
    total
    subtotal
    totalPaid
    shortID
    customerName
    requireConfirmation
    shouldGenerateInvoice
    company {
      name
      nationalId
      address {
        ...companyAddressAttributes
      }
    }
    items {
      ...itemAttributes
    }
    customer {
      ...customerAttributes
    }
    payments {
      ...paymentAttributes
    }
    delivery {
      ...deliveryAttributes
    }
    origin
    ifood {
      ...ifoodOrderAttributes
    }
    invoice {
      ...invoiceAttributes
    }
    createdAt
    updatedAt
  }
  ${COMPANY_ADDRESS_ATTRIBUTES}
  ${ITEM_ATTRIBUTES}
  ${CUSTOMER_ATTRIBUTES}
  ${PAYMENT_ATTRIBUTES}
  ${DELIVERY_ATTRIBUTES}
  ${IFOOD_ORDER_ATTRIBUTES}
  ${INVOICE_ATTRIBUTES}
`

const PAGINATION_ATTRIBUTES = `
  fragment paginationAttributes on Pagination {
    page
    offset
    totalPages
    totalItems
  }
`

export const CREATE_ORDER = `
  mutation ($nationalId: String, $input: CreateOrderInput!) {
    createOrder(nationalId: $nationalId, input: $input) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const UPDATE_ORDER = `
mutation ($id: ID!, $input: UpdateOrderInput!) {
   updateOrder(id: $id, input: $input) {
     ...orderAttributes
   }
 }
 ${ORDER_ATTRIBUTES}
`

export const ADD_PAYMENT = `
  mutation ($id: ID!, $input: PaymentInput!) {
    addPayment(id: $id, input: $input) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const GET_ORDERS = `
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

export const CLOSE_ORDER = `
  mutation($id: ID!) {
    closeOrder(id: $id) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const CANCEL_ORDER = `
  mutation($input: CancelOrderInput!) {
    cancelOrder(input: $input) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const UPDATE_ORDER_INVOICE = `
mutation updateOrderInvoice($id: ID!, $status: SalesInvoiceStatus!, $message: String) {
    updateOrderInvoice(
        id: $id,
        status: $status,
        message: $message
    ) {
        _id
        invoice {
          status
          accessKey
          QRCode
        }
      }
  }`

export const UPDATE_MY_COMPANY = `
  mutation($input: UpdateMyCompanyInput!) {
    updateMyCompany(input: $input) {
      _id
      paymentMethods {
        id
        name
        fee
        operationType
        method
        balanceInterval
      }
    }
  }`
