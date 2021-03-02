import gql from 'graphql-tag'

export const GET_APP = gql`
  query {
    app @client {
      logged
      signup
      openDrawer
      openDrawerMobile
      drawer {
        accountant
        billing
        sales
        customers
        myStore
        orders
        integrations
        finance
        inventory
        products
        purchases
        reports
        suppliers
        tags
      }
      openProductDialog
      openNewUpdates
      openSignout
      notification {
        newOrder
      }
    }
  }
`

export const UPDATE_APP = gql`
  mutation($input: UpdateAppInput!) {
    updateApp(input: $input) @client
  }
`

export const OPEN_SIGNOUT = gql`
  mutation {
    openSignout @client
  }
`

export const CLOSE_SIGNOUT = gql`
  mutation {
    closeSignout @client
  }
`
