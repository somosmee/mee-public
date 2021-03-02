import React from 'react'
import PrintProvider, { Print } from 'react-easy-print'

import moment from 'moment'
import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import PrintIcon from '@material-ui/icons/PrintOutlined'

import numeral from 'src/utils/numeral'

import styles from './styles'

const OrderDetailForm = ({ classes, order, amount }) => {
  const renderItem = (item, index) => (
    <TableRow key={item.gtin}>
      <TableCell padding='dense'>
        <Typography color='textSecondary'>{item.gtin}</Typography>
        <Typography variant='subtitle1'>{item.name}</Typography>
        <Typography color='textSecondary'>{`${item.quantity} x ${numeral(item.price).format(
          '0.00'
        )}/${item.measurement}`}</Typography>
        <Typography color='textSecondary'>{item.note}</Typography>
      </TableCell>
      <TableCell align='right' padding='dense'>
        <Typography variant='subtitle1' noWrap>
          {numeral(item.quantity * item.price).format()}
        </Typography>
      </TableCell>
    </TableRow>
  )

  return (
    <PrintProvider>
      <Print single name='order'>
        <Box component='div' display='flex'>
          <DialogTitle id='form-dialog-title'>{moment(order.createdAt).format('LLLL')}</DialogTitle>
          <div className={classes.spacer} />
          <IconButton className={classes.button} onClick={() => window.print()}>
            <PrintIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <Table className={classes.table}>
            <TableBody>{order.items.map(renderItem)}</TableBody>
          </Table>
          <Typography className={classes.total} align='right' variant='h5'>
            {numeral(order.total).format()}
          </Typography>
        </DialogContent>
      </Print>
    </PrintProvider>
  )
}

OrderDetailForm.propTypes = {
  classes: PropTypes.any,
  amount: PropTypes.any,
  order: PropTypes.object.isRequired
}

export default withStyles(styles)(OrderDetailForm)
