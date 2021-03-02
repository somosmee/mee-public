import React, { useContext, useState, useRef, useEffect } from 'react'

import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import Dialog from 'src/components/Dialog'
import Main from 'src/components/Main'
import OrderWidget from 'src/components/OrderWidget'

import {
  GET_CART,
  ADD_ITEM_TO_CART,
  REMOVE_ITEM_FROM_CART,
  RESET_CART
} from 'src/graphql/cart/queries'
import { OPEN_NOTIFICATION } from 'src/graphql/notification/queries'
import { GET_PRODUCT } from 'src/graphql/product/queries'
import { GET_SETTINGS } from 'src/graphql/settings/queries'

import AppBarContext from 'src/contexts/AppBarContext'

import useOrder from 'src/hooks/useOrder'

import AddPaymentContent from 'src/dialogs/AddPaymentDialog/AddPaymentContent'
import WeightDialog from 'src/dialogs/WeightDialog'

import { Measurements, FirebaseEvents } from 'src/utils/enums'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const INITIAL_DIALOG_STATE = {
  payment: false,
  weight: false
}

const CheckoutView = ({ onToggleChange }) => {
  /**
   * STYLES & SCREEN
   */
  const classes = useStyles()

  const [, setAppBar] = useContext(AppBarContext)

  const [gtin, setGtin] = useState(null)
  const [quantity, setQuantity] = useState(null)
  const [openDialog, setOpenDialog] = useState(INITIAL_DIALOG_STATE)
  const [openDialogPayment, setOpenDialogPayment] = useState(false)
  const inputRef = useRef(null)

  const {
    data: { settings }
  } = useQuery(GET_SETTINGS)

  const {
    data: {
      cart: { items, nationalId, total }
    }
  } = useQuery(GET_CART)
  const [getProduct, product] = useLazyQuery(GET_PRODUCT, { fetchPolicy: 'network-only' })
  const [addItem] = useMutation(ADD_ITEM_TO_CART)
  const [removeItem] = useMutation(REMOVE_ITEM_FROM_CART)
  const [resetCart] = useMutation(RESET_CART)
  const [openNotification] = useMutation(OPEN_NOTIFICATION)

  const { addPayment, upsertOrder, loading } = useOrder()

  const salesTypeValue = settings.options.salesType

  useEffect(() => {
    const title = 'Frente de caixa'
    setAppBar({
      prominent: false,
      overhead: false,
      color: 'white',
      title: title.toLowerCase(),
      salesToggle: true,
      salesTypeValue,
      onToggleChange
    })
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar, salesTypeValue, onToggleChange])

  useEffect(() => {
    if (gtin) {
      getProduct({ variables: { input: { gtin } } })
    }
  }, [gtin, getProduct])

  useEffect(() => {
    const addToCart = async () => {
      try {
        const { data } = product
        const { _id, gtin, name, description, price, measurement, ncm } = data.product

        const input = {
          product: _id,
          gtin,
          name,
          description,
          price,
          measurement,
          ncm,
          quantity: 1,
          note: ''
        }
        await addItem({ variables: { input } })
      } catch (error) {
        openNotification({
          variables: { input: { variant: 'warning', message: 'Produto não encontrado' } }
        })
      } finally {
        setGtin(null)
        setQuantity(null)
        inputRef.current.focus()
      }
    }

    if (product.called && product.data) {
      if (product.data.product.measurement === Measurements.kilogram.type) {
        setOpenDialog((prevState) => ({ ...prevState, weight: true }))
      } else {
        addToCart()
      }
    }
  }, [product, quantity, inputRef, addItem, openNotification])

  const handleDialogClose = () => {
    setOpenDialog(INITIAL_DIALOG_STATE)
    setGtin(null)
  }

  /**
   * Handle functions
   */

  // <OrgerWidget />
  const handleEanKeyPress = async (gtin) => {
    setGtin(gtin)
  }

  const handleAddWeight = async (quantity) => {
    setOpenDialog(INITIAL_DIALOG_STATE)

    try {
      const { data } = product
      const { _id, gtin, name, description, price, measurement, ncm } = data.product

      const input = {
        product: _id,
        gtin,
        name,
        description,
        price,
        measurement,
        ncm,
        quantity,
        note: ''
      }
      await addItem({ variables: { input } })
    } catch (error) {
      openNotification({
        variables: { input: { variant: 'warning', message: 'Produto não encontrado' } }
      })
    } finally {
      setGtin(null)
      setQuantity(null)
      inputRef.current.focus()
    }
  }

  const handleRemoveAllItems = async () => {
    try {
      await resetCart()
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    } finally {
      inputRef.current.focus()
    }
  }

  const handleRemoveItem = async (index) => {
    try {
      await removeItem({ variables: { index } })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    } finally {
      inputRef.current.focus()
    }
  }

  const handleOpenDialogPayment = () => {
    setOpenDialogPayment(true)
  }

  const handleCloseDialogPayment = () => {
    setOpenDialogPayment(false)
  }

  const handleAddPaymentSubmit = async (input) => {
    const res = await upsertOrder(
      { items, nationalId },
      {
        onSuccess: () => {
          handleCloseDialogPayment()
          resetCart()
        }
      }
    )

    if (res) {
      await addPayment({ _id: res.data.createOrder._id }, input, {
        onSuccess: handleCloseDialogPayment
      })
    }
  }

  const open = Object.values(openDialog).some((value) => value === true)

  return (
    <Main>
      <OrderWidget
        className={classes.orderWidget}
        ref={inputRef}
        loading={product.loading}
        items={items}
        total={total}
        hasCustomer={!!nationalId}
        onPayment={handleOpenDialogPayment}
        onEanKeyPress={handleEanKeyPress}
        onDeleteAllItems={handleRemoveAllItems}
        onDeleteItem={handleRemoveItem}
      />
      <Dialog
        id='cart-dialog'
        open={open}
        aria-labelledby='dialog-title'
        onClose={handleDialogClose}
      >
        {openDialog.weight && (
          <WeightDialog onCancel={handleDialogClose} onSubmit={handleAddWeight} />
        )}
      </Dialog>
      <Dialog open={openDialogPayment} activeContent={'payment'} onClose={handleCloseDialogPayment}>
        <AddPaymentContent
          id={'payment'}
          title={'Adicionar pagamento'}
          initialValues={{ total }}
          loading={loading}
          onClose={handleCloseDialogPayment}
          onSubmit={handleAddPaymentSubmit}
        />
      </Dialog>
    </Main>
  )
}

CheckoutView.propTypes = {
  salesTypeValue: PropTypes.string,
  onToggleChange: PropTypes.func
}

export default CheckoutView
