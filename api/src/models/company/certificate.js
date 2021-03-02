import mongoose from 'src/mongoose'

const Certificate = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { _id: false }
)

export default Certificate
