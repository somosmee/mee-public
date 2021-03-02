import gql from 'graphql-tag'

import { PAGINATION_ATTRIBUTES } from 'src/graphql/fragments'
import { REGISTER_OPERATION_ATTRIBUTES } from 'src/graphql/registerOperation/fragments'

export const GET_REGISTER_OPERATIONS = gql`
  query registerOperations($input: RegisterOperationsInput) {
    registerOperations(input: $input) {
      registerOperations {
        ...registerOperationAttributes
      }
      pagination {
        ...paginationAttributes
      }
    }
  }
  ${REGISTER_OPERATION_ATTRIBUTES}
  ${PAGINATION_ATTRIBUTES}
`

export const CREATE_REGISTER_OPERATION = gql`
  mutation createRegisterOperation($input: CreateRegisterOperationInput!) {
    createRegisterOperation(input: $input) {
      ...registerOperationAttributes
    }
  }
  ${REGISTER_OPERATION_ATTRIBUTES}
`

export const DELETE_REGISTER_OPERATION = gql`
  mutation deleteRegisterOperation($input: DeleteRegisterOperationInput!) {
    deleteRegisterOperation(input: $input) {
      ...registerOperationAttributes
    }
  }
  ${REGISTER_OPERATION_ATTRIBUTES}
`
