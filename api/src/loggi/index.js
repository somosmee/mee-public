import axios from 'src/loggi/axios'
import validate from 'src/loggi/validate'

const login = async (email, password) => {
  if (!email) throw new Error('Email é obrigatório')
  if (!password) throw new Error('Senha é obrigatório')

  const loginQuery = `
    mutation ($input: LoginMutationInput!) {
      login(input: $input) {
        user {
          apiKey
        }
      }
    }`

  const loginVariables = `{
     "input": {
       "email": "${email}",
       "password": "${password}"
     }
   }`

  const response = await axios.post(
    '/graphql',
    JSON.stringify({
      query: loginQuery,
      variables: loginVariables
    })
  )

  return response?.data?.data?.login?.user?.apiKey
}

const allShops = async (email, apiKey) => {
  if (!email) throw new Error('Email é obrigatório')
  if (!apiKey) throw new Error('API Key é obrigatório')

  const config = {
    headers: { Authorization: `ApiKey ${email}:${apiKey}` }
  }

  const allShopsQuery = `
  query {
    allShops {
      edges {
        node {
          name
          pickupInstructions
          pk
          externalId
          address {
            pos
            addressSt
            addressData
          }
          chargeOptions {
            label
          }
        }
      }
    }
  }
  `
  const response = await axios.post(
    '/graphql',
    JSON.stringify({
      query: allShopsQuery
    }),
    config
  )

  return response?.data?.data?.allShops
}

const allPackages = async (email, apiKey, shopId) => {
  if (!email) throw new Error('Email é obrigatório')
  if (!apiKey) throw new Error('API Key é obrigatório')
  if (!shopId) throw new Error('shopId é obrigatório')

  const config = {
    headers: { Authorization: `ApiKey ${email}:${apiKey}` }
  }

  const allPackagesQuery = `
  query {
    allPackages(shopId: ${shopId}) {
      edges {
        node {
          pk
          status
          orderId
          orderStatus
          isRemovable
          trackingKey
          shareds {
            edges {
              node {
                trackingUrl
              }
            }
          }
        }
      }
    }
  }
  `

  const response = await axios.post(
    '/graphql',
    JSON.stringify({
      query: allPackagesQuery
    }),
    config
  )

  return response?.data?.data?.allPackages
}

const createOrder = async (email, apiKey, data) => {
  if (!email) throw new Error('Email é obrigatório')
  if (!apiKey) throw new Error('API Key é obrigatório')
  validate.createOrder({ data })

  const config = {
    headers: { Authorization: `ApiKey ${email}:${apiKey}` }
  }

  const createOrderQuery = `
  mutation ($input: createOrderMutationInput!) {
    createOrder(input: $input) {
      success
      shop {
        pk
        name
      }
      orders {
        pk
        packages {
          pk
          status
          pickupWaypoint {
            index
            indexDisplay
            eta
            legDistance
          }
          waypoint {
            index
            indexDisplay
            eta
            legDistance
          }
        }
      }
      errors {
        field
        message
      }
    }
  }
  `

  const response = await axios.post(
    '/graphql',
    JSON.stringify({
      query: createOrderQuery,
      variables: { input: data }
    }),
    config
  )

  return response?.data?.data?.createOrder
}

export default {
  login,
  allShops,
  createOrder,
  allPackages
}
