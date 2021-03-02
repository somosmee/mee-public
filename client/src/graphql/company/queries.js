import gql from 'graphql-tag'

import { COMPANY_ATTRIBUTES, USER_ATTRIBUTES } from 'src/graphql/fragments'

export const GET_MY_COMPANY = gql`
  query me {
    myCompany {
      ...companyAttributes
    }
  }
  ${COMPANY_ATTRIBUTES}
`

export const GET_MY_COMPANIES = gql`
  query me {
    myCompanies {
      ...companyAttributes
    }
  }
  ${COMPANY_ATTRIBUTES}
`

export const UPDATE_MY_COMPANY = gql`
  mutation($input: UpdateMyCompanyInput!) {
    updateMyCompany(input: $input) {
      ...companyAttributes
    }
  }
  ${COMPANY_ATTRIBUTES}
`

export const SIGNIN_COMPANY = gql`
  mutation($input: SigninCompanyInput!) {
    signinCompany(input: $input) {
      token
      user {
        ...userAttributes
      }
      company {
        ...companyAttributes
      }
    }
  }
  ${COMPANY_ATTRIBUTES}
  ${USER_ATTRIBUTES}
`

export const CREATE_MEMBER = gql`
  mutation($input: CreateMemberInput!) {
    createMember(input: $input) {
      ...companyAttributes
    }
  }
  ${COMPANY_ATTRIBUTES}
`

export const DELETE_MEMBER = gql`
  mutation($input: DeleteMemberInput!) {
    deleteMember(input: $input) {
      ...companyAttributes
    }
  }
  ${COMPANY_ATTRIBUTES}
`

export const ACCEPT_INVITE = gql`
  mutation($input: AcceptInviteInput!) {
    acceptInvite(input: $input) {
      token
      user {
        ...userAttributes
      }
      company {
        ...companyAttributes
      }
    }
  }

  ${COMPANY_ATTRIBUTES}
  ${USER_ATTRIBUTES}
`

export const CREATE_COMPANY = gql`
  mutation($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      ...companyAttributes
    }
  }
  ${COMPANY_ATTRIBUTES}
`
