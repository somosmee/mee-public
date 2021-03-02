import { useCallback } from 'react'

import { useQuery, useMutation } from '@apollo/react-hooks'

import {
  GET_NOTIFICATION,
  OPEN_NOTIFICATION,
  CLOSE_NOTIFICATION,
  CLEAR_NOTIFICATION
} from 'src/graphql/notification/queries'

import { SnackbarVariants } from 'src/utils/enums'

const useSnackbar = () => {
  const {
    data: { notification: snackbar }
  } = useQuery(GET_NOTIFICATION)
  const [open] = useMutation(OPEN_NOTIFICATION)
  const [close] = useMutation(CLOSE_NOTIFICATION)
  const [clear] = useMutation(CLEAR_NOTIFICATION)

  const openSnackbar = useCallback(
    ({ variant = SnackbarVariants.success, message = 'Sucesso' } = {}) => {
      open({ variables: { input: { variant, message } } })
    },
    []
  )

  const closeSnackbar = useCallback(() => {
    close()
  }, [])

  const clearSnackbar = useCallback(() => {
    clear()
  }, [])

  return {
    snackbar,
    openSnackbar,
    closeSnackbar,
    clearSnackbar
  }
}

export default useSnackbar
