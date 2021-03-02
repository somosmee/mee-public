import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'

import TextField from 'src/components/TextField'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.width) {
    errors.width = 'Insira a largura do pacote'
  }

  if (!values.height) {
    errors.height = 'Insira a altura do pacote'
  }

  if (!values.length) {
    errors.length = 'Insira a profundidade do pacote'
  }

  if (!values.weight) {
    errors.weight = 'Insira o peso do pacote'
  }

  return errors
}

const UpsertDimensionsForm = ({ dimensions, actions, onSubmit }) => {
  const classes = useStyles()

  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues: dimensions,
    onSubmit,
    validate
  })

  const width = useField('width', form)
  const height = useField('height', form)
  const length = useField('length', form)
  const weight = useField('weight', form)

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      ...dimensions,
      ...values
    })
  }

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <Grid container spacing={3} alignItems='center'>
        <Grid item xs={6}>
          <TextField
            {...width}
            variant='outlined'
            type='number'
            label='Largura'
            required
            fullWidth
            InputProps={{ endAdornment: <InputAdornment position='end'>cm</InputAdornment> }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            {...height}
            variant='outlined'
            type='number'
            label='Altura'
            required
            fullWidth
            InputProps={{ endAdornment: <InputAdornment position='end'>cm</InputAdornment> }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            {...length}
            variant='outlined'
            type='number'
            label='Profundidade'
            required
            fullWidth
            InputProps={{ endAdornment: <InputAdornment position='end'>cm</InputAdornment> }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            {...weight}
            variant='outlined'
            type='number'
            label='Peso'
            required
            fullWidth
            InputProps={{ endAdornment: <InputAdornment position='end'>g</InputAdornment> }}
          />
        </Grid>
      </Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </form>
  )
}

UpsertDimensionsForm.propTypes = {
  dimensions: PropTypes.object,
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertDimensionsForm.defaultProps = {
  dimensions: {},
  onSubmit: () => {}
}

export default UpsertDimensionsForm
