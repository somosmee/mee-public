import React from 'react'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import { Payments } from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import useStyles from './styles'

const OrderReceiptDelivery = ({ order }) => {
  const classes = useStyles()

  const pendingCashPayments = order.payments.filter(
    (payment) => payment.method === Payments.cash.type
  )
  const prepaid = order.payments.some((payment) => payment.prepaid)

  const name = order.customer
    ? `${order.customer.firstName} ${order.customer.lastName}`
    : order.ifood.customer.name
  const mobile = order.customer?.mobile ?? order.ifood?.customer?.phone?.split('ID:')?.[0]
  const localizer = order.ifood?.customer?.phone?.split('ID:')?.[1]
  const nationalId =
    order.customer?.nationalId ?? order.ifood?.customer?.taxPayerIdentificationNumber

  const paymentType = order.payments?.map((payment) => Payments[payment.method].label).join(', ')

  return (
    <Grid className={classes.root} container item>
      <Grid container item>
        <Grid item xs={12}>
          <Typography className={classes.title} gutterBottom>
            Dados de entrega
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography className={classes.subtitle}>Endereço</Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.address}>
            {`${order.delivery.address.street}` +
              `${order.delivery.address.number ? `, ${order.delivery.address.number}, ` : ''}` +
              `${
                order.delivery.address.complement ? `${order.delivery.address.complement}, ` : ''
              }` +
              `${order.delivery.address.district}` +
              ` - ${order.delivery.address.city}, ${order.delivery.address.state} - CEP ${order.delivery.address.postalCode}`}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item>
        <Grid item xs>
          <Typography className={classes.subtitle}>Forma de pagamento</Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.paymentType}>{`${paymentType} ${
            prepaid ? '(Online)' : '(Na entrega)'
          }`}</Typography>
        </Grid>
      </Grid>
      {!!pendingCashPayments.length && (
        <Grid container item>
          <Grid item xs>
            <Typography className={classes.subtitle}>Troco para</Typography>
          </Grid>

          <Grid item>
            {pendingCashPayments.map((payment, index) => (
              <Typography key={index} className={classes.changeFor}>
                TROCO PARA: R$ {numeral(payment.received).format('0.00')}
              </Typography>
            ))}
          </Grid>
        </Grid>
      )}
      <Grid container item>
        <Grid item xs>
          <Typography className={classes.subtitle}>Cliente</Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.customer}>{name}</Typography>
        </Grid>
      </Grid>
      {mobile && (
        <Grid container item>
          <Grid item xs>
            <Typography className={classes.subtitle}>Telefone</Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.mobile}>{mobile}</Typography>
          </Grid>
        </Grid>
      )}
      {localizer && (
        <Grid container item>
          <Grid item xs>
            <Typography className={classes.subtitle}>Localizador</Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.localizer}>{localizer}</Typography>
          </Grid>
        </Grid>
      )}
      {nationalId && (
        <Grid container item>
          <Grid item xs>
            <Typography className={classes.subtitle}>CPF/CNPJ</Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.nationalId}>{nationalId}</Typography>
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}

OrderReceiptDelivery.propTypes = {
  order: PropTypes.shape({
    customer: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      mobile: PropTypes.string,
      nationalId: PropTypes.string
    }),
    delivery: PropTypes.shape({
      address: PropTypes.shape({
        street: PropTypes.string,
        number: PropTypes.string,
        complement: PropTypes.string,
        district: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        postalCode: PropTypes.string
      }),
      paymentType: PropTypes.string,
      fee: PropTypes.number
    }),
    ifood: PropTypes.shape({
      name: PropTypes.string,
      customer: PropTypes.shape({
        taxPayerIdentificationNumber: PropTypes.string
      })
    })
  })
}

OrderReceiptDelivery.defaultProps = {}

export default OrderReceiptDelivery
