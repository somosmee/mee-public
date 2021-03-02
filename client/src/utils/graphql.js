import { GraphQLClient } from 'graphql-request'

const client = new GraphQLClient(process.env.REACT_APP_API)

export default client
