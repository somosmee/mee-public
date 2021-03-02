import moment from 'moment'
import winston from 'winston'

const timestamp = winston.format((info) => {
  info.message = `[${moment().format('YYYY-DD-MMTHH:mm:ss.SSS')}]: ${info.message}`
  return info
})

const prettyJson = winston.format.printf((info) => {
  if (typeof info.message === 'object') {
    info.message = JSON.stringify(info.message, null, 4)
  }

  return `${info.level}: ${info.message}`
})

const logger = winston.createLogger({
  level: 'debug',
  silent: process.env.NODE_ENV === 'test',
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    timestamp(),
    winston.format.colorize(),
    winston.format.prettyPrint(),
    winston.format.splat(),
    winston.format.simple(),
    prettyJson
  )
})

export default logger
