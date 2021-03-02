import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'
import isEmail from 'validator/lib/isEmail'

import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Button from 'src/components/Button'
import TextField from 'src/components/TextField'
import TextFieldMasked from 'src/components/TextFieldMasked'

import { isCPF } from 'src/utils/validator'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.mobile || values.mobile.length !== 11) {
    errors.mobile = 'Celular inválido'
  }

  if (!values.firstName) {
    errors.firstName = 'Nome inválido'
  }

  if (!values.lastName) {
    errors.lastName = 'Sobrenome inválido'
  }

  if (values.email && !isEmail(values.email)) {
    errors.email = 'E-mail inválido'
  }

  if (values.nationalId && !isCPF(values.nationalId)) {
    errors.nationalId = 'CPF inválido'
  }

  return errors
}

const UpsertCustomerForm = ({ initialValues, actions, onManageAddress, onSubmit }) => {
  const classes = useStyles()
  const theme = useTheme()
  const upSmall = useMediaQuery(theme.breakpoints.up('sm')) || true

  const { form, handleSubmit, invalid, pristine, submitting } = useForm({
    initialValues,
    onSubmit,
    validate
  })

  const mobile = useField('mobile', form)
  const firstName = useField('firstName', form)
  const lastName = useField('lastName', form)
  const email = useField('email', form)
  const nationalId = useField('nationalId', form)
  const birthday = useField('birthday', form)
  const businessName = useField('business.name', form)
  const businessNationalId = useField('business.nationalId', form)
  const receiveOffers = useField('receiveOffers', form)

  const xs = upSmall ? 6 : 12

  return (
    <Grid
      className={classes.root}
      container
      component='form'
      autoComplete='off'
      onSubmit={handleSubmit}
      spacing={1}
    >
      <Grid item xs={xs}>
        <TextFieldMasked
          {...mobile}
          id='mobile'
          type='tel'
          label='Celular'
          placeholder='Ex.: 11923456789'
          mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
          required
          fullWidth
        />
      </Grid>
      {upSmall && <Grid item xs={6}></Grid>}
      <Grid item xs={xs}>
        <TextField {...firstName} id='firstName' type='text' label='Nome' required fullWidth />
      </Grid>
      <Grid item xs={xs}>
        <TextField {...lastName} id='lastName' type='text' label='Sobrenome' required fullWidth />
      </Grid>
      <Grid item xs={12}>
        <TextField {...email} id='email' type='email' label='E-mail' fullWidth />
      </Grid>
      <Grid item xs={xs}>
        <TextField {...nationalId} id='nationalId' type='text' label='CPF' fullWidth />
      </Grid>
      <Grid item xs={xs}>
        <TextField
          {...birthday}
          id='birthday'
          type='date'
          label='Data de nascimento'
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              {...receiveOffers.input}
              id='receiveOffers'
              checked={!!receiveOffers.input.value}
              color='primary'
              inputProps={{ 'aria-label': 'Aceito receber ofertas' }}
            />
          }
          label='Aceito receber ofertas e promocões'
        />
      </Grid>
      {onManageAddress && initialValues && (
        <Grid item xs={12}>
          <Button
            id='manage-addresses'
            variant='outlined'
            color='primary'
            size='large'
            onClick={onManageAddress}
          >
            Gerenciar endereços
          </Button>
        </Grid>
      )}
      <Grid item xs={12}>
        <Typography variant='overline'>Empresa</Typography>
      </Grid>
      <Grid item xs={xs}>
        <TextField
          {...businessNationalId}
          id='businessNationalId'
          type='text'
          label='CNPJ'
          fullWidth
        />
      </Grid>
      <Grid item xs={xs}>
        <TextField {...businessName} id='businessName' type='text' label='Nome' fullWidth />
      </Grid>
      {actions && (
        <Grid item xs={12}>
          {actions(submitting, pristine, invalid, handleSubmit)}
        </Grid>
      )}
    </Grid>
  )
}

UpsertCustomerForm.propTypes = {
  initialValues: PropTypes.object,
  actions: PropTypes.func,
  onManageAddress: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertCustomerForm.defaultProps = {
  onSubmit: () => {}
}

export default UpsertCustomerForm
