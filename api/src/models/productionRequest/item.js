import mongoose from 'src/mongoose'

const { ObjectId } = mongoose.Types
const { Mixed } = mongoose.Schema.Types

const Item = new mongoose.Schema(
  {
    type: Mixed,
    product: { type: ObjectId, ref: 'Product', required: true, index: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    note: String
  },
  { _id: false }
)

export default Item
