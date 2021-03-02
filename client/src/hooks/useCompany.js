import { useCallback } from 'react'

import { useLazyQuery, useMutation } from '@apollo/react-hooks'

import {
  GET_MY_COMPANY,
  GET_MY_COMPANIES,
  UPDATE_MY_COMPANY,
  CREATE_MEMBER,
  DELETE_MEMBER,
  ACCEPT_INVITE,
  SIGNIN_COMPANY,
  CREATE_COMPANY
} from 'src/graphql/company/queries'

import useSnackbar from 'src/hooks/useSnackbar'

import { FirebaseEvents } from 'src/utils/enums'

import { analytics } from 'src/firebase'

const useCompany = () => {
  const { openSnackbar } = useSnackbar()

  const [getMyCompanyQuery, getMyCompanyResult] = useLazyQuery(GET_MY_COMPANY)
  const [getMyCompaniesQuery, getMyCompaniesResult] = useLazyQuery(GET_MY_COMPANIES)

  const [updateMyCompanyMutate, updateMyCompanyResult] = useMutation(UPDATE_MY_COMPANY)
  const [signinCompanyMutate, signinCompanyResult] = useMutation(SIGNIN_COMPANY)
  const [createMemberMutate, createMemberResult] = useMutation(CREATE_MEMBER)
  const [createCompanyMutate, createCompanyResult] = useMutation(CREATE_COMPANY)
  const [deleteMemberMutate, deleteMemberResult] = useMutation(DELETE_MEMBER)
  const [acceptInviteMutate, acceptInviteResult] = useMutation(ACCEPT_INVITE)

  /**
   * QUERIES
   */

  const getMyCompany = useCallback((input) => {
    getMyCompanyQuery({ variables: { input } })
  }, [])

  const getMyCompanies = useCallback((input) => {
    getMyCompaniesQuery({ variables: { input } })
  }, [])

  /**
   * MUTATIONS
   */

  const signinCompany = async (input, options = { message: 'Informações atualizadas!' }) => {
    try {
      const {
        data: { signinCompany }
      } = await signinCompanyMutate({ variables: { input } })

      openSnackbar({ variant: 'success', message: options.message })

      return signinCompany
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  const updateMyCompany = async (input, options = { message: 'Informações atualizadas!' }) => {
    try {
      const {
        data: { updateMyCompany }
      } = await updateMyCompanyMutate({ variables: { input } })

      if (input.address) {
        analytics.logEvent(FirebaseEvents.SET_ADDRESS)
      }

      openSnackbar({ variant: 'success', message: options.message })

      return updateMyCompany
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  const createMember = async (input, options = { message: 'Convite enviado!' }) => {
    try {
      const {
        data: { createMember }
      } = await createMemberMutate({ variables: { input } })

      openSnackbar({ variant: 'success', message: options.message })

      return createMember
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  const deleteMember = async (input, options = { message: 'Convite enviado!' }) => {
    try {
      const {
        data: { deleteMember }
      } = await deleteMemberMutate({ variables: { input } })

      openSnackbar({ variant: 'success', message: options.message })

      return deleteMember
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  const acceptInvite = async (input, options = {}) => {
    try {
      const {
        data: { acceptInvite }
      } = await acceptInviteMutate({ variables: { input } })

      return acceptInvite
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  const createCompany = async (input, options = {}) => {
    try {
      const {
        data: { createMember }
      } = await createCompanyMutate({ variables: { input } })

      if (options.message) {
        openSnackbar({ variant: 'success', message: options.message })
      }

      // eslint-disable-next-line
      getMyCompaniesResult?.refetch?.()

      return createMember
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  return {
    getMyCompany: [getMyCompany, getMyCompanyResult],
    getMyCompanies: [getMyCompanies, getMyCompaniesResult],
    createMember: [createMember, createMemberResult],
    createCompany: [createCompany, createCompanyResult],
    deleteMember: [deleteMember, deleteMemberResult],
    acceptInvite: [acceptInvite, acceptInviteResult],
    signinCompany: [signinCompany, signinCompanyResult],
    updateMyCompany: [updateMyCompany, updateMyCompanyResult]
  }
}

export default useCompany
