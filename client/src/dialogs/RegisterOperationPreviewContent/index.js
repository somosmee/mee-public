import React from 'react'

import moment from 'moment'
import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import DialogContent from '@material-ui/core/DialogContent'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import { Payments } from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import useStyles from './styles'

const RegisterOperationPreviewContent = ({ registerOperation }) => {
  const classes = useStyles()

  const calculateDiscrepancies = (paymentMethods) => {
    const methods = [
      Payments.cash.type,
      Payments.credit.type,
      Payments.debt.type,
      Payments.voucher.type,
      Payments.pix.type
    ]

    const discrepancies = []

    for (const method of methods) {
      const paymentMethod = paymentMethods.find((pm) => pm.method === method)

      if (paymentMethod) {
        const systemValue = paymentMethod.total
        const realValue = paymentMethod.realTotal

        if (systemValue !== realValue) {
          discrepancies.push({
            name: Payments[method].label,
            diff: parseFloat((realValue - systemValue).toFixed(2))
          })
        }
      }
    }

    return discrepancies
  }

  const discrepancies = calculateDiscrepancies(registerOperation.paymentMethods)

  const hasDiscrepancies = discrepancies?.length > 0

  const renderPaymentMethod = (item, index) => (
    <TableRow key={item.method}>
      <TableCell component='th' scope='row'>
        <Typography variant='subtitle1'>{Payments[item.method].label}</Typography>
      </TableCell>
      <TableCell align='right'>
        <Typography variant='subtitle1' noWrap>
          {numeral(item.total).format()}
        </Typography>
      </TableCell>
      <TableCell align='right'>
        <Typography variant='subtitle1' noWrap>
          {numeral(item.realTotal).format()}
        </Typography>
      </TableCell>
    </TableRow>
  )

  const renderRegister = (item, index) => (
    <TableRow key={index}>
      <TableCell component='th' scope='row'>
        <Typography variant='subtitle1'>{item.name}</Typography>
      </TableCell>
      <TableCell align='right'>
        <Typography variant='subtitle1' noWrap>
          {numeral(item.balance).format()}
        </Typography>
      </TableCell>
      <TableCell align='right'>
        <Typography variant='subtitle1' noWrap>
          {numeral(item.realBalance).format()}
        </Typography>
      </TableCell>
    </TableRow>
  )

  return (
    <Box>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box className={classes.section}>{moment(registerOperation.createdAt).format('L')}</Box>
            <Box className={classes.section}>
              <Typography variant='subtitle1'>{`Autor:  ${registerOperation.createdBy.email}`}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Divider className={classes.divider} variant='middle' />
            </Box>
            <Typography variant='h6' gutterBottom>
              Pagamentos
            </Typography>
            <Table className={classes.table}>
              {hasDiscrepancies && (
                <caption style={{ color: '#e53935' }}>
                  {discrepancies.map(
                    (discrepancy, index) =>
                      `${discrepancy.name.toLowerCase()}: R$ ${discrepancy.diff.toFixed(2)} ${
                        index !== discrepancies.length - 1 ? '|' : ''
                      } `
                  )}
                </caption>
              )}
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell align='right'>Total</TableCell>
                  <TableCell align='right'>Real</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {' '}
                <TableRow>
                  <TableCell component='th' scope='row'>
                    Total Vendas
                  </TableCell>
                  <TableCell align='right'>
                    {numeral(registerOperation.totalSales).format('$ 0.00')}
                  </TableCell>
                  <TableCell align='right'>
                    {numeral(registerOperation.realTotalSales).format('$ 0.00')}
                  </TableCell>
                </TableRow>
                {registerOperation.paymentMethods.map(renderPaymentMethod)}
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6' gutterBottom>
              Caixas
            </Typography>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell align='right'>Total</TableCell>
                  <TableCell align='right'>Real</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{registerOperation.registers.map(renderRegister)}</TableBody>
            </Table>
          </Grid>
        </Grid>
      </DialogContent>
    </Box>
  )
}

RegisterOperationPreviewContent.propTypes = {
  registerOperation: PropTypes.object.isRequired
}

RegisterOperationPreviewContent.defaultProps = {
  registerOperation: {}
}

export default RegisterOperationPreviewContent
