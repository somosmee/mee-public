import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'
import isNumeric from 'validator/lib/isNumeric'
import isPostalCode from 'validator/lib/isPostalCode'

import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import Paper from '@material-ui/core/Paper'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import TextField from 'src/components/TextField'
import TextFieldMasked from 'src/components/TextFieldMasked'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.postalCode || !isPostalCode(values.postalCode, 'BR')) {
    errors.postalCode = 'CEP inválido'
  }

  if (!values.district) {
    errors.district = 'Bairro inválido'
  }

  if (!values.street) {
    errors.street = 'Rua inválida'
  }

  if (values.number && !isNumeric(values.number, { no_symbols: true })) {
    errors.number = 'Adicione apenas números'
  } else if (!values.number && !values.noNumber) {
    errors.number = 'Número inválido'
  }

  return errors
}

const UpsertPickupAddressStep = ({ address, onPostalCodeBlur, onSubmit }) => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md')) || true

  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues: address,
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

  const handleBlur = (event) => {
    const value = event.target.value
    onPostalCodeBlur(value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const { noNumber, ...rest } = values
    if (noNumber) rest.number = ''
    if (address && address._id) rest._id = address._id

    onSubmit(rest)
  }

  const xs = upMedium ? 6 : 12
  const disabled = !!noNumber.input.value

  return (
    <>
      <DialogContent className={classes.content}>
        <form autoComplete='off' onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={xs}>
              <TextFieldMasked
                {...postalCode}
                type='text'
                label='CEP'
                required
                fullWidth
                autoFocus={!address}
                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
                onBlur={handleBlur}
              />
            </Grid>
            {upMedium && <Grid item xs={6}></Grid>}
            <Grid item xs={xs}>
              <TextField {...state} type='text' label='Estado' fullWidth disabled />
            </Grid>
            <Grid item xs={xs}>
              <TextField {...city} type='text' label='Cidade' fullWidth disabled />
            </Grid>
            <Grid item xs={12}>
              <TextField {...district} type='text' label='Bairro' fullWidth />
            </Grid>
            <Grid item xs={xs}>
              <TextField {...street} type='text' label='Rua/Avenida' fullWidth />
            </Grid>
            <Grid item xs={xs}>
              <TextField
                {...number}
                type='text'
                label='Número'
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
            <Grid item xs={upMedium ? 8 : 12}>
              <TextField
                {...complement}
                type='text'
                label='Andar/Apartamento (opcional)'
                fullWidth
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <Paper className={classes.actionPaper} elevation={10}>
        <DialogActions className={classes.actions}>
          <Button
            variant='contained'
            color='primary'
            size='large'
            fullWidth={!upMedium}
            disabled={submitting || pristine || invalid}
            onClick={handleSubmit}
          >
            {address && address._id ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Paper>
    </>
  )
}

UpsertPickupAddressStep.propTypes = {
  address: PropTypes.object,
  onPostalCodeBlur: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertPickupAddressStep.defaultProps = {
  onPostalCodeBlur: () => {},
  onSubmit: () => {}
}

export default UpsertPickupAddressStep
