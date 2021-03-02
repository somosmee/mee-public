import { createResolver } from 'apollo-resolvers'

import { AuthenticationRequiredError, ForbiddenError } from 'src/graphql/resolvers/errors'

import { getAuthFromRequest } from 'src/utils/auth'
import { Roles } from 'src/utils/enums'
import logger from 'src/utils/logger'

// import { isInstance  } from 'apollo-errors';

export const isPublicResolver = createResolver(
  // incoming requests will pass through this resolver like a no-op
  null,

  /*
    Only mask outgoing errors that aren't already apollo-errors,
    such as ORM errors etc
  */
  (root, args, context, error) => {
    logger.error(`${error}`)
    // return isInstance(error) ? error : new UnknownError()
    return error
  }
)

export const isAuthenticatedResolver = isPublicResolver.createResolver(
  // Extract the user from context (undefined if non-existent)
  (root, args, { user, request }, info) => {
    if (!user && getAuthFromRequest(request) !== process.env.ADMIN_API_KEY) {
      logger.error(`[isAuthenticatedResolver]: ${info.fieldName}`)
      throw new AuthenticationRequiredError()
    }
  }
)

export const isAdminResolver = isAuthenticatedResolver.createResolver(
  // Extract the user and make sure they are an admin
  (root, args, { user, request }, info) => {
    if (!getAuthFromRequest(request) === process.env.ADMIN_API_KEY) {
      if (!user.email.includes('@somosmee.com')) {
        if (user.role !== Roles.ADMIN) throw new ForbiddenError()
      }
    }
  }
)
