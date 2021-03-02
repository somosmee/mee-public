import gql from 'graphql-tag'

export const GET_NOTIFICATION = gql`
  query {
    notification @client {
      open,
      variant,
      message
    }
  }
`

export const OPEN_NOTIFICATION = gql`
  mutation($input: NotificationInput!) {
    openNotification(input: $input) @client
  }
`

export const CLOSE_NOTIFICATION = gql`
  mutation {
    closeNotification @client
  }
`

export const CLEAR_NOTIFICATION = gql`
  mutation {
    clearNotification @client
  }
`
