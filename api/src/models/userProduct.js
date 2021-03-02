import { ObjectID } from 'mongodb'
import mongoosastic from 'mongoosastic'
import mongooseDelete from 'mongoose-delete'

import storage from 'src/google/cloud-storage'

import mongoose from 'src/mongoose'

import { IMAGES_BUCKET_NAME } from 'src/utils/constants'
import logger from 'src/utils/logger'
import { normalizeText } from 'src/utils/preprocess'

const { ObjectId } = mongoose.Types
const { Mixed } = mongoose.Schema.Types

const UserProductSchema = new mongoose.Schema(
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
    product: {
      type: ObjectId,
      ref: 'Product',
      required: true
    },
    image: {
      type: String,
      set: function(image) {
        this._image = this.image
        return image
      }
    },
    price: {
      type: Number,
      required: true
    },
    balance: {
      type: Number,
      required: true,
      default: 0.0
    },
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    nameES: {
      type: String,
      es_indexed: true
    },
    description: {
      type: String
    },
    ifood: {
      q0: Number,
      q1: Number,
      q2: Number,
      q3: Number,
      q4: Number
    },
    modifiers: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true }
      }
    ],
    bundle: {
      type: [
        {
          type: Mixed,
          product: { type: ObjectId, required: true, ref: 'UserProduct' },
          quantity: { type: Number, required: true }
        }
      ],
      default: []
    },
    productionLine: ObjectID,
    deletedAt: Date,
    deleted: Boolean
  },
  {
    timestamps: true
  }
)

UserProductSchema.pre('save', async function(next) {
  const userProduct = this

  if (userProduct.isModified('image') && userProduct._image) {
    await storage.remove({
      bucketName: IMAGES_BUCKET_NAME,
      name: userProduct._image,
      isPublic: true
    })
  }

  next()
})

UserProductSchema.statics.bind = async function(input) {
  const UserProduct = this
  let userProduct = null
  const { _id, ...data } = input

  if (input._id) {
    userProduct = await UserProduct.findOne({ _id: input._id })
    userProduct.set(data)
    await userProduct.save()
    return userProduct
  }

  return UserProduct(data).save()
}

UserProductSchema.plugin(mongooseDelete, { overrideMethods: true, indexFields: ['deletedAt'] })

UserProductSchema.plugin(mongoosastic, {
  host: process.env.ELASTICSEARCH_HOST,
  port: +process.env.ELASTICSEARCH_PORT,
  filter: (doc) => {
    return !!doc.deleted
  }
})

const UserProductModel = mongoose.model('UserProduct', UserProductSchema, 'usersProducts')

/* ELASTIC SEARCH */

UserProductModel.searchES = function(text, company) {
  if (!company) throw new Error('Company must be defined in search filter criteria')
  return new Promise((resolve, reject) => {
    UserProductModel.search(
      {
        bool: {
          must: [
            {
              match_phrase_prefix: {
                nameES: {
                  query: normalizeText(text),
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
          ]
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

const stream = UserProductModel.synchronize()
let count = 0

stream.on('data', (err, doc) => {
  if (err) logger.error('[UserProductModel] error:', err)
  count++
})

stream.on('close', () => {
  logger.debug(`[UserProductModel] ${count} documents!`)
})

stream.on('error', (err) => {
  logger.error('[UserProductModel] error:', err)
})

export default UserProductModel
