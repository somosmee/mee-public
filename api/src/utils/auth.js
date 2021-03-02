import * as Sentry from '@sentry/node'
import jwt from 'jsonwebtoken'

import { User, Company } from 'src/models'

import { Roles } from 'src/utils/enums'
import { pad } from 'src/utils/order'

export const generateShortID = function() {
  return pad(Math.floor(Math.random() * 9999), 4)
}

const getUser = async (decoded, operationName, forceUseEmployee) => {
  const user = await User.findById(decoded.userId)
  if (!user) return null

  if (user.role === Roles.EMPLOYEE && forceUseEmployee) {
    return user
  }

  if (user.role === Roles.EMPLOYEE && user.employer) {
    return User.findById(user.employer.toString())
  }

  if (user.role === Roles.ACCOUNTANT && operationName === 'me') {
    return user
  } else if (user.role === Roles.ACCOUNTANT) {
    return User.findById(decoded.proxyId)
  }

  return { user, company: decoded.company }
}

export const getAuthFromRequest = (request) => {
  return request.headers?.authorization ?? request.context?.authorization
}

const authenticate = async (request, forceUseEmployee = false) => {
  const authorization = getAuthFromRequest(request)

  if (authorization === process.env.ADMIN_API_KEY) return null

  if (authorization) {
    const token = authorization.replace('Bearer ', '')
    let decoded

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      Sentry.captureException(error)
      throw error
    }

    if (decoded.companyId && decoded.userId) {
      const company = await Company.findById(decoded.companyId)

      if (company) {
        decoded.companyId = company._id
        decoded.company = company
      }
    }

    Sentry.configureScope((scope) => scope.setUser({ id: decoded.userId }))

    const operationName = request?.body?.operationName
    return getUser(decoded, operationName, forceUseEmployee)
  }

  return null
}

export { authenticate as default }
