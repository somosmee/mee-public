export const CREATE_FINANCIAL_FUND = `
  mutation createFinancialFund ($input: CreateFinancialFundInput!){
    createFinancialFund(input: $input) {
      id
      name
      category
      balance
    }
  }
`

export const DELETE_FINANCIAL_FUND = `
  mutation deleteFinancialFund ($input: DeleteFinancialFundInput!){
    deleteFinancialFund(input: $input) {
      id
    }
  }
`

export const UPDATE_FINANCIAL_FUND = `
  mutation updateFinancialFund ($input: UpdateFinancialFundInput!){
    updateFinancialFund(input: $input) {
      id
      name
      category
      balance
    }
  }
`

export const GET_FINANCIAL_FUNDS = `
 {
   financialFunds {
     id
     name
     category
     balance
   }
 }
`

export const ADJUST_FINANCIAL_FUND = `
  mutation adjustFinancialFund ($input: AdjustFinancialFundInput!){
    adjustFinancialFund(input: $input) {
      id
      name
      category
      balance
    }
  }
`
