import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'

import Color from 'src/components/Color'
import TextField from 'src/components/TextField'

import { Colors } from 'src/utils/enums'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.name) {
    errors.name = 'Nome é obrigatório'
  }

  if (!values.color) {
    errors.color = 'Cor é obrigatório'
  }

  return errors
}

const UpsertFinancialStatementCategoryForm = ({
  initialValues,
  operation,
  actions,
  onClose,
  onSubmit
}) => {
  const classes = useStyles()

  /* FORM */
  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues: initialValues,
    onSubmit,
    validate
  })

  /* FORM FIELDS */
  const name = useField('name', form)

  /* HANDLE FUNCTIONS */

  const handleSubmit = (event) => {
    event.preventDefault()

    onSubmit({ id: values.id, name: values.name, color: values.color }, operation)
  }

  const handleColorClick = (color) => {
    form.change('color', color)
  }

  const margin = 'dense'

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            {...name}
            required
            type='text'
            label='Nome'
            variant='outlined'
            margin={margin}
            fullWidth
            InputProps={{
              classes: {
                input: classes.valueInput
              }
            }}
          />
        </Grid>
        <Grid item container spacing={3} xs={12}>
          {Colors.map((color, index) => (
            <Grid key={index} item>
              <Color
                size='large'
                color={color}
                showBadge={values.color === color}
                onClick={handleColorClick}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </form>
  )
}

UpsertFinancialStatementCategoryForm.propTypes = {
  actions: PropTypes.func,
  onClose: PropTypes.func,
  initialValues: PropTypes.object,
  isAdjust: PropTypes.bool,
  onSubmit: PropTypes.func,
  operation: PropTypes.string
}

UpsertFinancialStatementCategoryForm.defaultProps = {
  initialValues: null,
  isAdjust: false,
  onSubmit: () => {}
}

export default UpsertFinancialStatementCategoryForm
