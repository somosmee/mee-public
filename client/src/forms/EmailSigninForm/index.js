import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'
import isEmail from 'validator/lib/isEmail'

import Grid from '@material-ui/core/Grid'

import Button from 'src/components/Button'
import TextField from 'src/components/TextField'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.email) {
    errors.email = 'E-mail em branco'
  }

  if (values.email && !isEmail(values.email.trim())) {
    errors.email = 'E-mail inválido'
  }

  return errors
}

const EmailSigninForm = ({ loading, onSubmit }) => {
  const classes = useStyles()

  const { form, handleSubmit, invalid, pristine, submitting } = useForm({
    onSubmit,
    validate
  })

  const email = useField('email', form)

  return (
    <Grid className={classes.root} container component='form' spacing={2} onSubmit={handleSubmit}>
      <Grid item xs={12}>
        <TextField
          {...email}
          id='email'
          type='email'
          placeholder='E-mail'
          variant='outlined'
          helperText='Insira seu e-mail para entrar na plataforma'
          fullWidth
          required
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          loading={loading}
          color='primary'
          variant='contained'
          type='submit'
          disabled={submitting || pristine || invalid}
          fullWidth
        >
          Entrar
        </Button>
      </Grid>
    </Grid>
  )
}

EmailSigninForm.propTypes = {
  loading: PropTypes.bool,
  onSubmit: PropTypes.func
}

EmailSigninForm.defaultProps = {
  loading: false,
  onSubmit: () => {}
}

export default EmailSigninForm
