import mongoose from 'src/mongoose'

import { Measurements, PurchaseStatus, PurchaseItemStatus } from 'src/utils/enums'

const { ObjectId } = mongoose.Types
const { Mixed } = mongoose.Schema.Types

const PurchaseSchema = new mongoose.Schema(
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
    supplier: {
      type: ObjectId,
      ref: 'Supplier'
    },
    invoice: {
      type: ObjectId,
      ref: 'Invoice'
    },
    status: {
      type: String,
      enum: Object.values(PurchaseStatus),
      default: PurchaseStatus.FETCHING,
      required: true
    },
    items: [
      {
        type: Mixed,
        product: ObjectId,
        gtin: String,
        name: String,
        quantity: Number,
        unitPrice: Number,
        totalPrice: Number,
        measurement: {
          type: String,
          enum: Object.values(Measurements)
        },
        ncm: String,
        status: {
          type: String,
          enum: Object.values(PurchaseItemStatus),
          default: PurchaseItemStatus.DRAFT
        }
      }
    ],
    financialFund: { type: ObjectId, ref: 'FinancialFund', default: undefined },
    paymentMethod: { type: ObjectId, default: undefined },
    total: Number,
    purchasedAt: Date,
    deletedAt: Date
  },
  {
    timestamps: true
  }
)

PurchaseSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Compra já existe'))
  } else {
    next(error)
  }
})

export default mongoose.model('Purchase', PurchaseSchema)
