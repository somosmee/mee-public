import React, { useState, useEffect } from 'react'

import moment from 'moment'
import PropTypes from 'prop-types'

import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import Alert from 'src/components/Alert'
import PriceFormat from 'src/components/PriceFormat'

import useFinancialFund from 'src/hooks/useFinancialFund'
import useReport from 'src/hooks/useReport'

import { FinancialFundCategories, Payments } from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import useStyles from './styles'

const toMap = (array) => {
  const map = {}

  for (const row of array) {
    map[row.id] = 0.0
  }
  return map
}

const isInvalid = (values, registers) => {
  if (registers.length === 0) return false

  const ids = Object.keys(values)

  if (ids.length === 0) return true

  for (const register of registers) {
    const found = ids.includes(register.id)

    if (!found) return true
  }

  return false
}

const calculateDiscrepancies = (paymentMethods, paymentValues) => {
  const methods = [
    Payments.cash.type,
    Payments.credit.type,
    Payments.debt.type,
    Payments.voucher.type,
    Payments.pix.type
  ]

  const discrepancies = []

  for (const method of methods) {
    const systemValue = paymentMethods[method]
    const realValue = paymentValues[method]

    if (systemValue !== realValue) {
      discrepancies.push({
        name: Payments[method].label,
        diff: parseFloat((realValue - systemValue).toFixed(2))
      })
    }
  }

  return discrepancies
}

const calculateTotals = (paymentValues) => {
  return Object.values(paymentValues).reduce((a, b) => a + b, 0)
}

const DEFAULT_PAYMENT_TOTALS = {
  [Payments.cash.type]: 0.0,
  [Payments.credit.type]: 0.0,
  [Payments.debt.type]: 0.0,
  [Payments.voucher.type]: 0.0,
  [Payments.pix.type]: 0.0
}

