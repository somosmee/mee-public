import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Switch from '@material-ui/core/Switch'

import TextField from 'src/components/TextField'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.merchant) {
    errors.merchant = 'Id do comerciante em branco'
  }

  if (!values.username) {
    errors.username = 'Usuário em branco'
  }

  if (!values.password) {
    errors.password = 'Senha em branco'
  }

  return errors
}

const IfoodCredentialsForm = ({ ifood, disabled, actions, onOpenToggle, onSubmit }) => {
  const classes = useStyles()

  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues: ifood,
    onSubmit,
    validate
  })

  const merchant = useField('merchant', form)
  const username = useField('username', form)
  const password = useField('password', form)

  const handleOpenToggle = (event) => {
    event.preventDefault()
    onOpenToggle({ open: event.target.checked })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const { open, ...rest } = values
    onSubmit(rest)
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
      <Grid item>
        <FormControlLabel
          disabled={disabled}
          control={<Switch checked={ifood?.open} color='primary' onChange={handleOpenToggle} />}
          label='Aberto'
        />
        <Link
          href='https://medium.com/@somosmee/plano-de-indica%C3%A7%C3%A3o-como-ganhar-dinheiro-sem-sair-de-casa-8286c6ee795c'
          target='_blank'
          rel='noreferrer'
        >
          Saiba mais aqui!
        </Link>
      </Grid>
      <Grid item xs={12}>
        <TextField
          {...merchant}
          disabled={disabled}
          type='text'
          label='Id do comerciante'
          placeholder='Merchant Id'
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          {...username}
          disabled={disabled}
          type='text'
          label='Usuário'
          placeholder='Username'
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          {...password}
          disabled={disabled}
          type='password'
          label='Senha'
          placeholder='Password'
          fullWidth
        />
      </Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </Grid>
  )
}

IfoodCredentialsForm.propTypes = {
  ifood: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    merchant: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string
  }),
  disabled: PropTypes.bool,
  actions: PropTypes.func,
  onOpenToggle: PropTypes.func,
  onSubmit: PropTypes.func
}

IfoodCredentialsForm.defaultProps = {
  disabled: false,
  actions: () => {},
  onOpenToggle: () => {},
  onSubmit: () => {}
}

export default IfoodCredentialsForm
