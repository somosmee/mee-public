import React, { forwardRef } from 'react'

import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'

import OrderReceiptCompany from 'src/components/OrderReceipt/OrderReceiptCompany'
import OrderReceiptDelivery from 'src/components/OrderReceipt/OrderReceiptDelivery'
import OrderReceiptFooter from 'src/components/OrderReceipt/OrderReceiptFooter'
import OrderReceiptHeader from 'src/components/OrderReceipt/OrderReceiptHeader'
import OrderReceiptInvoice from 'src/components/OrderReceipt/OrderReceiptInvoice'
import OrderReceiptItems from 'src/components/OrderReceipt/OrderReceiptItems'
import OrderReceiptTotals from 'src/components/OrderReceipt/OrderReceiptTotals'

import { InvoiceStatus } from 'src/utils/enums'

import useStyles from './styles'

const OrderReceipt = forwardRef(({ order, display }, ref) => {
  const classes = useStyles()

  return (
    <Box className={classes.root} display={display}>
      <Grid ref={ref} container spacing={1}>
        <OrderReceiptCompany company={order.company} />
        <Grid item xs={12}>
          <Divider variant='middle' />
        </Grid>
        <OrderReceiptHeader order={order} />
        <Grid item xs={12}>
          <Divider variant='middle' />
        </Grid>
        <OrderReceiptItems items={order.items} />
        <Grid item xs={12}>
          <Divider variant='middle' />
        </Grid>
        <OrderReceiptTotals order={order} />
        <Grid item xs={12}>
          <Divider variant='middle' />
        </Grid>
        {order.delivery?.address && (
          <>
            <OrderReceiptDelivery order={order} />
            <Grid item xs={12}>
              <Divider variant='middle' />
            </Grid>
          </>
        )}
        {order.invoice?.status === InvoiceStatus.SUCCESS && order.invoice?.QRCode && (
          <>
            <OrderReceiptInvoice invoice={order.invoice} />
            <Grid item xs={12}>
              <Divider variant='middle' />
            </Grid>
          </>
        )}
        <OrderReceiptFooter />
      </Grid>
    </Box>
  )
})

OrderReceipt.displayName = 'OrderReceipt'

OrderReceipt.propTypes = {
  order: PropTypes.object,
  display: PropTypes.string
}

OrderReceipt.defaultProps = {
  display: 'none'
}

export default OrderReceipt
