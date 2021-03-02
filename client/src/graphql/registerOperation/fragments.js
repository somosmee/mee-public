import gql from 'graphql-tag'

export const REGISTER_OPERATION_ATTRIBUTES = gql`
  fragment registerOperationAttributes on RegisterOperation {
    id
    totalSales
    realTotalSales
    operationType
    paymentMethods {
      method
      total
      realTotal
    }
    registers {
      register
      name
      balance
      realBalance
      financialStatements {
        _id
      }
    }
    createdAt
    createdBy {
      email
    }
  }
`
