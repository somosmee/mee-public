import 'src/google/cloud-storage'
import { apolloServer, httpServer } from 'src/apolloServer'

import 'src/utils/prototypes'
import logger from 'src/utils/logger'

const PORT = process.env.PORT || 4000

httpServer.listen({ port: PORT }, () => {
  logger.debug(`NODE_ENV: ${process.env.NODE_ENV}`)
  logger.debug(`MONGODB_HOST: ${process.env.MONGODB_HOST}`)
  logger.debug(`MONGODB_DATABASE: ${process.env.MONGODB_DATABASE}`)
  logger.debug(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`)
  logger.debug(`🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`)
})
