import React from 'react'

import PropTypes from 'prop-types'

import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import CardActions from '@material-ui/core/CardActions'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Icon from '@material-ui/core/Icon'
import Paper from '@material-ui/core/Paper'
import { useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import LocalShipping from '@material-ui/icons/LocalShippingOutlined'
import MyLocation from '@material-ui/icons/MyLocationOutlined'
import Person from '@material-ui/icons/Person'
import ShoppingBasket from '@material-ui/icons/ShoppingBasketOutlined'
import Straighten from '@material-ui/icons/StraightenOutlined'

import Button from 'src/components/Button'

import { PaymentsLoggi } from 'src/utils/enums'

import useStyles from './styles'

const CreateOrderReviewStep = ({
  loading,
  data,
  onEditCustomer,
  onEditDimensions,
  onEditOrder,
  onEditCharge,
  onEditPickupAddress,
  onEditDeliveryAddress,
  onEditPayment,
  onConfirm
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md')) || true

  const hasCustomer = data?.customer
  const hasOrder = data?.order
  const hasDimensions = data?.dimensions
  const hasDeliveryAddress = data?.deliveryAddress
  const hasPickupDeliveryAddress = data?.pickupAddress
  const hasCharge = data?.charge

  const { customer, deliveryAddress, pickupAddress, charge, order, dimensions } = data

  return (
    <>
      <DialogContent className={classes.content}>
        {
          <Grid container spacing={2}>
            {hasCustomer && (
              <Box display='flex' flexDirection='column'>
                <Typography variant='overline' display='block' gutterBottom>
                  Cliente
                </Typography>
                <Grid container item xs={12} spacing={2} justify='center'>
                  <Grid item xs='auto'>
                    <Avatar>
                      <Person />
                    </Avatar>
                  </Grid>
                  <Grid item xs={upMedium ? true : 12}>
                    <Typography align={upMedium ? 'inherit' : 'center'}>
                      {customer.firstName} {customer.lastName}
                    </Typography>
                    <Typography
                      viariant='body2'
                      color='textSecondary'
                      align={upMedium ? 'inherit' : 'center'}
                    >
                      {customer.mobile}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <CardActions className={classes.cardActions}>
                      <Button size='small' color='primary' onClick={onEditCustomer}>
                        Escolher outro cliente
                      </Button>
                    </CardActions>
                  </Grid>
                  <Grid className={classes.gridItem} item xs={12}>
                    <Divider variant='middle' light />
                  </Grid>
                </Grid>
              </Box>
            )}
            {hasOrder && (
              <Box display='flex' flexDirection='column'>
                <Typography variant='overline' display='block' gutterBottom>
                  Pedido
                </Typography>
                <Grid container item xs={12} spacing={2} justify='center'>
                  <Grid item xs='auto'>
                    <Avatar>
                      <ShoppingBasket />
                    </Avatar>
                  </Grid>
                  <Grid item xs={upMedium ? true : 12}>
                    <Typography align={upMedium ? 'inherit' : 'center'}>
                      {order.shortID} {order.title}
                    </Typography>
                    <Typography
                      viariant='body2'
                      color='textSecondary'
                      align={upMedium ? 'inherit' : 'center'}
                    >
                      {order.items.map((item) => `${item.quantity} X ${item.name}, `)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <CardActions className={classes.cardActions}>
                      <Button size='small' color='primary' onClick={onEditOrder}>
                        Escolher outro pedido
                      </Button>
                    </CardActions>
                  </Grid>
                  <Grid className={classes.gridItem} item xs={12}>
                    <Divider variant='middle' light />
                  </Grid>
                </Grid>
              </Box>
            )}
            {hasDimensions && (
              <Box display='flex' flexDirection='column'>
                <Typography variant='overline' display='block' gutterBottom>
                  Dimensões
                </Typography>
                <Grid container item xs={12} spacing={2} justify='center'>
                  <Grid item xs='auto'>
                    <Avatar>
                      <Straighten />
                    </Avatar>
                  </Grid>
                  <Grid item xs={upMedium ? true : 12}>
                    <Typography align={upMedium ? 'inherit' : 'center'}>
                      largura: {dimensions.width} cm / altura: {dimensions.height} cm
                    </Typography>
                    <Typography align={upMedium ? 'inherit' : 'center'}>
                      profundidade: {dimensions.length} cm / peso: {dimensions.weight} g
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <CardActions className={classes.cardActions}>
                      <Button size='small' color='primary' onClick={onEditDimensions}>
                        Escolher outras dimensões
                      </Button>
                    </CardActions>
                  </Grid>
                  <Grid className={classes.gridItem} item xs={12}>
                    <Divider variant='middle' light />
                  </Grid>
                </Grid>
              </Box>
            )}
            {hasPickupDeliveryAddress && (
              <Box display='flex' flexDirection='column'>
                <Typography variant='overline' display='block' gutterBottom>
                  Endereço retirada
                </Typography>
                <Grid container item xs={12} spacing={2} justify='center'>
                  <Grid item xs='auto'>
                    <Avatar>
                      <MyLocation />
                    </Avatar>
                  </Grid>
                  <Grid item xs={upMedium ? true : 12}>
                    <Typography align={upMedium ? 'inherit' : 'center'}>
                      {`${pickupAddress.street}` +
                        `${pickupAddress.number ? `, ${pickupAddress.number}` : ''}`}
                    </Typography>
                    <Typography
                      viariant='body2'
                      color='textSecondary'
                      align={upMedium ? 'inherit' : 'center'}
                    >
                      {`${pickupAddress.complement ? `${pickupAddress.complement}, ` : ''}` +
                        `${pickupAddress.district}` +
                        ` - ${pickupAddress.city}, ${pickupAddress.state} - CEP ${pickupAddress.postalCode}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <CardActions className={classes.cardActions}>
                      <Button size='small' color='primary' onClick={onEditPickupAddress}>
                        Editar ou escolher outro
                      </Button>
                    </CardActions>
                  </Grid>
                  <Grid className={classes.gridItem} item xs={12}>
                    <Divider variant='middle' light />
                  </Grid>
                </Grid>
              </Box>
            )}
            {hasDeliveryAddress && (
              <Box display='flex' flexDirection='column'>
                <Typography variant='overline' display='block' gutterBottom>
                  Endereço entrega
                </Typography>
                <Grid container item xs={12} spacing={2} justify='center'>
                  <Grid item xs='auto'>
                    <Avatar>
                      <LocalShipping />
                    </Avatar>
                  </Grid>
                  <Grid item xs={upMedium ? true : 12}>
                    <Typography align={upMedium ? 'inherit' : 'center'}>
                      {`${deliveryAddress.street}` +
                        `${deliveryAddress.number ? `, ${deliveryAddress.number}` : ''}`}
                    </Typography>
                    <Typography
                      viariant='body2'
                      color='textSecondary'
                      align={upMedium ? 'inherit' : 'center'}
                    >
                      {`${deliveryAddress.complement ? `${deliveryAddress.complement}, ` : ''}` +
                        `${deliveryAddress.district}` +
                        ` - ${deliveryAddress.city}, ${deliveryAddress.state} - CEP ${deliveryAddress.postalCode}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <CardActions className={classes.cardActions}>
                      <Button size='small' color='primary' onClick={onEditDeliveryAddress}>
                        Editar ou escolher outro
                      </Button>
                    </CardActions>
                  </Grid>
                  <Grid className={classes.gridItem} item xs={12}>
                    <Divider variant='middle' light />
                  </Grid>
                </Grid>
              </Box>
            )}
            {hasCharge && (
              <Box display='flex' flexDirection='column'>
                <Typography variant='overline' display='block' gutterBottom>
                  Forma de pagamento
                </Typography>
                <Grid container item xs={12} spacing={2} justify='center'>
                  <Grid item xs='auto'>
                    <Avatar>
                      <Icon>{PaymentsLoggi[charge].icon}</Icon>
                    </Avatar>
                  </Grid>
                  <Grid item xs={upMedium ? true : 12}>
                    <Typography align={upMedium ? 'inherit' : 'center'}>
                      {PaymentsLoggi[charge].name}
                    </Typography>
                    <Typography
                      viariant='body2'
                      color='textSecondary'
                      align={upMedium ? 'inherit' : 'center'}
                    >
                      {PaymentsLoggi[charge].installment}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <CardActions className={classes.cardActions}>
                      <Button size='small' color='primary' onClick={onEditCharge}>
                        Modificar forma de pagamento
                      </Button>
                    </CardActions>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Grid>
        }
      </DialogContent>
      <Paper className={classes.actionPaper} elevation={10}>
        <DialogActions className={classes.actions}>
          <Button
            loading={loading}
            variant='contained'
            color='primary'
            size='large'
            fullWidth={!upMedium}
            onClick={onConfirm}
          >
            Pronto
          </Button>
        </DialogActions>
      </Paper>
    </>
  )
}

CreateOrderReviewStep.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.object,
  onEditDimensions: PropTypes.func,
  onEditCharge: PropTypes.func,
  onEditCustomer: PropTypes.func,
  onEditOrder: PropTypes.func,
  onEditPickupAddress: PropTypes.func,
  onEditDeliveryAddress: PropTypes.func,
  onEditPayment: PropTypes.func,
  onConfirm: PropTypes.func
}

CreateOrderReviewStep.defaultProps = {
  loading: false,
  data: {},
  onEditDimensions: () => {},
  onEditCharge: () => {},
  onEditCustomer: () => {},
  onEditOrder: () => {},
  onEditPickupAddress: () => {},
  onEditDeliveryAddress: () => {},
  onEditPayment: () => {},
  onConfirm: () => {}
}

export default CreateOrderReviewStep
