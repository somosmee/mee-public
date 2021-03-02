import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'

import TextField from 'src/components/TextField'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.password) {
    errors.password = 'Senha em branco'
  }

  return errors
}

const CertificateForm = ({ initialValues, actions, onSubmit }) => {
  const classes = useStyles()

  const { form, handleSubmit, invalid, pristine, submitting } = useForm({
    initialValues,
    onSubmit,
    validate
  })
  const password = useField('password', form)

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
          {...password}
          type='password'
          placeholder='Senha do certificado digital A1'
          required
          fullWidth
        />
      </Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </Grid>
  )
}

CertificateForm.propTypes = {
  initialValues: PropTypes.object,
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

CertificateForm.defaultProps = {
  onSubmit: () => {}
}

export default CertificateForm
