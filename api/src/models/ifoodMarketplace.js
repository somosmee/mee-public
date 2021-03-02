import mongoosastic from 'mongoosastic'
import mongoose from 'src/mongoose'

import logger from 'src/utils/logger'
import { normalizeText, removeStopwords } from 'src/utils/preprocess'

const ObjectId = mongoose.Types.ObjectId

const IfoodMarketplaceSchema = new mongoose.Schema(
  {
    merchantId: String,
    itemId: String,
    unitPrice: {
      type: Number,
      es_indexed: true
    },
    itemDescription: {
      type: String,
      required: true,
      es_indexed: true
    },
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
      es_indexed: true
    }
  },
  {
    timestamps: true
  }
)

IfoodMarketplaceSchema.plugin(mongoosastic, {
  host: process.env.ELASTICSEARCH_HOST,
  port: +process.env.ELASTICSEARCH_PORT
})

const IfoodMarketplaceModel = mongoose.model(
  'IfoodMarketplace',
  IfoodMarketplaceSchema,
  'ifoodMarketplace'
)

/* ELASTIC SEARCH */

IfoodMarketplaceModel.searchES = function(text, user, size) {
  if (!user) throw new Error('User must be defined in search filter criteria')
  text = normalizeText(text)
  text = removeStopwords(text)

  logger.debug(`[IfoodMarketplaceModel] SEARCH: ${text}`)
  return new Promise((resolve, reject) => {
    IfoodMarketplaceModel.search(
      {
        bool: {
          must: [
            {
              match: {
                itemDescription: {
                  query: text
                }
              }
            }
          ],
          filter: [
            {
              match: {
                user: user.toString()
              }
            }
          ]
        }
      },
      {
        size: size || 50
      },
      (err, results) => {
        if (err) reject(err)
        resolve(results)
      }
    )
  })
}

const stream = IfoodMarketplaceModel.synchronize()
let count = 0

stream.on('data', (err, doc) => {
  if (err) logger.error('[IfoodMarketplaceModel] error:', err)
  count++
})

stream.on('close', () => {
  logger.debug(`[IfoodMarketplaceModel] ${count} documents!`)
})

stream.on('error', (err) => {
  logger.error('[IfoodMarketplaceModel] error:', err)
})

export default IfoodMarketplaceModel
