import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'

import TextField from 'src/components/TextField'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.change) {
    errors.change = 'Troco em branco'
  }

  return errors
}

const ChangeForm = ({ actions, onClose, onSubmit }) => {
  const classes = useStyles()

  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues: { change: 0.0 },
    onSubmit,
    validate
  })

  const change = useField('change', form)

  const handleSubmit = (e) => {
    e.preventDefault()
    const movement = { ...values, change: parseFloat(values.change) }
    onSubmit(movement)
  }

  return (
    <form classes={classes.root} onSubmit={handleSubmit}>
      <Grid container spacing={1} alignItems='flex-end'>
        <Grid item xs>
          <TextField {...change} type='number' label='Troco' />
        </Grid>
      </Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </form>
  )
}

ChangeForm.propTypes = {
  actions: PropTypes.func,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
}

ChangeForm.defaultProps = {
  actions: () => {},
  onClose: () => {},
  onSubmit: () => {}
}

export default ChangeForm
