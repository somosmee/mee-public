import { GET_SETTINGS } from './queries'

export const setSettings = async (_, { option, value }, { cache }) => {
  const previous = cache.readQuery({ query: GET_SETTINGS })

  const data = {
    settings: {
      ...previous.settings,
      options: {
        ...previous.settings.options,
        [option]: value
      }
    }
  }

  cache.writeData({ query: GET_SETTINGS, data })
  return data.settings
}
