import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'

import TextField from 'src/components/TextField'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (isNaN(values.total)) {
    errors.total = 'Insira o preço total da compra'
  }

  return errors
}

const UpsertTotalForm = ({ data, actions, onSubmit }) => {
  const classes = useStyles()

  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues: data,
    onSubmit,
    validate
  })

  const total = useField('total', form)

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ total: parseFloat(values.total) })
  }

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <Grid container spacing={3} alignItems='center'>
        <Grid item xs>
          <TextField
            {...total}
            variant='outlined'
            type='number'
            label='Preço total'
            required
            fullWidth
            InputProps={{ startAdornment: <InputAdornment position='start'>R$</InputAdornment> }}
          />
        </Grid>
      </Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </form>
  )
}

UpsertTotalForm.propTypes = {
  data: PropTypes.object,
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertTotalForm.defaultProps = {
  data: {},
  onSubmit: () => {}
}

export default UpsertTotalForm
