import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'

import Switch from 'src/components/Switch'
import TextField from 'src/components/TextField'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.name) {
    errors.name = 'Digite um nome para a categoria'
  }

  return errors
}

const UpsertIfoodCategoryForm = ({ category, actions, onClose, onSubmit }) => {
  const classes = useStyles()

  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues: category,
    onSubmit,
    validate
  })

  const available = useField('available', form)
  const name = useField('name', form)
  const description = useField('description', form)

  const handleSubmit = (event) => {
    event.preventDefault()

    const category = {
      id: values.id,
      externalCode: values.externalCode,
      available: values.available,
      name: values.name,
      description: values.description,
      position: values.position
    }

    onSubmit(category)
  }

  const margin = 'dense'

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
        <Switch {...available} label='Diponível' disabled={!category} />
      </Grid>
      <Grid item xs={12}>
        <TextField {...name} type='text' label='Nome' margin={margin} required fullWidth />
      </Grid>
      <Grid item xs={12}>
        <TextField
          {...description}
          type='text'
          label='Descrição'
          multiline
          rows={2}
          margin={margin}
          fullWidth
        />
      </Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </Grid>
  )
}

UpsertIfoodCategoryForm.propTypes = {
  actions: PropTypes.func,
  onClose: PropTypes.func,
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string
  }),
  onSubmit: PropTypes.func
}

UpsertIfoodCategoryForm.defaultProps = {
  onSubmit: () => {}
}

export default UpsertIfoodCategoryForm
