import mongoose from 'src/mongoose'

import { SalesInvoiceStatus } from 'src/utils/enums'

const { Mixed } = mongoose.Schema.Types

const Invoice = new mongoose.Schema(
  {
    type: Mixed,
    retries: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: Object.values(SalesInvoiceStatus),
      default: SalesInvoiceStatus.PENDING,
      required: true
    },
    accessKey: String,
    QRCode: String,
    dataJS: { type: Mixed },
    dataXML: String,
    error: String,
    responseSAT: String,
    validationError: String,
    taxes: {
      type: Mixed,
      icms: {
        type: Number,
        default: 0.0
      },
      pis: {
        type: Number,
        default: 0.0
      },
      cofins: {
        type: Number,
        default: 0.0
      },
      pisst: {
        type: Number,
        default: 0.0
      },
      cofinsst: {
        type: Number,
        default: 0.0
      }
    }
  },
  { _id: false }
)

export default Invoice
