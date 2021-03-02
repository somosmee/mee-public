import React, { useRef, useEffect } from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'

import TextField from 'src/components/TextField'

import { TaxRegimes } from 'src/utils/enums'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.nationalId) {
    errors.nationalId = 'CNPJ em branco'
  }

  if (!values.name) {
    errors.name = 'Razão Social em branco'
  }

  if (!values.stateId) {
    errors.stateId = 'Inscrição Estadual em branco'
  }

  if (!values.regime) {
    errors.regime = 'Regime Tributário em branco'
  }

  return errors
}

const UpsertCompanyInfoForm = ({ initialValues, actions, onSubmit }) => {
  const classes = useStyles()

  const nationalIdInputRef = useRef()

  const { form, handleSubmit, invalid, pristine, submitting } = useForm({
    initialValues,
    onSubmit,
    validate
  })

  const nationalId = useField('nationalId', form)
  const name = useField('name', form)
  const stateId = useField('stateId', form)
  const regime = useField('regime', form)

  useEffect(() => {
    if (!initialValues) nationalIdInputRef.current.focus()
  }, [])

  const renderSelect = (item, index) => {
    return (
      <MenuItem key={index} value={item.value}>
        {item.name}
      </MenuItem>
    )
  }

  return (
    <Grid
      className={classes.root}
      container
      spacing={2}
      component='form'
      autoComplete='off'
      onSubmit={handleSubmit}
    >
      <Grid item xs={6}>
        <TextField {...nationalId} label='CNPJ' required inputRef={nationalIdInputRef} />
      </Grid>
      <Grid item xs={6}>
        <TextField {...name} label='Razão Social' required />
      </Grid>
      <Grid item xs={6}>
        <TextField {...stateId} label='Inscrição Estadual' required />
      </Grid>
      <Grid item xs={6}>
        <TextField
          select
          required
          {...regime}
          label='Regime'
          helperText='Selecione o Regime Tributário'
        >
          <MenuItem value={null}>Nenhum</MenuItem>
          {Object.values(TaxRegimes).map(renderSelect)}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        {actions && actions(submitting, pristine, invalid)}
      </Grid>
    </Grid>
  )
}

UpsertCompanyInfoForm.propTypes = {
  initialValues: PropTypes.object,
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertCompanyInfoForm.defaultProps = {
  onSubmit: () => {}
}

export default UpsertCompanyInfoForm
