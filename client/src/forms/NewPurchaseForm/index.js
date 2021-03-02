import React, { useRef, useEffect } from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'

import TextField from 'src/components/TextField'

const validate = (values) => {
  const errors = {}

  if (!values.accessKey) {
    errors.accessKey = 'Esse campo é obrigatório'
  }

  return errors
}

const NewPurchaseForm = ({ actions, onSubmit }) => {
  const inputAccessKey = useRef()

  useEffect(() => {
    inputAccessKey.current.focus()
  }, [])

  /* FORM */
  const { form, handleSubmit, invalid, pristine, submitting } = useForm({
    initialValues: {},
    validate,
    onSubmit
  })

  /* FORM FIELDS */
  const discount = useField('accessKey', form)

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            {...discount}
            required
            variant='outlined'
            inputRef={inputAccessKey}
            label='Chave de Acesso'
            fullWidth
            helperText='Chave de acesso do seu cupom fiscal'
          />
        </Grid>
      </Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </form>
  )
}

NewPurchaseForm.propTypes = {
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

NewPurchaseForm.defaultProps = {
  onSubmit: () => {}
}

export default NewPurchaseForm
