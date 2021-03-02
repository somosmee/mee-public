import { FinancialFund } from 'src/models'

const PaymentMethodType = {
  financialFund(parent) {
    return FinancialFund.findById(parent.financialFund)
  }
}

export { PaymentMethodType as default }
