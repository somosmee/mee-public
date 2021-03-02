import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import DialogContent from '@material-ui/core/DialogContent'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'

import Add from '@material-ui/icons/Add'

import AddressDisplay from 'src/components/AddressDisplay'
import Button from 'src/components/Button'
import Dialog from 'src/components/Dialog'
import ShopfrontListItem from 'src/components/ShopfrontListItem'

import { DeliveryTypes, Payments } from 'src/utils/enums'

import useStyles from './styles'

const ShopfrontCartDialog = ({
  title,
  open,
  cart,
  loading,
  shopfront,
  onClean,
  onEditItem,
  onAddPaymentMethod,
  onAddFederalTaxNumber,
  onClose,
  onExited,
  onAddressChange,
  onDeliveryMethod,
  onSubmit
}) => {
  const classes = useStyles()

  const handleAddPaymentMethod = (event) => {
    onAddPaymentMethod()
  }

  const handleAddFederalTaxNumber = (event) => {
    onAddFederalTaxNumber()
  }

  const handleCleanCart = () => {
    onClean()
  }

  const hasPayment = !!cart.payments.length
  const freeDeliveryFee =
    cart?.delivery?.fee === 0 ||
    cart.delivery.method === DeliveryTypes.indoor.type ||
    cart.delivery.method === DeliveryTypes.takeout.type
  const total =
    cart.delivery.method === DeliveryTypes.delivery.type
      ? cart.subtotal + cart?.delivery?.fee
      : cart.subtotal

  return (
    <Dialog title={title} open={open} onClose={onClose} onExited={onExited}>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid xs={12} item container justify='flex-end'>
            <Button onClick={handleCleanCart} color='primary'>
              Limpar
            </Button>
          </Grid>
          <Grid xs={12} item>
            <Button onClick={onDeliveryMethod} color='primary' fullWidth>
              {cart.delivery.method === DeliveryTypes.indoor.type && 'Pedido no local'}
              {cart.delivery.method === DeliveryTypes.takeout.type && 'Pedido para retirada'}
              {cart.delivery.method === DeliveryTypes.delivery.type && 'Pedido para entrega'}
            </Button>
          </Grid>
          <Grid xs={12} item>
            <Divider className={classes.divider} />
          </Grid>
          <Grid xs={12} item>
            {cart.delivery.method === DeliveryTypes.indoor.type && (
              <Typography>O pedido será entregue na mesa</Typography>
            )}
            {cart.delivery.method === DeliveryTypes.takeout.type && (
              <>
                <Typography gutterBottom>Retirar em</Typography>
                <AddressDisplay address={shopfront.address} />
              </>
            )}
            {cart.delivery.method === DeliveryTypes.delivery.type && (
              <ListItem
                className={classes.listItem}
                button
                onClick={onAddressChange}
                disableGutters
              >
                <Grid container>
                  <Grid item xs={12}>
                    <Typography gutterBottom>Entregar em</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <AddressDisplay address={cart.delivery.address} />
                  </Grid>
                </Grid>
              </ListItem>
            )}
          </Grid>
          <Grid xs={12} item>
            <Divider className={classes.divider} />
          </Grid>
          <Grid xs={12} item>
            <Typography variant='h6'>{shopfront?.name || 'Nome do local'}</Typography>
            <List className={classes.table}>
              {cart?.items.map((row) => (
                <>
                  <ShopfrontListItem isCart onClick={onEditItem} data={row} />
                  <Divider />
                </>
              ))}
            </List>
            <Button
              onClick={onClose}
              fullWidth
              startIcon={<Add />}
              variant='outlined'
              color='primary'
              size='large'
            >
              Adicionar mais itens
            </Button>
          </Grid>
          <Grid xs={12} item>
            <Divider className={classes.divider} />
          </Grid>
          <Grid xs={12} item>
            <Grid xs={12} item container justify='space-between'>
              <Typography>Subtotal</Typography>
              <Typography>{`R$ ${cart?.subtotal.toFixed(2)}`}</Typography>
            </Grid>
            {cart.delivery.method === DeliveryTypes.delivery.type && (
              <Grid xs={12} item container justify='space-between'>
                <Typography>Taxa de entrega</Typography>
                <Typography
                  className={classNames({
                    [classes.delivery]: freeDeliveryFee
                  })}
                >
                  {freeDeliveryFee ? 'Grátis' : `R$ ${cart.delivery.fee.toFixed(2)}`}
                </Typography>
              </Grid>
            )}
            <Grid xs={12} item container justify='space-between'>
              <Typography variant='h6'>Total</Typography>
              <Typography variant='h6'>{`R$ ${total.toFixed(2)}`}</Typography>
            </Grid>
          </Grid>
          <Grid xs={12} item>
            <Divider className={classes.divider} />
          </Grid>
          <Grid xs={12} item>
            <Grid container spacing={1} alignItems='center'>
              <Grid item xs>
                <Typography>
                  {hasPayment
                    ? `${Payments[cart.payments[0]?.method]?.label} ${
                        cart.payments[0]?.method === Payments.cash.type &&
                        cart.payments[0]?.received
                          ? `(Troco para: ${cart.payments[0]?.received?.toFixed(2)})`
                          : ''
                    }`
                    : 'Pagamento'}
                </Typography>
                {(cart.delivery.method === DeliveryTypes.indoor.type ||
                  cart.delivery.method === DeliveryTypes.takeout.type) &&
                  cart.payments[0]?.method && (
                  <Typography variant='caption' color='textSecondary'>
                      O pagamento deverá ser feito no caixa
                  </Typography>
                )}
                {cart.delivery.method === DeliveryTypes.delivery.type && hasPayment && (
                  <Typography variant='caption' color='textSecondary'>
                    O pagamento deverá ser efetuado na entrega
                  </Typography>
                )}
              </Grid>
              <Grid item>
                <Button
                  onClick={handleAddPaymentMethod}
                  variant='outlined'
                  color='primary'
                  size='small'
                >
                  {hasPayment ? 'Editar' : 'Adicionar'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={12} item>
            <Divider className={classes.divider} />
          </Grid>
          <Grid xs={12} item>
            <Grid container justify='space-between' alignItems='center'>
              <Grid item xs>
                <Typography>{cart.nationalId ? cart.nationalId : 'CPF ou CNPJ'}</Typography>
                {!cart.nationalId && (
                  <Typography variant='caption' color='textSecondary'>
                    Para emissão de nota fiscal
                  </Typography>
                )}
              </Grid>
              <Grid item>
                <Button
                  onClick={handleAddFederalTaxNumber}
                  variant='outlined'
                  color='primary'
                  size='small'
                >
                  {cart.nationalId ? 'Editar' : 'Adicionar'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={12} item>
            <Divider className={classes.divider} />
          </Grid>
          <Grid xs={12} item>
            <Button
              onClick={onSubmit}
              variant='contained'
              color='primary'
              size='large'
              loading={loading}
              disabled={!hasPayment}
              fullWidth
            >
              Fazer pedido
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

ShopfrontCartDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  cart: PropTypes.object,
  shopfront: PropTypes.object,
  loading: PropTypes.bool,
  address: PropTypes.object,
  onAddPaymentMethod: PropTypes.func,
  onAddFederalTaxNumber: PropTypes.func,
  onClean: PropTypes.func,
  onClose: PropTypes.func,
  onExited: PropTypes.func,
  onEditItem: PropTypes.func,
  onDeliveryMethod: PropTypes.func,
  onAddressChange: PropTypes.func,
  onSubmit: PropTypes.func
}

ShopfrontCartDialog.defaultProps = {
  onEditItem: () => {},
  onAddPaymentMethod: () => {},
  onAddFederalTaxNumber: () => {},
  onClean: () => {},
  onClose: () => {},
  onExited: () => {},
  onDeliveryMethod: () => {},
  onAddressChange: () => {},
  onSubmit: () => {}
}

export default ShopfrontCartDialog
