import React, { useState, useEffect } from 'react'

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

import PriceFormat from 'src/components/PriceFormat'

import useFinancialFund from 'src/hooks/useFinancialFund'

import { FinancialFundCategories } from 'src/utils/enums'
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
  const ids = Object.keys(values)

  if (ids.length === 0) return true

  for (const register of registers) {
    const found = ids.includes(register.id)

    if (!found) return true
  }

  return false
}

const OpenRegisterForm = ({ initialValues, actions, onClose, onSubmit }) => {
  const classes = useStyles()

  const {
    getFinancialFunds: [getFinancialFunds, { loading, data: dataFunds }]
  } = useFinancialFund()

  const registers = dataFunds?.financialFunds

  useEffect(() => {
    getFinancialFunds({ category: FinancialFundCategories.REGISTER })
  }, [])

  /* REAC STATE */
  const [values, setValues] = useState(registers ? toMap(registers) : {})

  /* HANDLE FUNCTIONS */

  const handleSubmit = (event) => {
    event.preventDefault()

    onSubmit({
      totalSales: 0.0,
      realTotalSales: 0.0,
      operationType: 'open',
      paymentMethods: [],
      registers: registers.map((register) => ({
        register: register.id,
        name: register.name,
        balance: register.balance,
        realBalance: values[register.id],
        financialStatements: []
      }))
    })
  }

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

  if (loading) {
    return <CircularProgress />
  }

  const invalid = isInvalid(values, registers)

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <Grid container spacing={1}>
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
      {actions && actions(invalid, handleSubmit)}
    </form>
  )
}

OpenRegisterForm.propTypes = {
  actions: PropTypes.func,
  onClose: PropTypes.func,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func
}

OpenRegisterForm.defaultProps = {
  initialValues: null,
  onSubmit: () => {}
}

export default OpenRegisterForm
