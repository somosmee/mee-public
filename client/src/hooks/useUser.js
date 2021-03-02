import { useMutation } from '@apollo/react-hooks'

import { UPDATE_ME } from 'src/graphql/user/queries'

import useSnackbar from 'src/hooks/useSnackbar'

import { FirebaseEvents } from 'src/utils/enums'

import { analytics } from 'src/firebase'

const useUser = () => {
  const { openSnackbar } = useSnackbar()

  const [updateMeMutate, updateMeResult] = useMutation(UPDATE_ME)

  const updateMe = async (input, options = { message: 'Informações atualizadas!' }) => {
    try {
      const {
        data: { updateMe }
      } = await updateMeMutate({ variables: { input } })

      if (input.address) {
        analytics.logEvent(FirebaseEvents.SET_ADDRESS)
      }

      openSnackbar({ variant: 'success', message: options.message })

      return updateMe
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  return {
    updateMe: [updateMe, updateMeResult]
  }
}

export default useUser
