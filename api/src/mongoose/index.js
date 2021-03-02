import mongoose from 'mongoose'

import logger from 'src/utils/logger'

mongoose.Promise = global.Promise

const ObjectId = mongoose.Types.ObjectId

const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: process.env.NODE_ENV === 'test',
  promiseLibrary: global.Promise
}

if (process.env.NODE_ENV === 'development') options.replicaSet = 'rs0'

mongoose.connect(process.env.MONGODB_HOST, options)

mongoose.connection.on('connected', () => {
  logger.debug('[Mongoose] connected!')
})

mongoose.connection.on('error', (error) => {
  logger.error('[Mongoose] error: ', error)
})

mongoose.connection.on('disconnected', () => {
  logger.debug('[Mongoose] disconnected!')
})

ObjectId.prototype.valueOf = function() {
  return this.toString()
}

export default mongoose
