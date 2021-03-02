import mongoose from 'src/mongoose'

import { ICMSTaxGroup, ICMSTaxRegimes, IncidenceRegimes } from 'src/utils/enums'

const Tax = new mongoose.Schema(
  {
    ibgeCityCode: { type: String },
    regime: { type: String },
    icmsCSOSN: { type: String },
    icmsOrigin: { type: String },
    pisCofinsTaxGroup: { type: String },
    icmsRegime: { type: String, enum: Object.values(ICMSTaxRegimes) },
    icmsTaxGroup: { type: String, enum: Object.values(ICMSTaxGroup) },
    incidenceRegime: { type: String, enum: Object.values(IncidenceRegimes) }
  },
  { _id: false }
)

export { Tax as default }
