import React from 'react'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import numeral from 'src/utils/numeral'

import useStyles from './styles'

const OrderReceiptTotals = ({ order }) => {
  const classes = useStyles()

  const discount =
    order.ifood?.benefits.reduce((a, b) => ({ value: a.value + b.value }), 0).value ?? 0.0

  return (
    <Grid className={classes.root} container item>
      <Grid container item>
        <Grid item xs>
          <Typography className={classes.subtotal}>Subtotal</Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.subtotal}>
            {numeral(order.subtotal).format('$ 0.00')}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item>
        <Grid item xs>
          <Typography className={classes.subtotal}>Taxas</Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.subtotal}>
            {numeral(order.totalFees).format('$ 0.00')}
          </Typography>
        </Grid>
      </Grid>
      {order.delivery?.address && (
        <Grid container item>
          <Grid item xs>
            <Typography className={classes.deliveryFee}>Entrega</Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.deliveryFee}>
              {order.delivery?.fee ? numeral(order.delivery.fee).format('$ 0.00') : 'Grátis'}
            </Typography>
          </Grid>
        </Grid>
      )}
      <Grid container item>
        <Grid item xs>
          <Typography className={classes.discount}>Descontos</Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.discount}>
            - {numeral(discount ?? 0).format('$ 0.00')}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item>
        <Grid item xs>
          <Typography className={classes.total}>Total</Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.total}>
            {numeral(order.total - discount).format('$ 0.00')}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

OrderReceiptTotals.propTypes = {
  order: PropTypes.shape({
    subtotal: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    totalFees: PropTypes.number.isRequired,
    delivery: PropTypes.shape({
      address: PropTypes.object,
      fee: PropTypes.number
    })
  }).isRequired
}

OrderReceiptTotals.defaultProps = {}

export default OrderReceiptTotals
