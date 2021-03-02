import React, { useRef, useEffect } from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'

import TextField from 'src/components/TextField'

import { isCPF } from 'src/utils/validator'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.nationalId) {
    errors.nationalId = 'CPF em branco'
  } else if (values.nationalId && !isCPF(values.nationalId)) {
    errors.nationalId = 'CPF inválido'
  }

  return errors
}

const UpsertFederalTaxNumberForm = ({ initialValues, actions, onSubmit }) => {
  const classes = useStyles()

  const inputRef = useRef()
  const { form, handleSubmit, invalid, pristine, submitting } = useForm({
    initialValues,
    onSubmit,
    validate
  })
  const nationalId = useField('nationalId', form)

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return (
    <Grid
      className={classes.root}
      container
      component='form'
      autoComplete='off'
      onSubmit={handleSubmit}
      spacing={1}
    >
      <Grid item xs={12}>
        <TextField
          {...nationalId}
          inputRef={inputRef}
          type='number'
          placeholder='CPF ou CNPJ'
          required
          fullWidth
        />
      </Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </Grid>
  )
}

UpsertFederalTaxNumberForm.propTypes = {
  initialValues: PropTypes.object,
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertFederalTaxNumberForm.defaultProps = {
  onSubmit: () => {}
}

export default UpsertFederalTaxNumberForm
