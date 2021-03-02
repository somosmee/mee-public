import mongoosastic from 'mongoosastic'
import isURL from 'validator/lib/isURL'

import mongoose from 'src/mongoose'

import logger from 'src/utils/logger'
import { normalizeText } from 'src/utils/preprocess'

const { ObjectId } = mongoose.Types

const SupplierSchema = new mongoose.Schema(
  {
    company: {
      type: ObjectId,
      index: true,
      ref: 'Company',
      required: true,
      es_indexed: true
    },
    createdBy: {
      type: ObjectId,
      index: true,
      ref: 'User',
      required: true,
      es_indexed: true
    },
    nationalId: {
      type: String,
      required: true,
      trim: true,
      length: 14
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      es_indexed: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      es_indexed: true
    },
    tradeName: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => {
          if (!value) return true
          return isURL(value)
        },
        message: '{VALUE} não é uma url válida.'
      }
    },
    phone: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
)

SupplierSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Fornecedor já cadastrado'))
  } else {
    next(error)
  }
})

SupplierSchema.plugin(mongoosastic, {
  host: process.env.ELASTICSEARCH_HOST,
  port: +process.env.ELASTICSEARCH_PORT
})

SupplierSchema.index({ company: 1, nationalId: 1 }, { unique: true, background: true })

SupplierSchema.index(
  { nationalId: 'text', displayName: 'text', name: 'text', description: 'text' },
  {
    weights: {
      nationalId: 10,
      displayName: 10,
      name: 10,
      description: 5
    },
    name: 'search_',
    background: true
  }
)

const SupplierModel = mongoose.model('Supplier', SupplierSchema)

/* ELASTICSEARCH */

// https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters.html#context-suggester
// https://github.com/mongoosastic/mongoosastic/pull/100
SupplierModel.searchES = (text, company) => {
  if (!company) throw new Error('Company must be defined in search filter criteria')

  const cleanText = normalizeText(text)

  return new Promise((resolve, reject) => {
    SupplierModel.search(
      {
        bool: {
          should: [
            {
              match_phrase_prefix: {
                displayName: {
                  query: cleanText,
                  slop: 5,
                  max_expansions: 100
                }
              }
            },
            {
              match_phrase_prefix: {
                name: {
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

const stream = SupplierModel.synchronize()
let count = 0

stream.on('data', (err, doc) => {
  if (err) logger.error('[SupplierModel] error:', err)
  count++
})

stream.on('close', () => {
  logger.debug(`[SupplierModel] ${count} documents!`)
})

stream.on('error', (err) => {
  logger.error('[SupplierModel] error:', err)
})

export default SupplierModel
