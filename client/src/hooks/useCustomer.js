import { useCallback } from 'react'

import { useLazyQuery, useMutation } from '@apollo/react-hooks'

import {
  GET_CUSTOMER,
  GET_CUSTOMERS,
  CREATE_CUSTOMER,
  UPDATE_CUSTOMER,
  DELETE_CUSTOMER,
  CREATE_CUSTOMER_ADDRESS,
  UPDATE_CUSTOMER_ADDRESS,
  DELETE_CUSTOMER_ADDRESS
} from 'src/graphql/customer/queries'

import useSnackbar from 'src/hooks/useSnackbar'

import { FirebaseEvents } from 'src/utils/enums'

import { analytics } from 'src/firebase'

const useCustomer = () => {
  const { openSnackbar } = useSnackbar()

  const [getCustomerExecute, getCustomerResult] = useLazyQuery(GET_CUSTOMER, {
    fetchPolicy: 'network-only'
  })
  const [getCustomersExecute, getCustomersResult] = useLazyQuery(GET_CUSTOMERS, {
    fetchPolicy: 'network-only'
  })

  const [createCustomerMutate, createCustomerResult] = useMutation(CREATE_CUSTOMER)
  const [updateCustomerMutate, updateCustomerResult] = useMutation(UPDATE_CUSTOMER)
  const [deleteCustomerMutate, deleteCustomerResult] = useMutation(DELETE_CUSTOMER)
  const [createCustomerAddressMutate, createCustomerAddressResult] = useMutation(
    CREATE_CUSTOMER_ADDRESS
  )
  const [updateCustomerAddressMutate, updateCustomerAddressResult] = useMutation(
    UPDATE_CUSTOMER_ADDRESS
  )
  const [deleteCustomerAddressMutate, deleteCustomerAddressResult] = useMutation(
    DELETE_CUSTOMER_ADDRESS
  )

  const getCustomer = useCallback((input) => {
    getCustomerExecute({ variables: { input } })
  }, [])

  const getCustomers = ({ pagination } = {}) => {
    getCustomersExecute({
      variables: {
        input: {
          pagination: { first: pagination.offset, skip: pagination.page * pagination.offset }
        }
      }
    })
  }

  const createCustomer = async (input) => {
    try {
      const {
        data: { createCustomer }
      } = await createCustomerMutate({ variables: { input } })
      analytics.logEvent(FirebaseEvents.CREATE_CUSTOMER)
      openSnackbar({ variant: 'success', message: 'Cliente adicionado' })
      // eslint-disable-next-line
      getCustomersResult?.refetch?.()
      return createCustomer
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  const updateCustomer = async (input) => {
    try {
      const {
        data: { updateCustomer }
      } = await updateCustomerMutate({ variables: { input } })
      analytics.logEvent(FirebaseEvents.UPDATE_CUSTOMER)
      openSnackbar({ variant: 'success', message: 'Cliente atualizado' })
      return updateCustomer
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  const deleteCustomer = async (input) => {
    try {
      const {
        data: { deleteCustomer }
      } = await deleteCustomerMutate({ variables: { input } })
      analytics.logEvent(FirebaseEvents.DELETE_CUSTOMER)
      openSnackbar({ variant: 'success', message: 'Cliente apagado' })
      // eslint-disable-next-line
      getCustomersResult?.refetch?.()
      return deleteCustomer
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  const createCustomerAddress = async (input) => {
    try {
      const {
        data: { createCustomerAddress }
      } = await createCustomerAddressMutate({ variables: { input } })
      analytics.logEvent(FirebaseEvents.CREATE_CUSTOMER_ADDRESS)
      openSnackbar({ variant: 'success', message: 'Endereço adicionado' })
      return createCustomerAddress
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  const updateCustomerAddress = async (input) => {
    try {
      const {
        data: { updateCustomerAddress }
      } = await updateCustomerAddressMutate({ variables: { input } })
      analytics.logEvent(FirebaseEvents.UPDATE_CUSTOMER_ADDRESS)
      openSnackbar({ variant: 'success', message: 'Endereço atualizado' })
      return updateCustomerAddress
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  const deleteCustomerAddress = async (input) => {
    try {
      const {
        data: { deleteCustomerAddress }
      } = await deleteCustomerAddressMutate({ variables: { input } })
      analytics.logEvent(FirebaseEvents.DELETE_CUSTOMER_ADDRESS)
      openSnackbar({ variant: 'success', message: 'Endereço apagado' })
      return deleteCustomerAddress
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  return {
    getCustomer: [getCustomer, getCustomerResult],
    getCustomers: [getCustomers, getCustomersResult],
    createCustomer: [createCustomer, createCustomerResult],
    updateCustomer: [updateCustomer, updateCustomerResult],
    deleteCustomer: [deleteCustomer, deleteCustomerResult],
    createCustomerAddress: [createCustomerAddress, createCustomerAddressResult],
    updateCustomerAddress: [updateCustomerAddress, updateCustomerAddressResult],
    deleteCustomerAddress: [deleteCustomerAddress, deleteCustomerAddressResult]
  }
}

export default useCustomer
