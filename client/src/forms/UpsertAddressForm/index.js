import React, { useRef, useEffect } from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'
import isPostalCode from 'validator/lib/isPostalCode'

import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'

import TextField from 'src/components/TextField'
import TextFieldMasked from 'src/components/TextFieldMasked'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.postalCode) {
    errors.postalCode = 'CEP em branco'
  } else if (values.postalCode && !isPostalCode(values.postalCode, 'BR')) {
    errors.postalCode = 'CEP inválido'
  }

  if (!values.district) {
    errors.district = 'Bairro em branco'
  }

  if (!values.street) {
    errors.street = 'Rua em branco'
  }

  if (!values.number && !values.noNumber) {
    errors.number = 'Número em branco'
  }

  return errors
}

const UpsertAddressForm = ({ initialValues, onPostalCode, actions, onSubmit }) => {
  const classes = useStyles()

  const postalCodeInputRef = useRef()
  const numberInputRef = useRef()
  const { form, handleSubmit, values, invalid, pristine, submitting } = useForm({
    initialValues,
    onSubmit,
    validate
  })

  const postalCode = useField('postalCode', form)
  const state = useField('state', form)
  const city = useField('city', form)
  const district = useField('district', form)
  const street = useField('street', form)
  const number = useField('number', form)
  const noNumber = useField('noNumber', form)
  const complement = useField('complement', form)

  useEffect(() => {
    if (!initialValues) postalCodeInputRef.current.focus()
  }, [])

  useEffect(() => {
    if (initialValues && !('number' in values) && !('complement' in values)) {
      numberInputRef.current.focus()
    }
  }, [
    initialValues?.state,
    initialValues?.street,
    initialValues?.city,
    initialValues?.district,
    values.number,
    values.complement
  ])

  const handleChange = (event) => {
    const value = event.target.value

    if (value.length === 9) {
      onPostalCode(value)
    }
  }

  const disabled = !!noNumber.input.value

  return (
    <Grid container spacing={2} component='form' autoComplete='off' onSubmit={handleSubmit}>
      <Grid item xs={6}>
        <TextFieldMasked
          {...postalCode}
          id='postalCode'
          type='text'
          inputRef={postalCodeInputRef}
          label='CEP'
          mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
          disabled={initialValues?._id}
          required
          fullWidth
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={6} />
      <Grid item xs={6}>
        <TextField {...city} id='city' type='text' label='Cidade' required disabled fullWidth />
      </Grid>
      <Grid item xs={6}>
        <TextField {...state} id='state' type='text' label='Estado' required disabled fullWidth />
      </Grid>
      <Grid item xs={12}>
        <TextField {...district} id='district' type='text' label='Bairro' required fullWidth />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField {...street} id='street' type='text' label='Rua/Avenida' required fullWidth />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          {...number}
          id='number'
          type='text'
          inputRef={numberInputRef}
          label='Número'
          required
          fullWidth
          disabled={disabled}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <FormControlLabel
                  classes={{ label: classes.formControlLabel }}
                  control={
                    <Checkbox
                      {...noNumber.input}
                      id='noNumber'
                      checked={disabled}
                      color='primary'
                      inputProps={{ 'aria-label': 'Sem número' }}
                    />
                  }
                  label='Sem número'
                />
              </InputAdornment>
            )
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          {...complement}
          id='complement'
          type='text'
          label='Complemento'
          placeholder='Andar/Apartamento'
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        {actions && actions(submitting, pristine, invalid)}
      </Grid>
    </Grid>
  )
}

UpsertAddressForm.propTypes = {
  initialValues: PropTypes.object,
  onPostalCode: PropTypes.func,
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertAddressForm.defaultProps = {
  onPostalCode: () => {},
  onSubmit: () => {}
}

export default UpsertAddressForm
