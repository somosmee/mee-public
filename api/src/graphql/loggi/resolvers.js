import loggi from 'src/loggi'

import { isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import logger from 'src/utils/logger'

export const updateCredentialsLoggi = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    const apiKey = await loggi.login(input.username, input.password)

    if (!apiKey) throw new Error('Usuário ou senha invalidos! Use o mesmo login da Loggi.')

    company.set('loggi', {
      username: input.username,
      password: input.password,
      latestToken: apiKey
    })

    await company.save()

    return company
  }
)

export const createOrderLoggi = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    const { username, password } = company.loggi

    if (!company.loggi.latestToken) {
      const apiKey = await loggi.login(username, password)
      if (!apiKey) {
        throw new Error('Usuário ou senha da Loggi incorreto. Por favor atualize seus dados.')
      }

      company.set('loggi', {
        ...company.loggi,
        latestToken: apiKey
      })

      await company.save()
    }

    const response = await loggi.createOrder(username, company.loggi.latestToken, input)

    logger.debug(`[createOrderLoggi] LOGGI_RESPONSE: ${JSON.stringify(response, null, 2)}`)

    if (response.errors?.length > 0) throw new Error(response.errors[0].message)

    return response.orders
  }
)

export const allShopsLoggi = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    const { username, password } = company.loggi

    if (!company.loggi.latestToken) {
      const apiKey = await loggi.login(username, password)
      if (!apiKey) {
        throw new Error('Usuário ou senha da Loggi incorreto. Por favor atualize seus dados.')
      }

      company.set('loggi', {
        ...company.loggi,
        ...input,
        latestToken: apiKey
      })

      await company.save()
    }

    const allShops = await loggi.allShops(username, company.loggi.latestToken)

    logger.debug(`[allShopsLoggi] LOGGI_RESPONSE: ${JSON.stringify(allShops, null, 2)}`)

    return allShops
  }
)

export const allPackagesLoggi = isAuthenticatedResolver.createResolver(
  async (parent, { input: { shopIds } }, { company }, info) => {
    const { username, password } = company.loggi

    if (!company.loggi.latestToken) {
      const apiKey = await loggi.login(username, password)
      if (!apiKey) {
        throw new Error('Usuário ou senha da Loggi incorreto. Por favor atualize seus dados.')
      }

      company.set('loggi', {
        ...company.loggi,
        latestToken: apiKey
      })

      await company.save()
    }

    const results = await Promise.all(
      shopIds.map((shopId) => loggi.allPackages(username, company.loggi.latestToken, shopId))
    )

    return results.reduce(
      (acc, current) => {
        acc.edges = acc.edges.concat(current.edges)
        return acc
      },
      { edges: [] }
    )
  }
)
