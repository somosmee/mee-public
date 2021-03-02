import React from 'react'

import PropTypes from 'prop-types'

import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import Card from '@material-ui/icons/CreditCardOutlined'
import LocalAtm from '@material-ui/icons/LocalAtm'
import Money from '@material-ui/icons/MoneyOutlined'

import { OrderStatus, Payments, Origins, DeliveryTypes } from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import useStyles from './styles'

const PaymentIcons = {
  cash: <Money />,
  debt: <Card />,
  credit: <Card />,
  voucher: <Card />,
  pix: <LocalAtm />
}

const OrderContentFirstRow = ({ order }) => {
  const classes = useStyles()

  const renderPayment = (payment) => (
    <Tooltip key={payment.method} title={Payments[payment.method].label}>
      {PaymentIcons[payment.method]}
    </Tooltip>
  )

  const renderPaymentIfood = (payment) => (
    <Chip
      key={payment.method}
      className={classes.paymentMethod}
      size='small'
      variant='outlined'
      label={Payments[payment.method].label}
    />
  )

  const prepaid = order.payments.some((payment) => payment.prepaid)
  const pendingCashPayments = order.payments.filter(
    (payment) => payment.method === Payments.cash.type
  )

  return (
    <Grid id='first-line' item container spacing={2}>
      <Grid item>
        <Typography variant='subtitle2' display='block' gutterBottom>
          ID
        </Typography>
        <Typography variant='subtitle1' gutterBottom>
          {order.shortID}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant='subtitle2' display='block' gutterBottom>
          Status
        </Typography>
        <Grid item>
          <Chip
            classes={{ root: classes[order.status] }}
            variant='outlined'
            color='primary'
            size='small'
            label={OrderStatus[order.status].label}
          />
        </Grid>
      </Grid>
      {order.delivery?.method && (
        <Grid item>
          <Typography variant='subtitle2' display='block' gutterBottom>
            Entrega
          </Typography>
          <Grid item>
            <Chip
              variant='outlined'
              color='primary'
              size='small'
              label={DeliveryTypes[order.delivery.method].label}
            />
          </Grid>
        </Grid>
      )}
      {order.origin === Origins.ifood.value && (
        <Grid item>
          <Typography variant='subtitle2' display='block' gutterBottom>
            Origem
          </Typography>
          <Grid item>
            {' '}
            <Chip
              classes={{ root: classes[order.origin] }}
              variant='outlined'
              color='primary'
              size='small'
              label={Origins[order.origin].label}
            />
          </Grid>
        </Grid>
      )}
      {!!order.payments.length && (
        <Grid item>
          <Typography variant='subtitle2' display='block' gutterBottom>
            Pagamentos
          </Typography>
          <Grid id='payments' item>
            {order.payments?.map(renderPayment)}
          </Grid>
        </Grid>
      )}
      {(order.origin === Origins.ifood.value || order.origin === Origins.shopfront.value) && (
        <Grid item>
          <Typography variant='subtitle2' display='block' gutterBottom>
            Pagamentos
          </Typography>
          <Grid id='payments' item>
            {order.payments?.map(renderPaymentIfood)}
          </Grid>
        </Grid>
      )}
      {!!pendingCashPayments.length && (
        <Grid item>
          <Typography variant='subtitle2' display='block' gutterBottom>
            Troco para
          </Typography>
          {pendingCashPayments.map((payment, index) => (
            <Typography key={index} variant='body2' gutterBottom>
              {`R$ ${numeral(payment.received).format('0.00')}`}
            </Typography>
          ))}
        </Grid>
      )}
      {(order.origin === Origins.ifood.value || order.origin === Origins.shopfront.value) && (
        <Grid item>
          <Typography variant='subtitle2' display='block' gutterBottom>
            Obs
          </Typography>
          <Typography variant='body2' gutterBottom>
            {prepaid ? ' Pagamento online ' : ' Pagamento na entrega '}
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}

OrderContentFirstRow.propTypes = {
  order: PropTypes.object
}

OrderContentFirstRow.defaultProps = {
  order: {}
}

export default OrderContentFirstRow
