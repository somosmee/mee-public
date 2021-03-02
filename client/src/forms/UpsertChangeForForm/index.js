import React, { useRef, useEffect } from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'

import TextField from 'src/components/TextField'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (isNaN(values.changeFor)) {
    errors.changeFor = 'Troco para em branco'
  }

  return errors
}

const UpsertChangeForm = ({ initialValues, actions, onSubmit }) => {
  const classes = useStyles()

  const inputRef = useRef()
  const { form, handleSubmit, invalid, pristine, submitting } = useForm({
    initialValues,
    onSubmit,
    validate
  })
  const changeFor = useField('changeFor', form)

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return (
    <Grid
      className={classes.root}
      container
      component='form'
      autoComplete='off'
      onSubmit={handleSubmit}
      spacing={1}
    >
      <Grid item xs={12}>
        <TextField
          {...changeFor}
          inputRef={inputRef}
          type='number'
          placeholder='Troco para'
          required
        />
      </Grid>
      {actions && actions(submitting, pristine, invalid)}
    </Grid>
  )
}

UpsertChangeForm.propTypes = {
  initialValues: PropTypes.string,
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertChangeForm.defaultProps = {
  onSubmit: () => {}
}

export default UpsertChangeForm