const CloseRegisterForm = ({ initialValues, actions, onClose, onSubmit }) => {
  const classes = useStyles()

  const {
    getSalesStats: [getSalesStats, { data: dataReports, loading: loadingReports }]
  } = useReport()

  useEffect(() => {
    getSalesStats({
      startDate: moment().startOf('day'),
      endDate: moment().endOf('day'),
      groupBy: 'day'
    })
  }, [])

  const {
    getFinancialFunds: [getFinancialFunds, { loading, data: dataFunds }]
  } = useFinancialFund()

  const registers = dataFunds?.financialFunds

  useEffect(() => {
    getFinancialFunds({ category: FinancialFundCategories.REGISTER })
  }, [])

  const totalRevenue = dataReports?.reports?.salesStatisticsReport?.totalRevenue
  const paymentMethods = dataReports?.reports?.salesStatisticsReport?.paymentMethods
  const hasData = totalRevenue && paymentMethods

  /* REAC STATE */
  const [openAlert, setOpenAlert] = useState(false)
  const [values, setValues] = useState(registers ? toMap(registers) : {})
  const [paymentValues, setPaymentValues] = useState(DEFAULT_PAYMENT_TOTALS)

  /* HANDLE FUNCTIONS */

  const handleOnChange = (row, index) => (event) => {
    if (event.target.value) {
      setValues((state) => ({ ...state, [row.id]: parseFloat(event.target.value) }))
    } else {
      setValues((state) => {
        const newState = { ...state }
        delete newState[row.id]

        return newState
      })
    }
  }

  const handleOnChangePayment = (method) => (event) => {
    if (event.target.value) {
      setPaymentValues((state) => ({ ...state, [method]: parseFloat(event.target.value) }))
    } else {
      setPaymentValues((state) => ({ ...state, [method]: 0.0 }))
    }
  }

  const handleCloseAlert = () => {
    setOpenAlert(false)
  }

  if (loading || loadingReports || !paymentMethods) {
    return <CircularProgress />
  }

  const discrepancies = calculateDiscrepancies(paymentMethods, paymentValues)

  const invalid = isInvalid(values, registers)
  const hasDiscrepancies = discrepancies?.length > 0

  const submit = () => {
    onSubmit({
      totalSales: totalRevenue,
      realTotalSales: calculateTotals(paymentValues),
      operationType: 'close',
      paymentMethods: Object.entries(paymentValues).map(([key, value]) => ({
        method: key,
        total: paymentMethods[key],
        realTotal: value
      })),
      registers: registers.map((register) => ({
        register: register.id,
        name: register.name,
        balance: register.balance,
        realBalance: values[register.id],
        financialStatements: []
      }))
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (discrepancies?.length > 0) {
      setOpenAlert(true)
    } else {
      submit()
    }
  }

  const handleAlertSubmit = () => {
    submit()
  }

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant='h4' gutterBottom>
            Pagamentos
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label='simple table'>
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
              {hasData && (
                <TableBody>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      Total Vendas
                    </TableCell>
                    <TableCell align='right'>{numeral(totalRevenue).format('$ 0.00')}</TableCell>
                    <TableCell align='right'>
                      {numeral(calculateTotals(paymentValues)).format('$ 0.00')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      Dinheiro
                    </TableCell>
                    <TableCell align='right'>
                      {numeral(paymentMethods[Payments.cash.type]).format('$ 0.00')}
                    </TableCell>
                    <TableCell align='right'>
                      {
                        <TextField
                          label='Valor real'
                          value={paymentValues[Payments.cash.type]}
                          onChange={handleOnChangePayment(Payments.cash.type)}
                          InputProps={{
                            inputComponent: PriceFormat
                          }}
                        />
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      Crédito
                    </TableCell>
                    <TableCell align='right'>
                      {numeral(paymentMethods[Payments.credit.type]).format('$ 0.00')}
                    </TableCell>
                    <TableCell align='right'>
                      {
                        <TextField
                          label='Valor real'
                          value={paymentValues[Payments.credit.type]}
                          onChange={handleOnChangePayment(Payments.credit.type)}
                          InputProps={{
                            inputComponent: PriceFormat
                          }}
                        />
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      Débito
                    </TableCell>
                    <TableCell align='right'>
                      {numeral(paymentMethods[Payments.debt.type]).format('$ 0.00')}
                    </TableCell>
                    <TableCell align='right'>
                      {
                        <TextField
                          label='Valor real'
                          value={paymentValues[Payments.debt.type]}
                          onChange={handleOnChangePayment(Payments.debt.type)}
                          InputProps={{
                            inputComponent: PriceFormat
                          }}
                        />
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      Voucher
                    </TableCell>
                    <TableCell align='right'>
                      {numeral(paymentMethods[Payments.voucher.type]).format('$ 0.00')}
                    </TableCell>
                    <TableCell align='right'>
                      {
                        <TextField
                          label='Valor real'
                          value={paymentValues[Payments.voucher.type]}
                          onChange={handleOnChangePayment(Payments.voucher.type)}
                          InputProps={{
                            inputComponent: PriceFormat
                          }}
                        />
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      PIX
                    </TableCell>
                    <TableCell align='right'>
                      {numeral(paymentMethods[Payments.pix.type]).format('$ 0.00')}
                    </TableCell>
                    <TableCell align='right'>
                      {
                        <TextField
                          label='Valor real'
                          value={paymentValues[Payments.pix.type]}
                          onChange={handleOnChangePayment(Payments.pix.type)}
                          InputProps={{
                            inputComponent: PriceFormat
                          }}
                        />
                      }
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h4' gutterBottom>
            Caixas
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell align='right'>Saldo</TableCell>
                  <TableCell align='right'>Saldo Atual</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registers?.map((row, index) => (
                  <TableRow key={row.name}>
                    <TableCell component='th' scope='row'>
                      {row.name}
                    </TableCell>
                    <TableCell align='right'>{numeral(row.balance).format('$ 0.00')}</TableCell>
                    <TableCell align='right'>
                      {
                        <TextField
                          label='Saldo'
                          onChange={handleOnChange(row, index)}
                          value={values[row.id]}
                          InputProps={{
                            inputComponent: PriceFormat
                          }}
                        />
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Alert
        open={openAlert}
        loading={false}
        onClose={handleCloseAlert}
        title={'Discrepâncias foram encontradas'}
        onPrimary={handleAlertSubmit}
        primaryLabel={'Salvar & Criar transações'}
        onSecondary={handleCloseAlert}
        secondaryLabel='Voltar'
      >
        {
          'Você tem discrepâncias entre os valores do sistema e o real. O sistema irá gerar transações de ajuste para que o somatório seja o mesmo dos valores reais. Deseja continuar ?'
        }
      </Alert>
      {actions && actions(invalid, handleSubmit)}
    </form>
  )
}

CloseRegisterForm.propTypes = {
  actions: PropTypes.func,
  onClose: PropTypes.func,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func
}

CloseRegisterForm.defaultProps = {
  initialValues: null,
  onSubmit: () => {}
}

export default CloseRegisterForm
