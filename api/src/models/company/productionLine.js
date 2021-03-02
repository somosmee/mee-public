import mongoose from 'src/mongoose'

const ProductionLine = new mongoose.Schema({
  name: { type: String, required: true },
  ip: { type: String, required: true }
})

export { ProductionLine as default }
