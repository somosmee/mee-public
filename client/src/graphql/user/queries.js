import gql from 'graphql-tag'

import { COMPANY_ATTRIBUTES, USER_ATTRIBUTES } from 'src/graphql/fragments'

export const SIGN_IN_GOOGLE_EMPLOYER = gql`
  mutation($googleIdToken: String!, $loginUUID: String, $referral: String) {
    signinGoogleEmployer(
      googleIdToken: $googleIdToken
      loginUUID: $loginUUID
      referral: $referral
    ) {
      signup
      token
      company {
        ...companyAttributes
      }
    }
  }
  ${COMPANY_ATTRIBUTES}
`

export const SIGN_IN_GOOGLE_EMPLOYEE = gql`
  mutation($googleIdToken: String!) {
    signinGoogleEmployee(googleIdToken: $googleIdToken) {
      token
      company {
        ...companyAttributes
      }
    }
  }
  ${COMPANY_ATTRIBUTES}
`

export const GET_ME = gql`
  query me {
    me {
      ...userAttributes
    }
  }
  ${USER_ATTRIBUTES}
`

export const UPDATE_ME = gql`
  mutation($input: UpdateMeInput!) {
    updateMe(input: $input) {
      ...userAttributes
    }
  }
  ${USER_ATTRIBUTES}
`

export const SEND_PIN = gql`
  mutation sendPin($input: SendPinInput!) {
    sendPin(input: $input) {
      sent
    }
  }
`

export const SIGN_IN = gql`
  mutation signin($input: SigninInput!) {
    signin(input: $input) {
      signup
      token
      company {
        ...companyAttributes
      }
      user {
        ...userAttributes
      }
    }
  }
  ${USER_ATTRIBUTES}
  ${COMPANY_ATTRIBUTES}
`
