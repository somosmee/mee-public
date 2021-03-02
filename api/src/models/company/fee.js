import mongoose from 'src/mongoose'

import { OperationTypes } from 'src/utils/enums'

const Fee = new mongoose.Schema({
  name: { type: String, required: true },
  fee: { type: Number, required: true },
  operationType: {
    type: String,
    enum: Object.values(OperationTypes),
    required: true
  },
  enabled: { type: Boolean, required: true, default: true }
})

export { Fee as default }
