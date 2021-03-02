import mongoose from 'src/mongoose'

import { OperationTypes, Payments } from 'src/utils/enums'

const { ObjectId } = mongoose.Types

const PaymentMethod = new mongoose.Schema({
  name: { type: String, required: true },
  fee: { type: Number, required: true },
  operationType: {
    type: String,
    enum: Object.values(OperationTypes),
    required: true
  },
  method: {
    type: String,
    enum: Object.values(Payments),
    required: true
  },
  financialFund: { type: ObjectId, ref: 'FinancialFund' },
  /* Credit Card when you sell */
  /*
    Stone - O valor das vendas cai na conta bancária: no débito em 2 dias úteis;
      crédito à vista em 30 dias; crédito parcelado a cada 30 dias de acordo
      com o número de parcelas.
   */
  balanceInterval: {
    type: Number,
    description:
      'number of days that the payment will take to reach the account from the payment date'
  }
})

export { PaymentMethod as default }
