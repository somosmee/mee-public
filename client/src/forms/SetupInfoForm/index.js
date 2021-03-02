import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'

import TextField from 'src/components/TextField'
import TextFieldMasked from 'src/components/TextFieldMasked'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.name) {
    errors.name = 'Nome da loja em branco'
  }

  return errors
}

const SetupInfoForm = ({ initialValues, actions, onSubmit }) => {
  const classes = useStyles()
  const { form, handleSubmit, pristine, invalid, submitting } = useForm({
    initialValues,
    onSubmit,
    validate
  })

  const name = useField('name', form)
  const nationalId = useField('nationalId', form)

  const margin = 'dense'

  return (
    <Grid
      className={classes.root}
      container
      component='form'
      autoComplete='off'
      onSubmit={handleSubmit}
      spacing={3}
    >
      <Grid item xs={12}>
        <TextField {...name} type='text' required label='Nome da Loja' margin={margin} fullWidth />
      </Grid>
      <Grid item xs={12}>
        <TextFieldMasked
          {...nationalId}
          type='text'
          required
          label='CNPJ'
          margin={margin}
          fullWidth
          placeholder='35.725.558/0001-19'
          mask={[
            /\d/,
            /\d/,
            '.',
            /\d/,
            /\d/,
            /\d/,
            '.',
            /\d/,
            /\d/,
            /\d/,
            '/',
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            '-',
            /\d/,
            /\d/
          ]}
        />
      </Grid>
      <Grid item xs={12}></Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </Grid>
  )
}

SetupInfoForm.propTypes = {
  initialValues: PropTypes.object,
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

SetupInfoForm.defaultProps = {
  initialValues: {}
}

export default SetupInfoForm
