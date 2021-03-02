import React, { useState, useRef, useEffect } from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import moment from 'moment'
import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import Switch from '@material-ui/core/Switch'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import HelpOutline from '@material-ui/icons/HelpOutline'

import PriceFormat from 'src/components/PriceFormat'
import TextField from 'src/components/TextField'

import useCompany from 'src/hooks/useCompany'

import { ExpenseCategories, IncomeCategories } from 'src/utils/enums'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.value) {
    errors.value = 'Valor é obrigatório'
  }

  if (values.value && values.value <= 0) {
    errors.value = 'Valor precisa ser maior que 0'
  }

  if (!values.description) {
    errors.description = 'Descrição é obrigatório'
  }

  if (!values.category) {
    errors.description = 'Categoria é obrigatorio'
  }

  return errors
}

const UpsertFinancialStatementForm = ({ operation, isPurchase, actions, onClose, onSubmit }) => {
  const classes = useStyles()

  const inputValue = useRef()

  const {
    getMyCompany: [getMyCompany, { loading, data: dataCompany }]
  } = useCompany()
  const company = dataCompany?.myCompany

  useEffect(() => {
    getMyCompany()
  }, [])

  useEffect(() => {
    inputValue.current.focus()
  }, [])

  const [dueAt, setDueAt] = useState(moment.utc())
  const [paid, setPaid] = useState(true)

  /* FORM */
  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues: {
      paid: true,
      description: isPurchase ? 'Compra' : undefined,
      category:
        operation === 'expense' ? ExpenseCategories.general.value : IncomeCategories.general.value
    },
    onSubmit,
    validate
  })

  /* FORM FIELDS */
  const value = useField('value', form)
  const category = useField('category', form)
  const description = useField('description', form)
  const financialFund = useField('financialFund', form)
  const paymentMethod = useField('paymentMethod', form)

  /* HANDLE FUNCTIONS */

  const handleSubmit = (event) => {
    event.preventDefault()

    onSubmit({ ...values, value: parseFloat(values.value), dueAt, paid })
  }

  const renderExpenseMenuItem = (category) => {
    return (
      <MenuItem key={category.id} value={category.id}>
        {category.name}
      </MenuItem>
    )
  }

  const renderIncomeMenuItem = (category) => {
    return (
      <MenuItem key={category.id} value={category.id}>
        {category.name}
      </MenuItem>
    )
  }

  const renderFundMenuItem = (fund, index) => {
    return (
      <MenuItem key={index} value={fund.id}>
        {fund.name}
      </MenuItem>
    )
  }

  const renderPaymentMenuItem = (payment, index) => {
    return (
      <MenuItem key={index} value={payment.id}>
        {payment.name}
      </MenuItem>
    )
  }

  const handleDateChange = (date) => {
    if (moment(date).isAfter(moment())) {
      setPaid(false)
    } else if (moment(date).isBefore(moment())) {
      setPaid(true)
    }
    setDueAt(date)
  }

  const handlePaidChange = (event) => {
    setPaid(event.target.checked)
  }

  const margin = 'dense'

  if (loading) {
    return (
      <Grid>
        <CircularProgress />
      </Grid>
    )
  }

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            {...value}
            className={classes.value}
            required
            variant='outlined'
            inputRef={inputValue}
            label='Valor'
            placeholder='0,00'
            fullWidth
            InputProps={{
              classes: {
                input: classes.valueInput
              },
              inputComponent: PriceFormat
            }}
          />
        </Grid>
        {!isPurchase && (
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch color='primary' />}
              checked={paid}
              onChange={handlePaidChange}
              label='Pago'
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={'pt-br'}>
            <KeyboardDatePicker
              disableToolbar
              value={dueAt}
              onChange={handleDateChange}
              variant='inline'
              format='DD/MM/yyyy'
              margin={margin}
              fullWidth
              id='date-picker-inline'
              label='Data'
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        {!isPurchase && (
          <Grid item xs={12}>
            <TextField
              {...description}
              required
              type='text'
              label='Descrição'
              margin={margin}
              fullWidth
            />
          </Grid>
        )}
        {!isPurchase && (
          <Grid item xs={12}>
            <TextField
              required
              select
              {...category}
              type='text'
              label='Categoria'
              margin={margin}
              fullWidth
            >
              {operation === 'expense'
                ? company?.expenseCategories.map(renderExpenseMenuItem)
                : company?.incomeCategories.map(renderIncomeMenuItem)}
            </TextField>
          </Grid>
        )}

        {isPurchase && (
          <Grid item xs={12}>
            <Box display='flex' alignItems='center'>
              <Typography variant='overline' align='center'>
                Forma de pagamento
              </Typography>
              <Tooltip title='Como você realizou o pagamento dessa compra. Essa informação é importante para calcular corretamente quando suas despesas serão efetivadas.'>
                <HelpOutline className={classes.helpIcon} />
              </Tooltip>
            </Box>
            <TextField
              select
              required
              {...paymentMethod}
              type='text'
              label='Forma de pagamento'
              margin={margin}
              fullWidth
            >
              {company?.purchasePaymentMethods?.map(renderPaymentMenuItem)}
            </TextField>
          </Grid>
        )}

        <Grid item xs={12}>
          <Box display='flex' alignItems='center'>
            <Typography variant='overline' align='center'>
              Contas & Caixas
            </Typography>
            <Tooltip title='Qual conta os valores desse meio de pagamento são atribuídos.'>
              <HelpOutline className={classes.helpIcon} />
            </Tooltip>
          </Box>
          <TextField
            select
            {...financialFund}
            type='text'
            label='Fundo Financeiro'
            margin={margin}
            fullWidth
          >
            {company?.financialFunds?.map(renderFundMenuItem)}
          </TextField>
        </Grid>
      </Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </form>
  )
}

// Como você realizou o pagamento dessa compra. Essa informação é importante para calcular corretamente quando suas despesas serão efetivadas

UpsertFinancialStatementForm.propTypes = {
  actions: PropTypes.func,
  onClose: PropTypes.func,
  isPurchase: PropTypes.bool,
  onSubmit: PropTypes.func,
  operation: PropTypes.string
}

UpsertFinancialStatementForm.defaultProps = {
  onSubmit: () => {}
}

export default UpsertFinancialStatementForm
