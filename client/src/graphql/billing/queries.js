import { graphql } from 'react-apollo'

import client from 'src/apollo'

import { GET_APP } from 'src/graphql/app/queries'

import { SUBSCRIBE_PLAN, CREATE_SESSION } from './gqls'

export const subscribePlan = graphql(SUBSCRIBE_PLAN, {
  name: 'subscribePlan',
  options: (props) => ({
    update: (proxy, { data }) => {
      client.writeQuery({ query: GET_APP })
    }
  })
})

export const createSession = graphql(CREATE_SESSION, {
  name: 'createSession'
})
