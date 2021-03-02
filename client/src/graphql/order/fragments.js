import gql from 'graphql-tag'

import { CUSTOMER_ATTRIBUTES } from 'src/graphql/customer/fragments'
import { COMPANY_ADDRESS_ATTRIBUTES } from 'src/graphql/fragments'

export const INVOICE_ATTRIBUTES = gql`
  fragment invoiceAttributes on Invoice {
    status
    accessKey
    QRCode
    message
  }
`

export const ORDER_MODIFIERS_ATTRIBUTES = gql`
  fragment orderModifiersAttributes on ItemModifier {
    name
    price
    quantity
    totalPrice
  }
`

export const DELIVERY_ADDRESS_ATTRIBUTES = gql`
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

export const ITEM_ATTRIBUTES = gql`
  fragment itemAttributes on Item {
    product
    gtin
    name
    description
    ncm
    price
    subtotal
    measurement
    quantity
    note
    modifiers {
      ...orderModifiersAttributes
    }
    productionLine
  }
  ${ORDER_MODIFIERS_ATTRIBUTES}
`

export const PAYMENT_ATTRIBUTES = gql`
  fragment paymentAttributes on Payment {
    method
    value
    received
    prepaid
    pending
    createdAt
  }
`

export const FEE_ATTRIBUTES = gql`
  fragment feeAttributes on OrderFee {
    _id
    fee
    name
    value
  }
`

export const DELIVERY_ATTRIBUTES = gql`
  fragment deliveryAttributes on Delivery {
    fee
    address {
      ...deliveryAddressAttributes
    }
    method
  }
  ${DELIVERY_ADDRESS_ATTRIBUTES}
`

export const IFOOD_ORDER_ATTRIBUTES = gql`
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

export const ORDER_ATTRIBUTES = gql`
  fragment orderAttributes on Order {
    _id
    title
    status
    total
    discount
    totalDiscount
    totalFees
    subtotal
    totalPaid
    totalTaxes
    shortID
    customerName
    requireConfirmation
    shouldGenerateInvoice
    fees {
      ...feeAttributes
    }
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
    productionRequests {
      id
      productionLine {
        name
      }
      createdBy {
        name
        email
      }
      items {
        product
        quantity
        name
        note
      }
      createdAt
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
  ${FEE_ATTRIBUTES}
`
