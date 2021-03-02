import React, { useState, useEffect } from 'react'

import cep from 'cep-promise'
import PropTypes from 'prop-types'

import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import AddCircleIcon from '@material-ui/icons/AddCircleOutline'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircleOutline'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'

import AddFederalTaxNumberDialog from 'src/components/AddFederalTaxNumberDialog'
import AddPaymentMethodDialog from 'src/components/AddPaymentMethodDialog'
import ChangeForDialog from 'src/components/ChangeForDialog'
import CustomerInfoDialog from 'src/components/CustomerInfoDialog'
import UpsertAddressStep from 'src/components/DeliverySteps/UpsertAddressStep'
import Dialog from 'src/components/Dialog'
import Main from 'src/components/Main'
import ShopfrontCartDialog from 'src/components/ShopfrontCartDialog'
import ShopfrontDeliveryMethodDialog from 'src/components/ShopfrontDeliveryMethodDialog'
import ShopfrontEditItemDialog from 'src/components/ShopfrontEditItemDialog'
import ShopfrontPublic from 'src/components/ShopfrontPublic'

import addressUtils from 'src/utils/address'
import { Payments, DeliveryTypes } from 'src/utils/enums'

import helpscout from 'src/services/helpscout'

import useStyles from './styles'

const ITEM_INITIAL_STATE = {
  quantity: 1,
  note: ''
}

