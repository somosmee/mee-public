import mongoose from 'src/mongoose'

import { pubsub } from 'src/apolloServer'

import Item from 'src/models/productionRequest/item'

import { Topics } from 'src/utils/enums'

const { ObjectId } = mongoose.Types

const ProductionRequestSchema = new mongoose.Schema(
  {
    company: {
      type: ObjectId,
      index: true,
      ref: 'Company',
      required: true
    },
    // its not required because a client can created a customer on shopfront
    createdBy: {
      type: ObjectId,
      index: true,
      ref: 'User'
    },
    productionLine: {
      type: ObjectId,
      required: true,
      index: true
    },
    order: { type: ObjectId, ref: 'Order', required: true },
    items: [Item]
  },
  {
    timestamps: true
  }
)

ProductionRequestSchema.index({ createdAt: -1 })

ProductionRequestSchema.post('save', async function(document, next) {
  const productionRequest = this

  pubsub.publish(Topics.PRODUCTION_REQUEST, { productionRequest })

  next()
})

export default mongoose.model('ProductionRequest', ProductionRequestSchema, 'productionRequests')
