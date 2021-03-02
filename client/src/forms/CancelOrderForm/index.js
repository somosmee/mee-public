import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'

import Select from 'src/components/Select'
import TextField from 'src/components/TextField'

import { IfoodCancellationReasons } from 'src/utils/enums'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.code) {
    errors.code = 'Preço em branco'
  }

  if (values.code === IfoodCancellationReasons[801] && !values.description) {
    errors.description = 'Medida em branco'
  }

  return errors
}

const CancelOrderForm = ({ actions, onClose, onSubmit }) => {
  const classes = useStyles()

  const { form, values, invalid, pristine, submitting } = useForm({ onSubmit, validate })

  const code = useField('code', form)
  const description = useField('description', form)

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(values)
  }

  const renderMenuItem = (key) => {
    return (
      <option className={classes.menuItem} key={key} value={IfoodCancellationReasons[key].code}>
        {IfoodCancellationReasons[key].description}
      </option>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <FormControl className={classes.formControl} required>
            <InputLabel>Motivo</InputLabel>
            <Select {...code} native type='text'>
              <option value=''></option>
              {Object.keys(IfoodCancellationReasons).map(renderMenuItem)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField {...description} type='text' label='Descrição' fullWidth />
        </Grid>
      </Grid>
      {actions && actions(submitting, pristine, invalid, values, handleSubmit)}
    </form>
  )
}

CancelOrderForm.propTypes = {
  actions: PropTypes.func,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
}

CancelOrderForm.defaultProps = {
  actions: () => {},
  onClose: () => {},
  onSubmit: () => {}
}

export default CancelOrderForm
