export const USER_ATTRIBUTES = `
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

export const COMPANY_ADDRESS_ATTRIBUTES = `
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

export const COMPANY_ATTRIBUTES = `
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
        name
        fee
        operationType
        enabled
      }
    }
    members {
      _id
      user {
        ...userAttributes
      }
      role
    }
    productionLines {
      _id
      name
    }
  }
  ${USER_ATTRIBUTES}
  ${COMPANY_ADDRESS_ATTRIBUTES}
`

export const SIGN_IN_GOOGLE_EMPLOYER = `
  mutation($googleIdToken: String!, $loginUUID: String, $referral: String) {
    signinGoogleEmployer(
      googleIdToken: $googleIdToken
      loginUUID: $loginUUID
      referral: $referral
    ) {
      signup
      token
      user {
        name
        email
        referral
      }
    }
  }
`

export const CREATE_PRICE_RULE = `
  mutation($input: CreatePriceRuleInput!) {
    createPriceRule(input: $input) {
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
          name
          fee
          operationType
          enabled
        }
      }
    }
  }
`

export const UPDATE_PRICE_RULE = `
  mutation($input: UpdatePriceRuleInput!) {
    updatePriceRule(input: $input) {
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
          name
          fee
          operationType
          enabled
        }
      }
    }
  }
`

export const DELETE_PRICE_RULE = `
  mutation($input: DeletePriceRuleInput!) {
    deletePriceRule(input: $input) {
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
          name
          fee
          operationType
          enabled
        }
      }
    }
  }
`

export const SEND_PIN = `
  mutation($input: SendPinInput!) {
    sendPin(input: $input) {
      sent
    }
  }
`

export const SIGN_IN = `
mutation($input: SigninInput!) {
    signin(input: $input) {
        token
        signup
        user {
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
        company {
          _id
          number
          nationalId
          stateId
          createdBy {
            _id
            email
          }
          members {
            _id
            user {
              _id
              email
            }
            role
          }
      }
    }
  }
`
