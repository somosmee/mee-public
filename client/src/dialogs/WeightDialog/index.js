import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import TextField from 'src/components/TextField'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (isNaN(values.weight)) {
    errors.weight = 'Peso em branco'
  }

  return errors
}

const WeightDialog = ({ onCancel, onSubmit }) => {
  const classes = useStyles()

  const { form, values, invalid, pristine, submitting } = useForm({
    onSubmit,
    validate
  })

  /* FORM FIELDS */
  const weight = useField('weight', form)

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(parseFloat(values.weight.replace(',', '.')))
  }

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <DialogTitle>Adicione a quantidade</DialogTitle>
      <DialogContent>
        <TextField {...weight} type='text' label='Peso' required fullWidth />
      </DialogContent>
      <DialogActions className={classes.root}>
        <Button color='secondary' onClick={onCancel}>
          Voltar
        </Button>
        <Button type='submit' color='primary' disabled={submitting || pristine || invalid}>
          Adicionar
        </Button>
      </DialogActions>
    </form>
  )
}

WeightDialog.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func
}

WeightDialog.defaultProps = {
  onCancel: () => {},
  onSubmit: () => {}
}

export default WeightDialog
