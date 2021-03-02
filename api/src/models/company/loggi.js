import mongoose from 'src/mongoose'

const Loggi = new mongoose.Schema(
  {
    latestToken: String,
    username: String,
    password: String
  },
  { _id: false }
)

export { Loggi as default }
