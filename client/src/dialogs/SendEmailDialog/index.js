import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import InputAdornment from '@material-ui/core/InputAdornment'

import Email from '@material-ui/icons/Email'

import TextField from 'src/components/TextField'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.email) {
    errors.email = 'Email é obrigatório'
  }

  return errors
}

const InvoiceDialog = ({
  open,
  initialValues,
  order,
  onClose,
  onSubmit,
  fullScreen
}) => {
  const classes = useStyles()

  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues,
    onSubmit,
    validate
  })

  const email = useField('email', form)

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(values)
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enviar por email</DialogTitle>
      <DialogContent>
        <TextField
          className={classes.email}
          {...email}
          fullWidth
          label='Email'
          variant='outlined'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Email />
              </InputAdornment>
            )
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancelar
        </Button>
        <Button
          disabled={submitting || pristine || invalid}
          onClick={handleSubmit}
          color='primary'>
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

InvoiceDialog.propTypes = {
  initialValues: PropTypes.object,
  order: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  fullScreen: PropTypes.bool
}

InvoiceDialog.defaultProps = {
  order: {},
  open: false,
  onClose: () => {},
  onSubmit: () => {},
  fullScreen: false,
  initialValues: null
}

export default InvoiceDialog
