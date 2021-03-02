import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'

import Select from 'src/components/Select'
import TextField from 'src/components/TextField'

import { Reasons, Measurements } from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (isNaN(values.balance)) {
    errors.balance = 'Estoque em branco'
  }

  if (!values.reason) {
    errors.reason = 'Motivo em branco'
  }

  return errors
}

const { acquisition, sale, ...reasons } = Reasons

const InventoryAdjustmentForm = ({ initialValues, actions, onClose, onSubmit }) => {
  const classes = useStyles()

  const { form, handleSubmit, invalid, pristine, submitting } = useForm({
    initialValues: { balance: initialValues.balance },
    onSubmit,
    validate
  })

  const balance = useField('balance', form)
  const reason = useField('reason', form)

  const renderMenuItem = (key) => {
    return (
      <option className={classes.option} key={key} value={reasons[key].type}>
        {reasons[key].name}
      </option>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={1} alignItems='flex-end'>
        <Grid item xs={12}>
          <Typography variant='body2' color='textSecondary'>
            {initialValues.gtin}
          </Typography>
          <Typography className={classes.name} variant='h5'>
            {initialValues.name}
          </Typography>
          <Typography component='span' color='textSecondary'>
            {numeral(initialValues.price).format('$ 0.00')}
          </Typography>{' '}
          <Typography component='span' color='textSecondary'>
            {Measurements[initialValues.measurement].symbol}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='body2' paragraph>
            {initialValues.description}
          </Typography>
        </Grid>
        <Grid item xs>
          <TextField {...balance} type='number' label='Estoque' />
        </Grid>
        <Grid item xs>
          <FormControl className={classes.formControl}>
            <InputLabel shrink id='demo-simple-select-placeholder-label-label'>
              Motivo
            </InputLabel>
            <Select {...reason} native type='text' required>
              <option value='' disabled>
                Nenhum
              </option>
              {Object.keys(reasons).map(renderMenuItem)}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </form>
  )
}

InventoryAdjustmentForm.propTypes = {
  initialValues: PropTypes.object,
  actions: PropTypes.func,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
}

InventoryAdjustmentForm.defaultProps = {
  actions: () => {},
  onClose: () => {},
  onSubmit: () => {}
}

export default InventoryAdjustmentForm
