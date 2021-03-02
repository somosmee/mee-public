import { SchemaDirectiveVisitor } from 'apollo-server-express'
import { defaultFieldResolver } from 'graphql'

import { AuthenticationRequiredError, ForbiddenError } from 'src/graphql/resolvers/errors'

import { getAuthFromRequest } from 'src/utils/auth'
import { Roles } from 'src/utils/enums'

export class AuthDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type)
    type._requiredAuthRole = this.args.requires
  }

  // Visitor methods for nested types like fields and arguments
  // also receive a details object that provides information about
  // the parent and grandparent types.
  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType)
    field._requiredAuthRole = this.args.requires
  }

  ensureFieldsWrapped(objectType) {
    // Mark the GraphQLObjectType object to avoid re-wrapping:
    if (objectType._authFieldsWrapped) return
    objectType._authFieldsWrapped = true

    const fields = objectType.getFields()

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName]
      const { resolve = defaultFieldResolver } = field
      field.resolve = async function(...args) {
        // Get the required Role from the field first, falling back
        // to the objectType if no Role is required by the field:
        const requiredRole = field._requiredAuthRole || objectType._requiredAuthRole
        if (!requiredRole) return resolve.apply(this, args)

        const context = args[2]
        const user = context.user

        if (
          requiredRole === Roles.ADMIN &&
          getAuthFromRequest(context.request) !== process.env.ADMIN_API_KEY
        ) {
          throw new ForbiddenError()
        }

        if (!user && requiredRole === 'user') throw new AuthenticationRequiredError()

        return resolve.apply(this, args)
      }
    })
  }
}
