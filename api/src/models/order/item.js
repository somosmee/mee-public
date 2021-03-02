import mongoose from 'src/mongoose'

import { Measurements } from 'src/utils/enums'

const { ObjectId } = mongoose.Types
const { Mixed } = mongoose.Schema.Types

const Price = {
  type: Number,
  required: true
}

const Item = new mongoose.Schema(
  {
    type: Mixed,
    product: { type: ObjectId, ref: 'Product' }, // it cant be required because of ifood orders
    gtin: String,
    name: {
      type: String,
      required: true,
      minlength: 1
    },
    description: { type: String, es_indexed: true },
    price: Price,
    measurement: {
      type: String,
      enum: Object.values(Measurements),
      required: true
    },
    quantity: { type: Number, required: true },
    note: { type: String, trim: true },
    subtotal: Number,
    discount: { type: Number, required: true, default: 0.0 },
    modifiers: [
      {
        type: Mixed,
        name: {
          type: String,
          required: true,
          minlength: 1
        },
        price: Price,
        quantity: { type: Number, required: true },
        totalPrice: Price
      }
    ],
    productionLine: ObjectId
  },
  { _id: false }
)

export default Item
