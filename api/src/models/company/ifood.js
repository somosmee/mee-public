import mongoose from 'src/mongoose'

import { IfoodAnalysisStatus } from 'src/utils/enums'

const Ifood = new mongoose.Schema(
  {
    marketAnalysisStatus: {
      type: String,
      default: IfoodAnalysisStatus.UNSTARTED,
      enum: Object.values(IfoodAnalysisStatus)
    },
    latestToken: String,
    open: { type: Boolean, required: true, default: false },
    merchant: String,
    username: String,
    password: String
  },
  { _id: false }
)

export { Ifood as default }
