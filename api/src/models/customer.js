import mongoosastic from 'mongoosastic'
import mongooseDelete from 'mongoose-delete'
import isEmail from 'validator/lib/isEmail'

import mongoose from 'src/mongoose'

import { Address } from 'src/models/shared'

import logger from 'src/utils/logger'
import { normalizeText, buildQueryString } from 'src/utils/preprocess'

const { ObjectId } = mongoose.Types
const { Mixed } = mongoose.Schema.Types

const CustomerSchema = new mongoose.Schema(
  {
    company: {
      type: ObjectId,
      index: true,
      ref: 'Company',
      required: true,
      es_indexed: true
    },
    // its not required because a client can created a customer on shopfront
    createdBy: {
      type: ObjectId,
      index: true,
      ref: 'User',
      es_indexed: true
    },
    firstName: {
      type: String,
      trim: true,
      es_indexed: true
    },
    lastName: {
      type: String,
      trim: true,
      es_indexed: true
    },
    nationalId: {
      type: String,
      validate: {
        validator: (value) => {
          if (!value) return true
          return value.length === 11
        },
        message: '{VALUE} não é um cpf válido'
      }
    },
    birthday: {
      type: String
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => {
          if (!value) return true
          return isEmail(value)
        },
        message: '{VALUE} não é um e-mail válido'
      }
    },
    mobile: {
      type: String,
      trim: true,
      required: true,
      es_indexed: true,
      validate: {
        validator: (value) => value.length === 11,
        message: '{VALUE} não é um celular válido'
      }
    },
    receiveOffers: {
      type: Boolean,
      default: false
    },
    addresses: [Address],
    business: {
      type: Mixed,
      nationalId: String,
      name: String
    },
    deletedAt: Date,
    deleted: Boolean
  },
  {
    timestamps: true
  }
)

CustomerSchema.virtual('name')
  .get(function() {
    if (this.firstName && this.lastName) {
      return this.firstName + ' ' + this.lastName
    }

    return 'Sem nome'
  })
  .set(function(name) {
    const [firstName, lastName] = name.split(' ')
    this.firstName = firstName
    this.lastName = lastName
  })

CustomerSchema.plugin(mongooseDelete, { overrideMethods: true, indexFields: ['deletedAt'] })

CustomerSchema.plugin(mongoosastic, {
  host: process.env.ELASTICSEARCH_HOST,
  port: +process.env.ELASTICSEARCH_PORT,
  filter: (doc) => {
    return !!doc.deleted
  }
})

CustomerSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Cliente já cadastrado'))
  } else {
    next(error)
  }
})

CustomerSchema.index({ company: 1, mobile: 1 }, { unique: true, background: true })
CustomerSchema.index(
  { firstName: 'text', lastName: 'text', cpf: 'text', email: 'text', mobile: 'text' },
  {
    name: 'search_',
    background: true
  }
)

const CustomerModel = mongoose.model('Customer', CustomerSchema)

// elasticsearch

CustomerModel.searchES = function(text, company) {
  if (!company) throw new Error('Company must be defined in search filter criteria')

  const cleanText = normalizeText(text)
  const query = buildQueryString(cleanText, { wildcard: true })

  return new Promise((resolve, reject) => {
    CustomerModel.search(
      {
        bool: {
          should: [
            {
              query_string: {
                query: query,
                default_field: 'mobile'
              }
            },
            {
              match_phrase_prefix: {
                firstName: {
                  query: cleanText,
                  slop: 5,
                  max_expansions: 100
                }
              }
            },
            {
              match_phrase_prefix: {
                lastName: {
                  query: cleanText,
                  slop: 5,
                  max_expansions: 100
                }
              }
            }
          ],
          filter: [
            {
              match: {
                company: company.toString()
              }
            }
          ],
          minimum_should_match: 1
        }
      },
      {},
      (err, results) => {
        if (err) reject(err)
        resolve(results)
      }
    )
  })
}

const stream = CustomerModel.synchronize()
let count = 0

stream.on('data', (err, doc) => {
  if (err) logger.error('[CustomerModel] error:', err)
  count++
})

stream.on('close', () => {
  logger.debug(`[CustomerModel] ${count} documents!`)
})

stream.on('error', (err) => {
  logger.error('[CustomerModel] error:', err)
})

export default CustomerModel
