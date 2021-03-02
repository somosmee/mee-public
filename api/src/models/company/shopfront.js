import mongoose from 'src/mongoose'

const { ObjectId } = mongoose.Types

const Shopfront = new mongoose.Schema({
  products: [
    {
      type: ObjectId,
      ref: 'UserProduct',
      required: true
    }
  ]
})

export default Shopfront
