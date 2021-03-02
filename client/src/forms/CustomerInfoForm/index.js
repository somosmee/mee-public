import React, { useRef, useEffect } from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'

import TextField from 'src/components/TextField'

import useStyles from './styles'

const CustomerInfoForm = ({ initialValues, actions, onSubmit }) => {
  const classes = useStyles()

  const inputRef = useRef()
  const { form, handleSubmit, invalid, pristine, submitting } = useForm({ initialValues, onSubmit })
  const mobile = useField('mobile', form)
  const name = useField('name', form)

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
          {...mobile}
          inputRef={inputRef}
          placeholder='(11) 987255113'
          type='phone'
          label='Celular'
          required
          fullWidth
        />
        <TextField
          {...name}
          placeholder='Nome Sobrenome'
          type='text'
          label='Nome'
          required
          fullWidth
        />
      </Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </Grid>
  )
}

CustomerInfoForm.propTypes = {
  initialValues: PropTypes.object,
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

CustomerInfoForm.defaultProps = {
  onSubmit: () => {}
}

export default CustomerInfoForm
