import gql from 'graphql-tag'

export const GET_SEARCH = gql`
  query {
    search @client {
      text
    }
  }
`

export const UPDATE_SEARCH = gql`
  mutation($input: UpdateSearchInput!) {
    updateSearch(input: $input) @client
  }
`
