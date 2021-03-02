import { useCallback } from 'react'

import { useLazyQuery, useMutation } from '@apollo/react-hooks'

import {
  GET_REGISTER_OPERATIONS,
  CREATE_REGISTER_OPERATION,
  DELETE_REGISTER_OPERATION
} from 'src/graphql/registerOperation/queries'

import useSnackbar from 'src/hooks/useSnackbar'

import { FirebaseEvents, RegisterOperationTypes } from 'src/utils/enums'

import { analytics } from 'src/firebase'

const useFinancialFund = () => {
  const [getRegisterOperationsQuery, getRegisterOperationsResult] = useLazyQuery(
    GET_REGISTER_OPERATIONS,
    {
      fetchPolicy: 'network-only'
    }
  )

  const { openSnackbar } = useSnackbar()

  const [createMutate, createResult] = useMutation(CREATE_REGISTER_OPERATION)
  const [deleteMutate, deleteResult] = useMutation(DELETE_REGISTER_OPERATION)

  const getRegisterOperations = useCallback((input) => {
    getRegisterOperationsQuery({ variables: { input } })
  }, [])

  const createRegisterOperation = async (input) => {
    try {
      const {
        data: { createRegisterOperation }
      } = await createMutate({ variables: { input } })

      // analytics
      if (input.operationType === RegisterOperationTypes.OPEN) {
        analytics.logEvent(FirebaseEvents.CREATE_OPEN_REGISTER_OPERATION)
      } else if (input.category === RegisterOperationTypes.CLOSE) {
        analytics.logEvent(FirebaseEvents.CREATE_CLOSE_REGISTER_OPERATION)
      }

      openSnackbar({
        variant: 'success',
        message:
          input.category === RegisterOperationTypes.OPEN
            ? 'Abertura de caixa criada!'
            : 'Fechamento de caixa criado!'
      })

      // eslint-disable-next-line
      getRegisterOperationsResult?.refetch?.()
      return createRegisterOperation
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  const deleteRegisterOperation = async (input) => {
    try {
      const {
        data: { deleteRegisterOperation }
      } = await deleteMutate({ variables: { input } })

      analytics.logEvent(FirebaseEvents.DELETE_REGISTER_OPERATION)

      openSnackbar({
        variant: 'success',
        message: 'Operação deletada!'
      })

      // eslint-disable-next-line
      getRegisterOperationsResult?.refetch?.()
      return deleteRegisterOperation
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  return {
    getRegisterOperations: [getRegisterOperations, getRegisterOperationsResult],
    createRegisterOperation: [createRegisterOperation, createResult],
    deleteRegisterOperation: [deleteRegisterOperation, deleteResult]
  }
}

export default useFinancialFund
