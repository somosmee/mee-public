import gql from 'graphql-tag'

/* STRIPE */

export const CREATE_SUPPORT_CHECKOUT_SESSION = gql`
  mutation($input: CreateSupportCheckoutSessionInput) {
    createSupportCheckoutSession(input: $input) {
      session
    }
  }
`

export const CREATE_SETUP_SESSION = gql`
  mutation($input: CreateSetupSessionInput) {
    createSetupSession(input: $input) {
      session
    }
  }
`

export const RETRY_BILL_PAYMENT = gql`
  mutation($userBillId: ID!) {
    retryBillPayment(userBillId: $userBillId) {
      email
      billingHistory {
        items {
          order {
            _id
          }
          totalOrder
          fee
          totalFee
        }
        status
        total
      }
    }
  }
`
