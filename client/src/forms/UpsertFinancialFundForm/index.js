import React, { useRef, useEffect, useState } from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'

import PriceFormat from 'src/components/PriceFormat'
import TextField from 'src/components/TextField'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.balance) {
    errors.balance = 'Saldo é obrigatório'
  }

  if (!values.name) {
    errors.name = 'Nome é obrigatório'
  }

  return errors
}

const UpsertFinancialFundForm = ({
  initialValues,
  operation,
  isAdjust,
  actions,
  onClose,
  onSubmit
}) => {
  const classes = useStyles()

  const inputValue = useRef()

  const [shouldCreateFinancialStatement, setShouldCreateFinancialStatement] = useState(true)

  useEffect(() => {
    inputValue.current.focus()
  }, [])

  /* FORM */
  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues: initialValues || {
      category: operation
    },
    onSubmit,
    validate
  })

  /* FORM FIELDS */
  const balance = useField('balance', form)
  const name = useField('name', form)

  /* HANDLE FUNCTIONS */

  const handleSubmit = (event) => {
    event.preventDefault()

    onSubmit({ ...values, balance: parseFloat(values.balance), shouldCreateFinancialStatement })
  }

  const handleFlagChange = (event) => {
    setShouldCreateFinancialStatement(event.target.checked)
  }

  const margin = 'dense'

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            {...balance}
            className={classes.value}
            required
            disabled={!!initialValues && !isAdjust}
            variant='outlined'
            inputRef={inputValue}
            label='Saldo'
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
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch color='primary' />}
            checked={shouldCreateFinancialStatement}
            onChange={handleFlagChange}
            label='Criar uma transação de receita com esse valor'
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...name}
            disabled={isAdjust}
            required
            type='text'
            label='Nome'
            margin={margin}
            fullWidth
          />
        </Grid>
      </Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </form>
  )
}

UpsertFinancialFundForm.propTypes = {
  actions: PropTypes.func,
  onClose: PropTypes.func,
  initialValues: PropTypes.object,
  isAdjust: PropTypes.bool,
  onSubmit: PropTypes.func,
  operation: PropTypes.string
}

UpsertFinancialFundForm.defaultProps = {
  initialValues: null,
  isAdjust: false,
  onSubmit: () => {}
}

export default UpsertFinancialFundForm
