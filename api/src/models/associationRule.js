import mongoose from 'src/mongoose'

const { Mixed } = mongoose.Schema.Types

const { ObjectId } = mongoose.Types

const AssociationRuleSchema = new mongoose.Schema(
  {
    company: {
      type: ObjectId,
      index: true,
      ref: 'Company',
      required: true,
      es_indexed: true
    },
    rules: {
      type: Mixed
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('AssociationRule', AssociationRuleSchema, 'associationRules')
