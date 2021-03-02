import React, { useRef, useEffect, useState } from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import HelpOutline from '@material-ui/icons/HelpOutline'

import IntegerFormat from 'src/components/IntegerFormat'
import PercentageFormat from 'src/components/PercentageFormat'
import PriceFormat from 'src/components/PriceFormat'
import TextField from 'src/components/TextField'

import useCompany from 'src/hooks/useCompany'

import { Payments, PaymentMethodTypes } from 'src/utils/enums'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.fee) {
    errors.fee = 'Taxa é obrigatório'
  }

  if (!values.name) {
    errors.name = 'Nome é obrigatório'
  }

  if (!values.method) {
    errors.method = 'Método é obrigatório'
  }

  return errors
}

const PaymentMethodForm = ({ initialValues, actions, operation, onClose, onSubmit }) => {
  const classes = useStyles()

  const [toggle, setToggle] = useState(initialValues?.operationType || 'absolute')

  const inputValue = useRef()

  useEffect(() => {
    inputValue.current.focus()
  }, [])

  const {
    getMyCompany: [getMyCompany, { loading, data: dataCompany }]
  } = useCompany()
  const company = dataCompany?.myCompany

  useEffect(() => {
    getMyCompany()
  }, [])

  /* FORM */
  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues: { ...initialValues, financialFund: initialValues?.financialFund?.id },
    onSubmit,
    validate
  })

  /* FORM FIELDS */
  const fee = useField('fee', form)
  const name = useField('name', form)
  const method = useField('method', form)
  const financialFund = useField('financialFund', form)
  const balanceInterval = useField('balanceInterval', form)
  const closingDay = useField('closingDay', form)
  const paymentDay = useField('paymentDay', form)

  /* HANDLE FUNCTIONS */

  const handleSubmit = (event) => {
    event.preventDefault()

    if (operation === PaymentMethodTypes.PURCHASE) {
      onSubmit(
        {
          ...values,
          operationType: toggle,
          closingDay: values.closingDay ? parseInt(values.closingDay) : null,
          paymentDay: values.paymentDay ? parseInt(values.paymentDay) : null,
          fee: parseFloat(toggle === 'percentage' ? values.fee / 100 : values.fee)
        },
        operation
      )
    } else {
      onSubmit(
        {
          ...values,
          operationType: toggle,
          balanceInterval: values.balanceInterval ? parseInt(values.balanceInterval) : null,
          fee: parseFloat(toggle === 'percentage' ? values.fee / 100 : values.fee)
        },
        operation
      )
    }
  }

  const handleChangeToggle = (e, value) => {
    setToggle(value)
  }

  const renderMenuItem = (key) => {
    return (
      <MenuItem key={key} value={Payments[key].type}>
        {Payments[key].label}
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

  if (loading) {
    return (
      <Grid>
        <CircularProgress />
      </Grid>
    )
  }

  const margin = 'dense'

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            {...fee}
            className={classes.value}
            required
            variant='outlined'
            inputRef={inputValue}
            label='Taxa'
            placeholder='0,00'
            fullWidth
            InputProps={{
              classes: {
                input: classes.valueInput
              },
              inputComponent: toggle === 'absolute' ? PriceFormat : PercentageFormat
            }}
          />
        </Grid>
        <Grid item container justify='center' xs={12}>
          <Grid item>
            <ToggleButtonGroup
              value={toggle}
              exclusive
              onChange={handleChangeToggle}
              aria-label='selecione modo de venda'
            >
              <ToggleButton value='absolute' aria-label='left aligned'>
                Valor bruto
              </ToggleButton>
              <ToggleButton value='percentage' aria-label='centered'>
                Porcentagem
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TextField {...name} required type='text' label='Nome' margin={margin} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            select
            {...method}
            type='text'
            label='Método'
            margin={margin}
            fullWidth
          >
            {Object.keys(Payments).map(renderMenuItem)}
          </TextField>
        </Grid>
        {operation === PaymentMethodTypes.SALE && (
          <Grid item xs={12}>
            <Box display='flex' alignItems='center'>
              <Typography variant='overline' align='center'>
                Saldo
              </Typography>
              <Tooltip title='Quantos dias o valor do pagamento demora para cair no saldo da conta.'>
                <HelpOutline className={classes.helpIcon} />
              </Tooltip>
            </Box>
            <TextField
              {...balanceInterval}
              label='Intervalo de saldo em conta'
              margin={margin}
              fullWidth
              InputProps={{
                inputComponent: IntegerFormat
              }}
            />
          </Grid>
        )}
        {operation === PaymentMethodTypes.PURCHASE && values.method === Payments.credit.type && (
          <Grid item xs={12}>
            <Box display='flex' alignItems='center'>
              <Typography variant='overline' align='center'>
                Cartão de crédito
              </Typography>
              <Tooltip title='Detalhes do ciclo de cobrança do cartão de crédito.'>
                <HelpOutline className={classes.helpIcon} />
              </Tooltip>
            </Box>
            <TextField
              {...closingDay}
              label='Dia de fechamento do cartão'
              margin={margin}
              fullWidth
              InputProps={{
                inputComponent: IntegerFormat
              }}
            />
            <TextField
              {...paymentDay}
              label='Dia de pagamento do cartão'
              margin={margin}
              fullWidth
              InputProps={{
                inputComponent: IntegerFormat
              }}
            />
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

PaymentMethodForm.propTypes = {
  actions: PropTypes.func,
  onClose: PropTypes.func,
  initialValues: PropTypes.object,
  isAdjust: PropTypes.bool,
  onSubmit: PropTypes.func,
  operation: PropTypes.string
}

PaymentMethodForm.defaultProps = {
  initialValues: { operationType: 'absolute' },
  isAdjust: false,
  onSubmit: () => {}
}

export default PaymentMethodForm
