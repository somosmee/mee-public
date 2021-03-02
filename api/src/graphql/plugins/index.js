export const basicLogging = {
  requestDidStart({ queryString, parsedQuery, variables }) {
    if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'development') {
      const query = queryString

      if (query && !query.includes('__schema')) {
        // logger.debug(query)
        // logger.debug(`VARIABLES ${JSON.stringify(variables || {}, null, 2)}`)
      }
    }
  },
  willSendResponse({ graphqlResponse }) {
    if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'development') {
      // logger.debug(`RESPONSE:  ${JSON.stringify(graphqlResponse, null, 2)}`)
    }
  }
}
