import React from 'react'

import moment from 'moment'
import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import Card from '@material-ui/icons/CreditCardOutlined'
import Money from '@material-ui/icons/MoneyOutlined'

import OrderContentCustomer from 'src/components/Order/OrderContentCustomer'
import OrderContentFirstRow from 'src/components/Order/OrderContentFirstRow'
import OrderContentTotals from 'src/components/Order/OrderContentTotals'

import { Payments } from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import useStyles from './styles'

const PaymentIcons = {
  cash: <Money />,
  debt: <Card />,
  credit: <Card />,
  voucher: <Card />
}

const OrderPreviewContent = ({ order }) => {
  const classes = useStyles()

  const renderItem = (item, index) => (
    <TableRow key={item.gtin}>
      <TableCell padding='dense'>
        <Typography color='textSecondary'>{item.gtin}</Typography>
        <Typography variant='subtitle1'>{item.name}</Typography>
        <Typography color='textSecondary'>{`${item.quantity} x ${numeral(item.price).format()}/${
          item.measurement
        }`}</Typography>
        <Typography color='textSecondary'>{item.note}</Typography>
      </TableCell>
      <TableCell align='right' padding='dense'>
        <Typography variant='subtitle1' noWrap>
          {numeral(item.quantity * item.price).format()}
        </Typography>
      </TableCell>
    </TableRow>
  )

  const renderItemPayment = (item, index) => (
    <TableRow key={index}>
      <TableCell padding='dense'>
        <Grid container direction='row' spacing={2}>
          <Grid item>
            <Tooltip key={item.method} title={Payments[item.method].label}>
              {PaymentIcons[item.method]}
            </Tooltip>
          </Grid>

          <Grid item>
            <Typography color='textSecondary'>{Payments[item.method].label}</Typography>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell align='right' padding='dense'>
        <Typography variant='subtitle1' noWrap>
          {numeral(item.value).format()}
        </Typography>
      </TableCell>
    </TableRow>
  )

  return (
    <Box>
      {order.title && (
        <Box component='div' display='flex' justify='center'>
          <DialogTitle id='form-dialog-title2'>{order.title}</DialogTitle>
        </Box>
      )}
      <DialogContent>
        <Box className={classes.section}>{moment(order.createdAt).format('LLLL')}</Box>
        <Box className={classes.section}>
          <OrderContentFirstRow order={order} />
        </Box>
        <Box className={classes.section}>
          <OrderContentCustomer order={order} />
        </Box>
        <Box>
          <Divider className={classes.divider} variant='middle' />
        </Box>
        <Typography variant='h6' gutterBottom>
          Items
        </Typography>
        <Table className={classes.table}>
          <TableBody>{order.items.map(renderItem)}</TableBody>
        </Table>
        {order?.payments?.length > 0 && (
          <>
            <Typography variant='h6' gutterBottom>
              Pagamentos
            </Typography>
            <Table className={classes.table}>
              <TableBody>{order.payments.map(renderItemPayment)}</TableBody>
            </Table>
          </>
        )}
        <Box className={classes.section}>
          <OrderContentTotals order={order} justify='flex-end' />
        </Box>
      </DialogContent>
    </Box>
  )
}

OrderPreviewContent.propTypes = {
  order: PropTypes.object.isRequired
}

OrderPreviewContent.defaultProps = {
  order: {}
}

export default OrderPreviewContent
