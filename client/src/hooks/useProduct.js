import { useCallback } from 'react'

import { useLazyQuery, useMutation } from '@apollo/react-hooks'

import {
  GET_PRODUCT,
  GET_PRODUCT_BY_GTIN,
  GET_PRODUCTS,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  IMPORT_PRODUCTS
} from 'src/graphql/product/queries'

import useMe from 'src/hooks/useMe'
import useSnackbar from 'src/hooks/useSnackbar'
import useUser from 'src/hooks/useUser'

import { FirebaseEvents } from 'src/utils/enums'

import { analytics } from 'src/firebase'

const useProduct = () => {
  const { me } = useMe()
  const {
    updateMe: [updateMe]
  } = useUser()
  const { openSnackbar } = useSnackbar()

  const [getProductExecute, getProductResult] = useLazyQuery(GET_PRODUCT, {
    fetchPolicy: 'network-only'
  })
  const [getProductByGTINExecute, getProductByGTINResult] = useLazyQuery(GET_PRODUCT_BY_GTIN, {
    fetchPolicy: 'network-only'
  })
  const [getProductsExecute, getProductsResult] = useLazyQuery(GET_PRODUCTS, {
    fetchPolicy: 'network-only'
  })

  const [createProductMutate, createProductResult] = useMutation(CREATE_PRODUCT)
  const [updateProductMutate, updateProductResult] = useMutation(UPDATE_PRODUCT)
  const [deleteProductMutate, deleteProductResult] = useMutation(DELETE_PRODUCT)
  const [importProductsMutate, importProductsResult] = useMutation(IMPORT_PRODUCTS)

  const getProductByGTIN = useCallback((gtin) => {
    getProductByGTINExecute({ variables: { input: { gtin } } })
  }, [])

  const getProduct = useCallback((input) => {
    getProductExecute({ variables: { input } })
  }, [])

  const getProducts = useCallback(({ pagination } = {}) => {
    getProductsExecute({
      variables: {
        input: {
          pagination: { first: pagination.offset, skip: pagination.page * pagination.offset }
        }
      }
    })
  }, [])

  const createProduct = async (input) => {
    try {
      const {
        data: { createProduct }
      } = await createProductMutate({ variables: { input } })
      analytics.logEvent(FirebaseEvents.CREATE_PRODUCT)
      openSnackbar({ variant: 'success', message: 'Produto adicionado' })
      // eslint-disable-next-line
      getProductsResult?.refetch?.()

      if (!me?.onboarding?.finishedAddProduct) {
        updateMe({ onboarding: { finishedAddProduct: true } })
      }

      return createProduct
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  const updateProduct = async (input) => {
    try {
      const {
        data: { updateProduct }
      } = await updateProductMutate({ variables: { input } })
      analytics.logEvent(FirebaseEvents.UPDATE_PRODUCT)
      openSnackbar({ variant: 'success', message: 'Produto atualizado' })
      return updateProduct
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  const deleteProduct = async (input) => {
    try {
      const {
        data: { deleteProduct }
      } = await deleteProductMutate({ variables: { input } })
      analytics.logEvent(FirebaseEvents.DELETE_PRODUCT)
      openSnackbar({ variant: 'success', message: 'Produto apagado' })
      // eslint-disable-next-line
      getProductsResult?.refetch?.()
      return deleteProduct
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  const importProducts = async (products) => {
    try {
      await importProductsMutate({ variables: { input: { products } } })
      analytics.logEvent(FirebaseEvents.IMPORT_PRODUCTS)
      openSnackbar({ variant: 'success', message: 'Produtos importados' })
      // eslint-disable-next-line
      getProductsResult?.refetch?.()
    } catch (error) {
      analytics.logEvent(FirebaseEvents.IMPORT_PRODUCTS_FAIL)
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  return {
    getProduct: [getProduct, getProductResult],
    getProductByGTIN: [getProductByGTIN, getProductByGTINResult],
    getProducts: [getProducts, getProductsResult],
    createProduct: [createProduct, createProductResult],
    updateProduct: [updateProduct, updateProductResult],
    deleteProduct: [deleteProduct, deleteProductResult],
    importProducts: [importProducts, importProductsResult]
  }
}

export default useProduct
