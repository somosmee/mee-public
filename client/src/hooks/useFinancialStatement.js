import { useCallback } from 'react'

import { useLazyQuery, useMutation } from '@apollo/react-hooks'

import {
  GET_FINANCIAL_STATEMENTS,
  CREATE_FINANCIAL_STATEMENT,
  DELETE_FINANCIAL_STATEMENT
} from 'src/graphql/financialStatement/queries'

import useSnackbar from 'src/hooks/useSnackbar'

import { FirebaseEvents, FinancialOperations } from 'src/utils/enums'

import { analytics } from 'src/firebase'

const useFinancialStatement = () => {
  const { openSnackbar } = useSnackbar()

  const [getFinancialStatementsQuery, getFinancialStatementsResult] = useLazyQuery(
    GET_FINANCIAL_STATEMENTS,
    {
      fetchPolicy: 'network-only'
    }
  )

  const [createMutate, createResult] = useMutation(CREATE_FINANCIAL_STATEMENT)
  const [deleteMutate, deleteResult] = useMutation(DELETE_FINANCIAL_STATEMENT)

  const getFinancialStatements = useCallback(({ pagination } = {}) => {
    getFinancialStatementsQuery({
      variables: {
        input: {
          pagination: { first: pagination.offset, skip: pagination.page * pagination.offset }
        }
      }
    })
  }, [])

  const createFinancialStatement = async (input) => {
    try {
      const {
        data: { createFinancialStatement }
      } = await createMutate({ variables: { input } })

      // analytics
      if (input.operation === FinancialOperations.EXPENSE) {
        analytics.logEvent(FirebaseEvents.CREATE_EXPENSE)
      } else if (input.operation === FinancialOperations.INCOME) {
        analytics.logEvent(FirebaseEvents.CREATE_INCOME)
      }

      openSnackbar({
        variant: 'success',
        message:
          input.operation === FinancialOperations.EXPENSE
            ? 'Despesa adicionada!'
            : 'Receita adicionada!'
      })

      // eslint-disable-next-line
      getFinancialStatementsResult?.refetch?.()
      return createFinancialStatement
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  const deleteFinancialStatement = async (input) => {
    try {
      const {
        data: { deleteFinancialStatement }
      } = await deleteMutate({ variables: { input } })

      analytics.logEvent(FirebaseEvents.DELETE_FINANCIAL_STATEMENT)
      openSnackbar({ variant: 'success', message: 'Operação apagada!' })

      // eslint-disable-next-line
      getFinancialStatementsResult?.refetch?.()
      return deleteFinancialStatement
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  return {
    getFinancialStatements: [getFinancialStatements, getFinancialStatementsResult],
    createFinancialStatement: [createFinancialStatement, createResult],
    deleteFinancialStatement: [deleteFinancialStatement, deleteResult]
  }
}

export default useFinancialStatement
