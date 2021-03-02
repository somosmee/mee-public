import { useCallback } from 'react'

import { useLazyQuery, useMutation } from '@apollo/react-hooks'

import {
  GET_FINANCIAL_FUNDS,
  CREATE_FINANCIAL_FUND,
  UPDATE_FINANCIAL_FUND,
  DELETE_FINANCIAL_FUND,
  ADJUST_FINANCIAL_FUND
} from 'src/graphql/financialFund/queries'

import useSnackbar from 'src/hooks/useSnackbar'

import { FirebaseEvents, FinancialFundCategories } from 'src/utils/enums'

import { analytics } from 'src/firebase'

const useFinancialFund = () => {
  const { openSnackbar } = useSnackbar()

  const [getFinancialFundsQuery, getFinancialFundsResult] = useLazyQuery(GET_FINANCIAL_FUNDS, {
    fetchPolicy: 'network-only'
  })

  const [createMutate, createResult] = useMutation(CREATE_FINANCIAL_FUND)
  const [updateMutate, updateResult] = useMutation(UPDATE_FINANCIAL_FUND)
  const [deleteMutate, deleteResult] = useMutation(DELETE_FINANCIAL_FUND)
  const [adjustMutate, adjustResult] = useMutation(ADJUST_FINANCIAL_FUND)

  const getFinancialFunds = useCallback((input) => {
    getFinancialFundsQuery({ variables: { input } })
  }, [])

  const createFinancialFund = async (input) => {
    try {
      const {
        data: { createFinancialFund }
      } = await createMutate({ variables: { input } })

      // analytics
      if (input.category === FinancialFundCategories.BANK_ACCOUNT) {
        analytics.logEvent(FirebaseEvents.CREATE_BANK_ACCOUNT)
      } else if (input.category === FinancialFundCategories.REGISTER) {
        analytics.logEvent(FirebaseEvents.CREATE_REGISTER)
      }

      openSnackbar({
        variant: 'success',
        message:
          input.category === FinancialFundCategories.BANK_ACCOUNT
            ? 'Conta bancária criada!'
            : 'Caixa criado!'
      })

      // eslint-disable-next-line
      getFinancialFundsResult?.refetch?.()
      return createFinancialFund
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  const updateFinancialFund = async (input) => {
    try {
      const {
        data: { updateFinancialFund }
      } = await updateMutate({ variables: { input } })

      // analytics
      if (input.category === FinancialFundCategories.BANK_ACCOUNT) {
        analytics.logEvent(FirebaseEvents.CREATE_BANK_ACCOUNT)
      } else if (input.category === FinancialFundCategories.REGISTER) {
        analytics.logEvent(FirebaseEvents.CREATE_REGISTER)
      }

      openSnackbar({
        variant: 'success',
        message:
          input.category === FinancialFundCategories.BANK_ACCOUNT
            ? 'Conta bancária atualizada!'
            : 'Caixa atualizado!'
      })

      // eslint-disable-next-line
      getFinancialFundsResult?.refetch?.()
      return updateFinancialFund
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  const deleteFinancialFund = async (input) => {
    try {
      const {
        data: { deleteFinancialFund }
      } = await deleteMutate({ variables: { input } })

      analytics.logEvent(FirebaseEvents.DELETE_FINANCIAL_FUND)
      openSnackbar({ variant: 'success', message: 'Operação apagada!' })

      // eslint-disable-next-line
      getFinancialFundsResult?.refetch?.()
      return deleteFinancialFund
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  const adjustFinancialFund = async (input) => {
    try {
      const {
        data: { adjustFinancialFund }
      } = await adjustMutate({ variables: { input } })

      analytics.logEvent(FirebaseEvents.ADJUST_FINANCIAL_FUND)
      openSnackbar({ variant: 'success', message: 'Balanço atualizado!' })

      // eslint-disable-next-line
      getFinancialFundsResult?.refetch?.()
      return adjustFinancialFund
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  return {
    getFinancialFunds: [getFinancialFunds, getFinancialFundsResult],
    createFinancialFund: [createFinancialFund, createResult],
    updateFinancialFund: [updateFinancialFund, updateResult],
    deleteFinancialFund: [deleteFinancialFund, deleteResult],
    adjustFinancialFund: [adjustFinancialFund, adjustResult]
  }
}

export default useFinancialFund
