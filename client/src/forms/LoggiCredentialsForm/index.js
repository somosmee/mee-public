import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'

import TextField from 'src/components/TextField'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.username) {
    errors.username = 'Usuário em branco'
  }

  if (!values.password) {
    errors.password = 'Senha em branco'
  }

  return errors
}

const LoggiCredentialsForm = ({ loggi, disabled, actions, onSubmit }) => {
  const classes = useStyles()

  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues: loggi,
    onSubmit,
    validate
  })

  const username = useField('username', form)
  const password = useField('password', form)

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(values)
  }

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
        <TextField {...username} disabled={disabled} type='text' label='Usuário' fullWidth />
      </Grid>
      <Grid item xs={12}>
        <TextField {...password} disabled={disabled} type='password' label='Senha' fullWidth />
      </Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </Grid>
  )
}

LoggiCredentialsForm.propTypes = {
  loggi: PropTypes.object,
  disabled: PropTypes.bool,
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

LoggiCredentialsForm.defaultProps = {
  disabled: false,
  actions: () => {},
  onSubmit: () => {}
}

export default LoggiCredentialsForm
