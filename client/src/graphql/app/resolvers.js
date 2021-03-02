import { GET_APP } from './queries'

export const updateApp = async (_, { input }, { cache }) => {
  const previous = cache.readQuery({ query: GET_APP })
  const data = { app: { ...previous.app, ...input } }
  cache.writeData({ query: GET_APP, data })
  return null
}
