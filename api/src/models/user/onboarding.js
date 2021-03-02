import mongoose from 'src/mongoose'

const OnBoarding = new mongoose.Schema(
  {
    finishedAddProduct: Boolean,
    finishedAddOrder: Boolean,
    finishedCloseOrder: Boolean,
    finishedAt: Date
  },
  { _id: false }
)

export { OnBoarding as default }
