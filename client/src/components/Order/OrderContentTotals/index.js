import React from 'react'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import numeral from 'src/utils/numeral'

const OrderContentTotals = ({ order, justify }) => {
  const hasDiscounts = order?.totalDiscount > 0
  const hasFees = order?.totalFees > 0
  const hasTaxes = order?.totalTaxes > 0

  const rest = order?.payments?.length > 0 ? order.total - order.totalPaid : 0

  return (
    <Grid item container justify={justify} spacing={1}>
      <Grid xs={4} item>
        <Typography variant='caption' display='block' gutterBottom>
          Subtotal
        </Typography>
        <Typography variant='subtitle1'>
          R$&nbsp;
          {numeral(order.subtotal).format('0.00')}
        </Typography>
      </Grid>
      {order.delivery && !!order.delivery.fee && (
        <Grid xs={4} item>
          <Typography variant='caption' display='block' gutterBottom>
            Taxa de entrega
          </Typography>
          <Typography variant='subtitle1'>
            R$&nbsp;
            {numeral(order.delivery.fee).format('0.00')}
          </Typography>
        </Grid>
      )}
      {hasFees && (
        <Grid xs={4} item>
          <Typography variant='caption' display='block' gutterBottom>
            Taxas
          </Typography>
          <Typography variant='subtitle1'>
            R$&nbsp;
            {numeral(order.totalFees).format('0.00')}
          </Typography>
        </Grid>
      )}
      {hasDiscounts && (
        <Grid xs={4} item>
          <Typography variant='caption' display='block' gutterBottom>
            Descontos
          </Typography>
          <Typography variant='subtitle1'>
            R$&nbsp;
            {numeral(order.totalDiscount).format('0.00')}
          </Typography>
        </Grid>
      )}
      {hasTaxes && (
        <Grid xs={4} item>
          <Typography variant='caption' display='block' gutterBottom>
            Impostos
          </Typography>
          <Typography variant='subtitle1'>
            R$&nbsp;
            {numeral(order.totalTaxes).format('0.00')}
          </Typography>
        </Grid>
      )}
      <Grid xs={4} item>
        <Typography variant='caption' display='block' gutterBottom>
          Total
        </Typography>
        <Typography variant='h5'>
          R$&nbsp;
          {numeral(order.total).format('0.00')}
        </Typography>
      </Grid>
      {rest > 0 && (
        <Grid xs={4} item>
          <Typography variant='caption' display='block' gutterBottom>
            Restante a pagar
          </Typography>
          <Typography variant='h5'>
            R$&nbsp;
            {numeral(rest).format('0.00')}
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}

OrderContentTotals.propTypes = {
  order: PropTypes.object,
  justify: PropTypes.string
}

OrderContentTotals.defaultProps = {
  order: {},
  justify: 'flex-start'
}

export default OrderContentTotals
