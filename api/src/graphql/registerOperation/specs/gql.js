const PAGINATION_ATTRIBUTES = `
  fragment paginationAttributes on Pagination {
    page
    offset
    totalPages
    totalItems
  }
`

export const CREATE_REGISTER_OPERATION = `
  mutation createRegisterOperation ($input: CreateRegisterOperationInput!){
    createRegisterOperation(input: $input) {
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
    }
  }
`

export const GET_REGISTER_OPERATION = `
  query {
    registerOperations {
      registerOperations {
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
          balance
          realBalance
          financialStatements {
            _id
          }
        }
      }
      pagination {
        ...paginationAttributes
      }
    }
  }

  ${PAGINATION_ATTRIBUTES}
`

export const DELETE_REGISTER_OPERATION = `
  mutation deleteRegisterOperation ($input: DeleteRegisterOperationInput!){
    deleteRegisterOperation(input: $input) {
      id
    }
  }
`
