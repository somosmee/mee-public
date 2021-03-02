import mongoose from 'src/mongoose'

const { ObjectId } = mongoose.Types

const Fee = new mongoose.Schema({
  fee: { type: ObjectId },
  name: { type: String, required: true },
  value: { type: Number, required: true }
})

export { Fee as default }
