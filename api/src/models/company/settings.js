import mongoose from 'src/mongoose'

import Fee from 'src/models/company/fee'

import { Integrations, Conditions, OperationTypes } from 'src/utils/enums'

const { Mixed } = mongoose.Schema.Types

const Settings = new mongoose.Schema(
  {
    priceRules: [
      new mongoose.Schema(
        {
          name: { type: String, required: true },
          amount: { type: Number, required: true },
          operationType: {
            type: String,
            enum: Object.values(OperationTypes),
            required: true
          },
          channels: [
            {
              type: String,
              enum: Object.values(Integrations),
              required: true
            }
          ],
          active: {
            type: Boolean,
            required: true,
            default: false
          }
        },
        { _id: true }
      )
    ],
    delivery: [
      {
        type: Mixed,
        fee: { type: Number, default: 0.0 },
        condition: { type: String, enum: Object.values(Conditions), default: Conditions.LESS_THAN },
        distance: { type: Number, default: 0.0 }
      }
    ],
    fees: [Fee],
    forceOpenRegister: { type: Boolean, default: false }
  },
  { _id: false }
)

export { Settings as default }
