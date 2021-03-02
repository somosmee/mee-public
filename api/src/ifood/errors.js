export function UnauthorizedError(message, extra) {
  this.name = 'UnauthorizedError'
  this.message = message
  this.extra = extra
  this.stack = new Error().stack
}

UnauthorizedError.prototype = Object.create(UnauthorizedError.prototype)
UnauthorizedError.prototype.constructor = UnauthorizedError
