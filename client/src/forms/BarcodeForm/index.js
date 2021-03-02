import React, { useRef, useEffect } from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'

import TextField from 'src/components/TextField'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.gtin) {
    errors.gtin = 'Código de barras em branco'
  }

  return errors
}

const BarcodeForm = ({ actions, onSubmit }) => {
  const classes = useStyles()

  const inputBarcode = useRef()

  useEffect(() => {
    inputBarcode.current.focus()
  }, [])

  const { form, handleSubmit, invalid, pristine, submitting } = useForm({
    onSubmit,
    validate
  })

  const gtin = useField('gtin', form)

  return (
    <Grid
      className={classes.root}
      container
      component='form'
      autoComplete='off'
      onSubmit={handleSubmit}
      spacing={1}
    >
      <Grid item xs>
        <TextField
          {...gtin}
          inputRef={inputBarcode}
          type='text'
          label='Código de barras'
          variant='outlined'
          required
          fullWidth
        />
      </Grid>
      {actions && actions(submitting, pristine, invalid)}
    </Grid>
  )
}

BarcodeForm.propTypes = {
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

BarcodeForm.defaultProps = {
  onSubmit: () => {}
}

export default BarcodeForm
