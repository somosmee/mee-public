import { GET_SEARCH } from './queries'

export const updateSearch = async (_, { input }, { cache }) => {
  const previous = cache.readQuery({ query: GET_SEARCH })
  const data = { search: { ...previous.search, ...input } }
  cache.writeData({ query: GET_SEARCH, data })
  return data.search
}
