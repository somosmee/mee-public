import React from 'react'

import PropTypes from 'prop-types'

import Avatar from '@material-ui/core/Avatar'
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

import Motorcycle from '@material-ui/icons/MotorcycleOutlined'
import Person from '@material-ui/icons/Person'
import Place from '@material-ui/icons/PlaceOutlined'

import Button from 'src/components/Button'

import { Payments } from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import useStyles from './styles'

const ReviewStep = ({
  loading,
  order,
  onEditCustomer,
  onEditAddress,
  onEditPayment,
  onEditDeliveryFee,
  onConfirm
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md')) || true

  const hasCustomer = order?.customer
  const hasAddress = order?.delivery && order.delivery?.address
  const hasPayment = order?.payments?.length > 0
  const hasDeliveryFee = hasAddress && !!order.delivery.fee

  return (
    <>
      <DialogContent className={classes.content}>
        <Grid container spacing={2}>
          {hasCustomer && (
            <Grid container item xs={12} spacing={2} justify='center'>
              <Grid item xs='auto'>
                <Avatar>
                  <Person />
                </Avatar>
              </Grid>
              <Grid item xs={upMedium ? true : 12}>
                <Typography align={upMedium ? 'inherit' : 'center'}>
                  {order.customer.firstName} {order.customer.lastName}
                </Typography>
                <Typography
                  viariant='body2'
                  color='textSecondary'
                  align={upMedium ? 'inherit' : 'center'}
                >
                  {order.customer.mobile}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CardActions className={classes.actions}>
                  <Button size='small' color='primary' onClick={onEditCustomer}>
                    Escolher outro cliente
                  </Button>
                </CardActions>
              </Grid>
              <Grid className={classes.gridItem} item xs={12}>
                <Divider variant='middle' light />
              </Grid>
            </Grid>
          )}
          {hasAddress && (
            <Grid container item xs={12} spacing={2} justify='center'>
              <Grid item xs='auto'>
                <Avatar>
                  <Place />
                </Avatar>
              </Grid>
              <Grid item xs={upMedium ? true : 12}>
                <Typography align={upMedium ? 'inherit' : 'center'}>
                  {`${order.delivery.address.street}` +
                    `${order.delivery.address.number ? `, ${order.delivery.address.number}` : ''}`}
                </Typography>
                <Typography
                  viariant='body2'
                  color='textSecondary'
                  align={upMedium ? 'inherit' : 'center'}
                >
                  {`${
                    order.delivery.address.complement
                      ? `${order.delivery.address.complement}, `
                      : ''
                  }` +
                    `${order.delivery.address.district}` +
                    ` - ${order.delivery.address.city}, ${order.delivery.address.state} - CEP ${order.delivery.address.postalCode}`}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CardActions className={classes.actions}>
                  <Button size='small' color='primary' onClick={onEditAddress}>
                    Editar ou escolher outro
                  </Button>
                </CardActions>
              </Grid>
              <Grid className={classes.gridItem} item xs={12}>
                <Divider variant='middle' light />
              </Grid>
            </Grid>
          )}
          {hasPayment && (
            <Grid container item xs={12} spacing={2} justify='center'>
              <Grid item xs='auto'>
                <Avatar>
                  <Icon>{Payments[order.payments[0].method].icon}</Icon>
                </Avatar>
              </Grid>
              <Grid item xs={upMedium ? true : 12}>
                <Typography align={upMedium ? 'inherit' : 'center'}>
                  {Payments[order.payments[0].method].label}
                </Typography>
                <Typography
                  viariant='body2'
                  color='textSecondary'
                  align={upMedium ? 'inherit' : 'center'}
                >
                  {Payments[order.payments[0].method].installment}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CardActions className={classes.actions}>
                  <Button size='small' color='primary' onClick={onEditPayment}>
                    Modificar forma de pagamento
                  </Button>
                </CardActions>
              </Grid>
              <Grid className={classes.gridItem} item xs={12}>
                <Divider variant='middle' light />
              </Grid>
            </Grid>
          )}
          {hasDeliveryFee && (
            <Grid container item xs={12} spacing={2} justify='center'>
              <Grid item xs='auto'>
                <Avatar>
                  <Motorcycle />
                </Avatar>
              </Grid>
              <Grid item xs={upMedium ? true : 12}>
                <Typography align={upMedium ? 'inherit' : 'center'}>
                  {numeral(order.delivery.fee).format()}
                </Typography>
                <Typography
                  viariant='body2'
                  color='textSecondary'
                  align={upMedium ? 'inherit' : 'center'}
                >
                  Taxa de entrega
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CardActions className={classes.actions}>
                  <Button size='small' color='primary' onClick={onEditDeliveryFee}>
                    Modificar taxa de entrega
                  </Button>
                </CardActions>
              </Grid>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <Paper className={classes.paper} elevation={10}>
        <DialogActions>
          <Button
            id='save'
            variant='contained'
            color='primary'
            size='large'
            loading={loading}
            fullWidth={!upMedium}
            onClick={onConfirm}
          >
            Salvar
          </Button>
        </DialogActions>
      </Paper>
    </>
  )
}

ReviewStep.propTypes = {
  loading: PropTypes.bool,
  order: PropTypes.string,
  onEditCustomer: PropTypes.func,
  onEditAddress: PropTypes.func,
  onEditPayment: PropTypes.func,
  onConfirm: PropTypes.func,
  onEditDeliveryFee: PropTypes.func
}

ReviewStep.defaultProps = {
  onEditCustomer: () => {},
  onEditAddress: () => {},
  onEditPayment: () => {},
  onEditDeliveryFee: () => {},
  onConfirm: () => {}
}

export default ReviewStep
