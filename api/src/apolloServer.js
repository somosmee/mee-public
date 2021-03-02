import * as Sentry from '@sentry/node'
import { ApolloServer, PubSub } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'
import { createServer } from 'http'

import { typeDefs, resolvers, schemaDirectives } from 'src/graphql'
import { basicLogging } from 'src/graphql/plugins'

import stripe from 'src/routes/stripe'

import authenticate from 'src/utils/auth'
import logger from 'src/utils/logger'

export const pubsub = new PubSub()

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  context: async ({ req, connection }) => {
    // return connection context if it's a subscription
    const auth = await authenticate(connection || req)

    if (connection) {
      return auth
        ? {
          ...connection.context,
          ...auth,
          pubsub
        }
        : {
          ...connection.context,
          pubsub
        }
    } else {
      return auth
        ? {
          request: req,
          ...auth,
          utcOffset: req.headers?.utcoffset,
          pubsub
        }
        : {
          request: req,
          pubsub
        }
    }
  },
  subscriptions: {
    onConnect: async (connectionParams, webSocket) => {
      if (connectionParams.authorization) {
        return {
          authorization: connectionParams.authorization
        }
      }
    }
  },
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  formatError: (err) => {
    // check: https://www.apollographql.com/docs/apollo-server/data/errors/#masking-and-logging-errors
    logger.error(err)
    Sentry.captureException(err)
    return err
  },
  plugins: [basicLogging]
})

const app = express()
const router = express.Router()

app.use(cors()) // enable `cors` to set HTTP response header: Access-Control-Allow-Origin: *
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Vem pra Mee pae! 🚀')
})

// Routes
stripe(router)

app.use('/api', router)

apolloServer.applyMiddleware({ app })

export const httpServer = createServer(app)
apolloServer.installSubscriptionHandlers(httpServer)

export default { apolloServer, httpServer }
