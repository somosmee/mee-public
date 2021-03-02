import React from 'react'

import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import useStyles from './styles'

const OrderReceiptInvoice = ({ invoice }) => {
  const classes = useStyles()

  return (
    <Grid className={classes.root} container item justify='center'>
      <Grid item>
        <Typography className={classes.accessKey}>{invoice.accessKey}</Typography>
      </Grid>
      <Grid item>{invoice.QRCode && <QRCode size={200} value={invoice.QRCode} />}</Grid>
    </Grid>
  )
}

OrderReceiptInvoice.propTypes = {
  invoice: PropTypes.shape({})
}

OrderReceiptInvoice.defaultProps = {}

export default OrderReceiptInvoice
