import mongoose from 'src/mongoose'

export const Address = new mongoose.Schema(
  {
    street: { type: String, required: true },
    number: { type: String, required: true },
    complement: String,
    district: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    lat: Number,
    lng: Number
  },
  { _id: true }
)