const ShopfrontPublicView = ({
  loading,
  createOrderLoading,
  shopfront,
  cart,
  onClean,
  onAddItem,
  onRemoveItem,
  onCreateOrder,
  onUpdateQuantityItem,
  onUpdateDelivery,
  onEmptyCartMessage,
  onAddPayment,
  onAddFederalTaxNumber,
  onDeleteFederalTaxNumber
}) => {
  /**
   * CLASSES & STYLES
   */
  const classes = useStyles()

  useEffect(() => {
    helpscout.hideBeacon()
  }, [])

  /**
   * REACT STATE
   */

  const [item, setItem] = useState(ITEM_INITIAL_STATE)
  const [address, setAddress] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editItemOpen, setEditItemOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [customerInfoOpen, setCustomerInfoOpen] = useState(false)
  const [deliveryTypeOpen, setDeliveryTypeOpen] = useState(false)
  const [isItemDetailOpen, setIsItemDetailOpen] = useState(false)
  const [upsertAddressOpen, setUpsertAddressOpen] = useState(false)
  const [addPaymentMethodOpen, setAddPaymentMethodOpen] = useState(false)
  const [changeForOpen, setChangeForOpen] = useState(false)
  const [addFederalTaxNumberOpen, setAddFederalTaxNumberOpen] = useState(false)

  /**
   * VIEW CONTROLLER
   */

  const handleOpenCart = () => {
    setIsCartOpen(true)
  }

  const handleCloseCart = () => {
    setIsCartOpen(false)
  }

  const handleChangeOpen = () => {
    setChangeForOpen(true)
  }

  const handleChangeForClose = () => {
    setChangeForOpen(false)
  }

  const handleAddPaymentMethodOpen = () => {
    setAddPaymentMethodOpen(true)
  }

  const handleAddPaymentMethodClose = () => {
    setAddPaymentMethodOpen(false)
  }

  const handleAddFederalTaxNumberOpen = () => {
    setAddFederalTaxNumberOpen(true)
  }

  const handleAddFederalTaxNumberClose = () => {
    setAddFederalTaxNumberOpen(false)
  }

  const handleSelectProduct = (product) => {
    setSelectedProduct(product)
    setIsItemDetailOpen(true)
  }

  const handleCloseItemDetail = () => {
    setIsItemDetailOpen(false)
  }

  const handleExitedItemDetail = () => {
    setSelectedProduct(null)
    setItem(ITEM_INITIAL_STATE)
  }

  const handleNoteChange = (event) => {
    const note = event.target.value
    setItem((prevState) => ({ ...prevState, note }))
  }

  const handleAddQuantity = () => {
    setItem((prevState) => ({ ...prevState, quantity: prevState.quantity + 1 }))
  }

  const handleSubtractQuantity = () => {
    setItem((prevState) => ({ ...prevState, quantity: prevState.quantity - 1 }))
  }

  const handleAddItem = async () => {
    await onAddItem({ ...selectedProduct, ...item })
    setIsItemDetailOpen(false)
  }

  const handleCleanCart = async () => {
    setIsCartOpen(false)
    onClean()
  }

  const handleOnEditItemOpen = (item) => () => {
    setSelectedItem(item)
    setEditItemOpen(true)
  }

  const handleOnEditItemClose = () => {
    setEditItemOpen(false)
  }

  const handleOnEditItemExited = () => {
    setSelectedItem(null)
  }

  const handleDeliveryMethodOpen = () => {
    setDeliveryTypeOpen(true)
  }

  const handleDeliveryMethodClose = () => {
    setDeliveryTypeOpen(false)
  }

  const handleUpsertAddressOpen = () => {
    setUpsertAddressOpen(true)
  }

  const handleUpsertAddressClose = () => {
    setUpsertAddressOpen(false)
  }

  const handleUpsertAddressExited = () => {
    setAddress(null)
  }

  const handleCustomerInfoOpen = () => {
    setCustomerInfoOpen(true)
  }

  const handleCustomerInfoClose = () => {
    setCustomerInfoOpen(false)
  }

  const handlePostalCode = async (value) => {
    try {
      const { state, city, street, neighborhood } = await cep(value)
      const address = { postalCode: value, state, city, street, district: neighborhood }
      setAddress(address)
    } catch (error) {
      setAddress({ postalCode: value })
    }
  }

  const handleUpsertAddressSubmit = async ({ noNumber, ...input }) => {
    if (noNumber) input.number = 'S/N'

    handleUpsertAddressClose(false)
    const geoData = await addressUtils.geocodeAddress(input)

    const address = { ...input, ...geoData }

    const fee = await addressUtils.calculateDeliveryFee(shopfront, address)

    const delivery = {
      fee,
      method: DeliveryTypes.delivery.type,
      address
    }
    onUpdateDelivery(delivery)
  }

  const handleDeliveryMethodChange = (input) => {
    if (input.method === DeliveryTypes.delivery.type) {
      handleUpsertAddressOpen()
    } else {
      onUpdateDelivery({ address: null, ...input })
    }

    handleDeliveryMethodClose()
  }

  const handleOnEditItemSubmit = async (input) => {
    if (input.quantity > 0) {
      await onUpdateQuantityItem(input)
      handleOnEditItemClose()
    } else {
      await onRemoveItem(input)
      handleOnEditItemClose()

      if (cart?.items?.length === 1) {
        onEmptyCartMessage()
        handleCloseCart()
      }
    }
  }

  const handleAddPaymentMethod = async (input) => {
    handleAddPaymentMethodClose()

    if (input.method === Payments.cash.type) {
      handleChangeOpen()
    } else {
      const deliveryFee =
        cart.delivery.method === DeliveryTypes.delivery.type
          ? await addressUtils.calculateDeliveryFee(shopfront, cart.delivery.address)
          : 0

      onAddPayment({ ...input, deliveryFee })
    }
  }

  const handleChangeForSubmit = async (input) => {
    const deliveryFee =
      cart.delivery.method === DeliveryTypes.delivery.type
        ? await addressUtils.calculateDeliveryFee(shopfront, cart.delivery.address)
        : 0
    const payment = {
      method: Payments.cash.type,
      received: parseFloat(input.changeFor),
      deliveryFee
    }
    onAddPayment(payment)
    handleChangeForClose()
  }

  const handleAddFederalTaxNumber = (input) => {
    onAddFederalTaxNumber(input)
    handleAddFederalTaxNumberClose()
  }

  const handleDeleteFederalTaxNumber = () => {
    onDeleteFederalTaxNumber()
    handleAddFederalTaxNumberClose()
  }

  const handleCartSubmit = () => {
    handleCustomerInfoOpen()
  }

  const handleCustomerInfoSubmit = async (data) => {
    handleCustomerInfoClose()

    const input = {
      merchant: shopfront.merchant,
      delivery: cart.delivery,
      items: cart.items,
      payments: cart.payments,
      customer: {
        ...data,
        nationalId: cart.nationalId
      }
    }

    const { street, number, complement, district, city, state, postalCode } = input.delivery.address
    if (!street && !number && !complement && !district && !city && !state && !postalCode) {
      delete input.delivery.address
    }

    await onCreateOrder(input)
    setIsCartOpen(false)
  }

  const fab = !!cart?.items?.length && {
    actions: {
      badge: cart?.items?.length,
      icon: <ShoppingCartIcon />,
      label: `Carrinho R$ ${cart?.subtotal?.toFixed(2) ?? '0.00'}`,
      variant: 'extended',
      onClick: handleOpenCart
    }
  }

  return (
    <Main fab={fab} bottomNavigation={false}>
      <Box className={classes.root} width='100%' marginTop={5}>
        <Grid
          className={classes.content}
          container
          direction='column'
          alignItems='center'
          justify='space-between'
        >
          <Grid xs={12} item container justify='center'>
            <ShopfrontPublic shopfront={shopfront} onSelect={handleSelectProduct} />
          </Grid>
        </Grid>
        <ShopfrontCartDialog
          title='Carrinho'
          open={isCartOpen}
          shopfront={shopfront}
          cart={cart}
          loading={createOrderLoading}
          onAddressChange={handleUpsertAddressOpen}
          onEditItem={handleOnEditItemOpen}
          onDeliveryMethod={handleDeliveryMethodOpen}
          onAddFederalTaxNumber={handleAddFederalTaxNumberOpen}
          onClean={handleCleanCart}
          onClose={handleCloseCart}
          onSubmit={handleCartSubmit}
        />
        {selectedItem && (
          <ShopfrontEditItemDialog
            open={editItemOpen}
            item={selectedItem}
            onClose={handleOnEditItemClose}
            onExited={handleOnEditItemExited}
            onSubmit={handleOnEditItemSubmit}
          />
        )}
        <ShopfrontCartDialog
          title='Carrinho'
          open={isCartOpen}
          shopfront={shopfront}
          cart={cart}
          address={address}
          onAddressChange={handleUpsertAddressOpen}
          onEditItem={handleOnEditItemOpen}
          onDeliveryMethod={handleDeliveryMethodOpen}
          onAddPaymentMethod={handleAddPaymentMethodOpen}
          onAddFederalTaxNumber={handleAddFederalTaxNumberOpen}
          onClean={handleCleanCart}
          onClose={handleCloseCart}
          onSubmit={handleCartSubmit}
        />
        {selectedItem && (
          <ShopfrontEditItemDialog
            open={editItemOpen}
            item={selectedItem}
            onClose={handleOnEditItemClose}
            onExited={handleOnEditItemExited}
            onSubmit={handleOnEditItemSubmit}
          />
        )}
        <ShopfrontDeliveryMethodDialog
          open={deliveryTypeOpen}
          address={address}
          method={cart.delivery.method}
          onDeliveryMethodChange={handleDeliveryMethodChange}
          onClose={handleDeliveryMethodClose}
        />
        <AddPaymentMethodDialog
          open={addPaymentMethodOpen}
          method={cart.payments[0]?.method}
          onChange={handleAddPaymentMethod}
          onClose={handleAddPaymentMethodClose}
        />
        <ChangeForDialog
          open={changeForOpen}
          changeFor={
            cart.payments[0]?.received === Payments.cash.type && cart.payments[0]?.received
          }
          onSubmit={handleChangeForSubmit}
          onClose={handleChangeForClose}
        />
        <AddFederalTaxNumberDialog
          open={addFederalTaxNumberOpen}
          cart={cart}
          onAddFederalTaxNumber={handleAddFederalTaxNumber}
          onDeleteFederalTaxNumber={handleDeleteFederalTaxNumber}
          onClose={handleAddFederalTaxNumberClose}
        />
        <CustomerInfoDialog
          title='Adicione suas infomações'
          open={customerInfoOpen}
          onSubmit={handleCustomerInfoSubmit}
          onClose={handleCustomerInfoClose}
        />
        <Dialog
          title='Detalhes do item'
          open={isItemDetailOpen}
          onClose={handleCloseItemDetail}
          onExited={handleExitedItemDetail}
        >
          <>
            <DialogContent>
              <Grid
                className={classes.content}
                container
                direction='column'
                justify='space-between'
              >
                <Grid item>
                  <Avatar
                    className={classes.avatar}
                    alt={selectedProduct?.name}
                    variant='rounded'
                    src={selectedProduct?.image}
                  />
                  <Typography variant='h5' gutterBottom>
                    {selectedProduct?.name}
                  </Typography>
                  <Typography variant='subtitle1' gutterBottom>
                    {selectedProduct?.description}
                  </Typography>
                  <Divider className={classes.divider} />
                </Grid>
                <Grid item>
                  <Grid container justify='center' alignItems='center'>
                    <TextField
                      value={item.note}
                      onChange={handleNoteChange}
                      placeholder='Adicione instruções (sem cebola, pouco arroz, etc.)'
                      variant='outlined'
                      multiline
                      rows={2}
                      rowsMax={4}
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <Grid container justify='center' alignItems='center'>
                      <IconButton
                        onClick={handleSubtractQuantity}
                        disabled={item.quantity === 1}
                        aria-label='remover'
                      >
                        <RemoveCircleIcon fontSize='large' />
                      </IconButton>
                      <Typography variant='h2' gutterBottom>
                        {item.quantity}
                      </Typography>
                      <IconButton onClick={handleAddQuantity} aria-label='adicionar'>
                        <AddCircleIcon fontSize='large' />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleAddItem}
                fullWidth
                variant='contained'
                color='primary'
                size='large'
                startIcon={<AddShoppingCartIcon />}
              >{`Adicionar R$ ${(item.quantity * (selectedProduct?.price || 0.0)).toFixed(
                  2
                )}`}</Button>
            </DialogActions>
          </>
        </Dialog>
        <Dialog
          title='Adicione seu endereço'
          fullWidth
          open={upsertAddressOpen}
          onClose={handleUpsertAddressClose}
          onExited={handleUpsertAddressExited}
        >
          <UpsertAddressStep
            initialValues={address}
            onPostalCode={handlePostalCode}
            onSubmit={handleUpsertAddressSubmit}
          />
        </Dialog>
      </Box>
    </Main>
  )
}

ShopfrontPublicView.propTypes = {
  cart: PropTypes.object,
  loading: PropTypes.bool,
  createOrderLoading: PropTypes.bool,
  shopfront: PropTypes.object,
  onClean: PropTypes.func,
  onAddItem: PropTypes.func,
  onRemoveItem: PropTypes.func,
  onCreateOrder: PropTypes.func,
  onUpdateQuantityItem: PropTypes.func,
  onUpdateDelivery: PropTypes.func,
  onEmptyCartMessage: PropTypes.func,
  onAddPayment: PropTypes.func,
  onAddFederalTaxNumber: PropTypes.func,
  onDeleteFederalTaxNumber: PropTypes.func
}

ShopfrontPublicView.defaultProps = {
  onClean: () => {},
  onAddItem: () => {},
  onRemoveItem: () => {},
  onCreateOrder: () => {},
  onUpdateQuantityItem: () => {},
  onUpdateDelivery: () => {},
  onEmptyCartMessage: () => {},
  onAddPayment: () => {},
  onAddFederalTaxNumber: () => {},
  onDeleteFederalTaxNumber: () => {}
}

export default ShopfrontPublicView
