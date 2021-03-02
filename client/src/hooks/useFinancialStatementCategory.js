import { useMutation } from '@apollo/react-hooks'

import { DELETE_FINANCIAL_STATEMENT_CATEGORY } from 'src/graphql/financialStatementCategory/queries'

import useSnackbar from 'src/hooks/useSnackbar'

import { FirebaseEvents } from 'src/utils/enums'

import { analytics } from 'src/firebase'

const useFinancialFund = () => {
  const { openSnackbar } = useSnackbar()

  const [deleteMutate, deleteResult] = useMutation(DELETE_FINANCIAL_STATEMENT_CATEGORY)

  const deleteFinancialStatementCategory = async (input) => {
    try {
      const {
        data: { deleteFinancialFund }
      } = await deleteMutate({ variables: { input } })

      analytics.logEvent(FirebaseEvents.DELETE_FINANCIAL_STATEMENT_CATEGORY)
      openSnackbar({ variant: 'success', message: 'Categoria apagada!' })

      return deleteFinancialFund
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  return {
    deleteFinancialStatementCategory: [deleteFinancialStatementCategory, deleteResult]
  }
}

export default useFinancialFund
