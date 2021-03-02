import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { ApolloLink, split } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { withClientState } from 'apollo-link-state'
import { WebSocketLink } from 'apollo-link-ws'
import { createUploadLink as CreateUploadLink } from 'apollo-upload-client'
import { getMainDefinition } from 'apollo-utilities'

import { resolvers, defaults } from 'src/graphql'

import { TOKEN_KEY } from 'src/utils/constants'
import { load } from 'src/utils/localStorage'

const cache = new InMemoryCache()

const filterObject = (obj, key) => {
  for (const i in obj) {
    if (!(i in obj)) continue
    if (typeof obj[i] === 'object') {
      filterObject(obj[i], key)
    } else if (i === key) {
      delete obj[key]
    }
  }
  return obj
}

const normalizeStateLink = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    operation.variables = filterObject(operation.variables, '__typename')
  }
  return forward(operation)
})

const stateLink = withClientState({ cache, defaults })

const uploadLink = CreateUploadLink({
  uri: process.env.REACT_APP_API
})

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_API_WS,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: () => {
      return { authorization: load(TOKEN_KEY) ? `Bearer ${load(TOKEN_KEY)}` : '' }
    }
  }
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  uploadLink
)

const authLink = setContext((_, { headers }) => {
  const token = load(TOKEN_KEY)
  const utcOffset = new Date().getTimezoneOffset()

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      utcOffset
    }
  }
})

const client = new ApolloClient({
  link: ApolloLink.from([normalizeStateLink, stateLink, authLink, splitLink]),
  cache,
  resolvers
})

client.onResetStore(() => {
  cache.writeData({
    data: {
      ...defaults,
      app: {
        ...defaults.app,
        logged: false,
        company: null
      }
    }
  })
})

export { client as default }
