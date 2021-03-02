import React from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { useQuery, useMutation } from '@apollo/react-hooks'

import ShopfrontPublicView from 'src/views/ShopfrontPublicView'

import { OPEN_NOTIFICATION } from 'src/graphql/notification/queries'
import { CREATE_ORDER_SHOPFRONT } from 'src/graphql/order/queries'
import { GET_SHOPFRONTS } from 'src/graphql/shopfront/queries'
import {
  GET_CART,
  RESET_CART,
  ADD_ITEM_CART,
  UPDATE_QUANTITY_ITEM_CART,
  UPDATE_DELIVERY_CART,
  REMOVE_ITEM_CART,
  ADD_PAYMENT_CART,
  ADD_FEDERAL_TAX_NUMBER_CART,
  DELETE_FEDERAL_TAX_NUMBER_CART
} from 'src/graphql/shopfrontCart/queries'

const ShopfrontPublicContainer = () => {
  const history = useHistory()
  const { shopfrontId } = useParams()

  /**
   * GRAPHQL QUERIES & MUTATIONS
   */
  const { data: dataCart } = useQuery(GET_CART)
  const { data, loading } = useQuery(GET_SHOPFRONTS, { variables: { id: shopfrontId } })
  const [resetCart] = useMutation(RESET_CART)
  const [addItem] = useMutation(ADD_ITEM_CART)
  const [removeItem] = useMutation(REMOVE_ITEM_CART)
  const [updateQuantityItem] = useMutation(UPDATE_QUANTITY_ITEM_CART)
  const [updateDelivery] = useMutation(UPDATE_DELIVERY_CART)
  const [openNotification] = useMutation(OPEN_NOTIFICATION)
  const [createOrder, { loading: createOrderLoading }] = useMutation(CREATE_ORDER_SHOPFRONT)
  const [addPayment] = useMutation(ADD_PAYMENT_CART)
  const [addFederalTaxNumber] = useMutation(ADD_FEDERAL_TAX_NUMBER_CART)
  const [deleteFederalTaxNumber] = useMutation(DELETE_FEDERAL_TAX_NUMBER_CART)

  const handleAddItem = async (item) => {
    try {
      await addItem({ variables: { input: item } })
    } catch (e) {
      openNotification({
        variables: { input: { variant: 'error', message: 'Falha ao adicionar item ao carrinho' } }
      })
    }
  }

  const handleRemoveItem = async (item) => {
    try {
      await removeItem({ variables: { input: item } })
    } catch (e) {
      openNotification({
        variables: { input: { variant: 'error', message: 'Falha ao remover item ao carrinho' } }
      })
    }
  }

  const handleUpdateQuantityItem = async (item) => {
    try {
      await updateQuantityItem({ variables: { input: item } })
    } catch (e) {
      openNotification({
        variables: { input: { variant: 'error', message: 'Falha ao atualizar quantidade' } }
      })
    }
  }

  const handleUpdateDelivery = async (input) => {
    try {
      await updateDelivery({ variables: { input } })
    } catch (e) {
      openNotification({
        variables: { input: { variant: 'error', message: 'Falha ao atualizar tipo de pedido' } }
      })
    }
  }

  const handleOnEmptyCartMessage = () => {
    openNotification({
      variables: { input: { variant: 'success', message: 'Seu carrinho está vazio!' } }
    })
  }

  const handleClean = async () => {
    await resetCart()
  }

  const handleAddPayment = async (input) => {
    try {
      await addPayment({ variables: { input } })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleAddFederalTaxNumber = async (input) => {
    try {
      await addFederalTaxNumber({ variables: { input } })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleDeleteFederalTaxNumber = async () => {
    try {
      await deleteFederalTaxNumber()
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleCreateOrder = async (input) => {
    try {
      const {
        data: { createOrderShopfront }
      } = await createOrder({ variables: { input } })
      resetCart()
      history.push(`/orders/${createOrderShopfront._id}/preview`)
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  return (
    <ShopfrontPublicView
      onClean={handleClean}
      onAddItem={handleAddItem}
      onRemoveItem={handleRemoveItem}
      onUpdateQuantityItem={handleUpdateQuantityItem}
      onUpdateDelivery={handleUpdateDelivery}
      onEmptyCartMessage={handleOnEmptyCartMessage}
      shopfront={data?.shopfronts}
      cart={dataCart?.shopfrontCart}
      loading={loading}
      createOrderLoading={createOrderLoading}
      onAddPayment={handleAddPayment}
      onAddFederalTaxNumber={handleAddFederalTaxNumber}
      onDeleteFederalTaxNumber={handleDeleteFederalTaxNumber}
      onCreateOrder={handleCreateOrder}
    />
  )
}

ShopfrontPublicContainer.propTypes = {}

ShopfrontPublicContainer.defaultProps = {}

export default ShopfrontPublicContainer
