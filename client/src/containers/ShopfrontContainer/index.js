import React from 'react'

import { useQuery, useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import ShopfrontView from 'src/views/ShopfrontView'

import { OPEN_NOTIFICATION } from 'src/graphql/notification/queries'
import { CREATE_PRODUCT } from 'src/graphql/product/queries'
import {
  GET_SHOPFRONT,
  ADD_PRODUCT_SHOPFRONT,
  DELETE_PRODUCT_SHOPFRONT
} from 'src/graphql/shopfront/queries'

const ShopfrontContainer = () => {
  const { data, loading } = useQuery(GET_SHOPFRONT)
  const [createProduct, { loading: createProductLoading }] = useMutation(CREATE_PRODUCT)
  const [addProductShopfront] = useMutation(ADD_PRODUCT_SHOPFRONT)
  const [deleteProductShopfront] = useMutation(DELETE_PRODUCT_SHOPFRONT)
  const [openNotification] = useMutation(OPEN_NOTIFICATION)

  /**
   * ASYNC CONTROLLERS
   */
  const handleCreateProduct = async (input) => {
    try {
      await createProduct({ variables: { input } })

      openNotification({
        variables: { input: { variant: 'success', message: 'Produto criado com sucesso' } }
      })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleAddProductShopfront = async (input) => {
    try {
      await addProductShopfront({ variables: { input: { product: input.product } } })
      openNotification({
        variables: { input: { variant: 'success', message: 'Produto adicionado a vitrine' } }
      })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleDeleteProductShopfront = async (input) => {
    try {
      await deleteProductShopfront({ variables: { input } })
      openNotification({
        variables: { input: { variant: 'success', message: 'Produto removido da vitrine' } }
      })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleLinkCopied = () => {
    openNotification({
      variables: { input: { variant: 'success', message: 'Link copiado!' } }
    })
  }

  return (
    <ShopfrontView
      loading={loading}
      shopfront={data?.shopfront}
      onLinkCopied={handleLinkCopied}
      onCreateProduct={handleCreateProduct}
      createProductLoading={createProductLoading}
      onAddProductShopfront={handleAddProductShopfront}
      onDeleteProductShopfront={handleDeleteProductShopfront}
    />
  )
}

ShopfrontContainer.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object
}

ShopfrontContainer.defaultProps = {}

export default ShopfrontContainer
