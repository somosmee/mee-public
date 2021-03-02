import gql from 'graphql-tag'

import { FINANCIAL_FUND_ATTRIBUTES } from 'src/graphql/financialFund/fragments'

export const USER_ATTRIBUTES = gql`
  fragment userAttributes on User {
    _id
    email
    name
    role
    createdAt
    updatedAt
    onboarding {
      finishedAddProduct
      finishedAddOrder
      finishedCloseOrder
    }
  }
`

export const COMPANY_ADDRESS_ATTRIBUTES = gql`
  fragment companyAddressAttributes on CompanyAddress {
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

export const COMPANY_ATTRIBUTES = gql`
  fragment companyAttributes on Company {
    _id
    createdBy {
      ...userAttributes
    }
    number
    name
    nationalId
    stateId
    description
    banner
    picture
    certificate {
      name
    }
    stripeCustomerId
    card {
      id
      brand
      expMonth
      expYear
      funding
      last4
    }
    subscription {
      status
      paymentStatus
      plan {
        id
      }
    }
    address {
      ...companyAddressAttributes
    }
    paymentMethods {
      id
      name
      fee
      operationType
      method
      balanceInterval
      financialFund {
        ...financialFundAttributes
      }
    }
    purchasePaymentMethods {
      id
      name
      fee
      operationType
      method
      closingDay
      paymentDay
      financialFund {
        ...financialFundAttributes
      }
    }
    expenseCategories {
      id
      name
      color
    }
    incomeCategories {
      id
      name
      color
    }
    ifood {
      open
      merchant
      username
      password
    }
    loggi {
      username
      password
    }
    tax {
      regime
      icmsOrigin
      icmsCSOSN
      pisCofinsTaxGroup
      icmsRegime
      icmsTaxGroup
      incidenceRegime
    }
    settings {
      priceRules {
        _id
        name
        amount
        operationType
        channels
        active
      }
      delivery {
        fee
        distance
        condition
      }
      fees {
        _id
        name
        fee
        operationType
        enabled
      }
      forceOpenRegister
    }
    members {
      _id
      user {
        ...userAttributes
      }
      status
      role
    }
    productionLines {
      _id
      name
    }
    financialFunds {
      ...financialFundAttributes
    }
  }
  ${FINANCIAL_FUND_ATTRIBUTES}
  ${USER_ATTRIBUTES}
  ${COMPANY_ADDRESS_ATTRIBUTES}
`

export const PAGINATION_ATTRIBUTES = gql`
  fragment paginationAttributes on Pagination {
    page
    offset
    totalPages
    totalItems
  }
`
