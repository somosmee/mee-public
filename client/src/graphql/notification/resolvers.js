import defaults from './defaults'
import { GET_NOTIFICATION } from './queries'

export const openNotification = async (_, variables, { cache }) => {
  const previous = cache.readQuery({ query: GET_NOTIFICATION })
  const { input: { variant, message } } = variables
  const data = {
    notification: {
      ...previous.notification, open: true, variant, message
    }
  }
  cache.writeData({ query: GET_NOTIFICATION, data })
  return null
}

export const closeNotification = async (_, variables, { cache }) => {
  const previous = cache.readQuery({ query: GET_NOTIFICATION })
  const data = { notification: { ...previous.notification, open: false } }
  cache.writeData({ query: GET_NOTIFICATION, data })
  return null
}

export const clearNotification = async (_, variables, { cache }) => {
  const data = { notification: { ...defaults } }
  cache.writeData({ query: GET_NOTIFICATION, data })
}
