import FormData from 'form-data'

import axios from 'src/ifood/axios'

// Handle axios errrors: https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253

const getToken = async (username, password) => {
  const form = new FormData()
  form.append('client_id', process.env.IFOOD_CLIENT_ID)
  form.append('client_secret', process.env.IFOOD_CLIENT_SECRET)
  form.append('grant_type', process.env.IFOOD_GRANT_TYPE)
  form.append('username', username)
  form.append('password', password)

  const config = {
    headers: form.getHeaders()
  }

  return axios.post('/oauth/token', form, config)
}

const getEvents = async (token) => {
  const config = {
    headers: { Authorization: token }
  }

  return axios.get('/v1.0/events:polling', config)
}

const eventsAcknowledgment = async (token, ids) => {
  const config = {
    headers: { Authorization: token, 'Cache-Control': 'no-cache' }
  }

  return axios.post('/v1.0/events/acknowledgment', ids, config)
}

const getOrder = async (token, reference) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.get(`/v3.0/orders/${reference}`, config)
  return response
}

const orderIntegration = async (token, reference) => {
  const config = {
    headers: { Authorization: token }
  }

  return axios.post(`/v1.0/orders/${reference}/statuses/integration`, null, config)
}

const orderConfirmation = async (token, reference) => {
  const config = {
    headers: { Authorization: token }
  }

  return axios.post(`/v1.0/orders/${reference}/statuses/confirmation`, null, config)
}

const orderDispatch = async (token, reference) => {
  const config = {
    headers: { Authorization: token }
  }

  return axios.post(`/v1.0/orders/${reference}/statuses/dispatch`, null, config)
}

const orderCancellationRequest = async (token, reference, data) => {
  const config = { headers: { Authorization: token } }

  return axios.post(`/v3.0/orders/${reference}/statuses/cancellationRequested`, data, config)
}

const createCategory = async (token, data) => {
  const config = { headers: { Authorization: token } }

  return axios.post('/v1.0/categories', data, config)
}

const updateCategory = async (token, data) => {
  const config = { headers: { Authorization: token } }

  return axios.put('/v1.0/categories', data, config)
}

const deleteCategory = async (token, data) => {
  const config = { headers: { Authorization: token } }

  return axios.put('/v1.0/categories', data, config)
}

const getCategories = async (token, merchantId) => {
  const config = { headers: { Authorization: token } }

  return axios.get(`/v1.0/merchants/${merchantId}/menus/categories`, config)
}

const getCategory = async (token, merchantId, categoryId) => {
  const config = { headers: { Authorization: token } }

  return axios.get(`/v1.0/merchants/${merchantId}/menus/categories/${categoryId}`, config)
}

const getItem = async (token, merchantId, skuId) => {
  const config = { headers: { Authorization: token } }

  return axios.get(`/v1.0/merchants/${merchantId}/skus/${skuId}/option_groups`, config)
}

const createItem = async (token, form) => {
  const config = { headers: { Authorization: token, ...form.getHeaders() } }

  return axios.post('/v1.0/skus', form, config)
}

const linkItem = async (token, categoryExternalCode, data) => {
  const config = { headers: { Authorization: token } }

  return axios.post(`/v1.0/categories/${categoryExternalCode}/skus:link`, data, config)
}

const unlinkItem = async (token, categoryExternalCode, data) => {
  const config = { headers: { Authorization: token } }

  return axios.post(`/v1.0/categories/${categoryExternalCode}/skus:unlink`, data, config)
}

const updateItemStatus = async (token, merchantId, externalCode, data) => {
  const config = { headers: { Authorization: token } }

  return axios.patch(`/v1.0/merchants/${merchantId}/skus/${externalCode}`, data, config)
}

const createOptionGroup = async (token, data) => {
  const config = { headers: { Authorization: token } }

  return axios.post('/v1.0/option-groups', data, config)
}

const updateOptionGroup = async (token, optionGroupExternalCode, data) => {
  const config = { headers: { Authorization: token } }

  return axios.put(`/v1.0/option-groups/${optionGroupExternalCode}`, data, config)
}

const linkOptionGroupItem = async (token, optionGroupExternalCode, data) => {
  const config = { headers: { Authorization: token } }

  return axios.post(`/v1.0/option-groups/${optionGroupExternalCode}/skus:link`, data, config)
}

const linkOptionGroupCategory = async (token, externalCode, data) => {
  const config = { headers: { Authorization: token } }

  return axios.post(`v1.0/skus/${externalCode}/option-groups:link`, data, config)
}

export default {
  getToken,
  getEvents,
  eventsAcknowledgment,
  getOrder,

  orderIntegration,
  orderConfirmation,
  orderDispatch,
  orderCancellationRequest,

  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategory,
  getItem,

  createItem,
  linkItem,
  unlinkItem,
  updateItemStatus,

  createOptionGroup,
  updateOptionGroup,
  linkOptionGroupItem,
  linkOptionGroupCategory
}
