import mongoose from 'src/mongoose'

const { Mixed } = mongoose.Schema.Types

const Ifood = new mongoose.Schema(
  {
    reference: String,
    status: String,
    payments: [Mixed],
    customer: Mixed,
    benefits: [Mixed]
  },
  { _id: false }
)

export default Ifood
