import { FinancialFund } from 'src/models'

const PurchasePaymentMethod = {
  financialFund(parent) {
    return FinancialFund.findById(parent.financialFund)
  }
}

export { PurchasePaymentMethod as default }
