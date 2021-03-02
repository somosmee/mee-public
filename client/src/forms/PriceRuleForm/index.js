import React, { useState } from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextFieldMaterial from '@material-ui/core/TextField'

import Autocomplete from '@material-ui/lab/Autocomplete'

import Select from 'src/components/Select'
import Switch from 'src/components/Switch'
import TextField from 'src/components/TextField'

import { OperationTypes, Integrations } from 'src/utils/enums'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (!values.name) {
    errors.name = 'Nome em branco'
  }

  if (isNaN(values.amount)) {
    errors.amount = 'Valor em branco'
  }

  if (!values.operationType) {
    errors.operationType = 'Tipo de operação em branco'
  }

  return errors
}

const PriceRule = ({ rule, onCancel, onSubmit }) => {
  const classes = useStyles()

  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues: { ...rule, operationType: OperationTypes.percentage.value },
    onSubmit,
    validate
  })

  const name = useField('name', form)
  const amount = useField('amount', form)
  const operationType = useField('operationType', form)
  const active = useField('active', form)
  const [channels, setChannels] = useState(rule?.channels ?? [])

  const handleSubmit = (event) => {
    event.preventDefault()

    const rule = {
      ...values,
      amount: parseFloat(values.amount),
      channels: channels.map((channel) => channel.value)
    }
    onSubmit(rule)
  }

  const handleCancel = (event) => {
    onCancel()
  }

  const renderOption = (option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  )

  return (
    <Grid
      className={classes.root}
      component='form'
      container
      spacing={2}
      autoComplete='off'
      onSubmit={handleSubmit}
    >
      <Grid item xs={4}>
        <TextField {...name} type='text' label='Nome' required />
      </Grid>
      <Grid item xs={4}>
        <TextField {...amount} type='number' label='Valor' required />
      </Grid>
      <Grid item xs={4}>
        <Select {...operationType} native label='Tipo de operação' required fullWidth>
          {Object.values(OperationTypes).map(renderOption)}
        </Select>
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          multiple
          size='small'
          options={Object.values(Integrations)}
          getOptionLabel={(option) => option.label}
          renderInput={(props) => (
            <TextFieldMaterial
              {...props}
              variant='standard'
              label='Canais'
              placeholder='Selecione os canais'
            />
          )}
          onChange={(event, newValue) => setChannels(newValue)}
        />
      </Grid>
      <Grid item xs='auto'>
        <Switch {...active} label='Ativo' />
      </Grid>
      <Grid container item xs display='flex' justify='flex-end' spacing={1}>
        <Grid item>
          <Button color='primary' onClick={handleCancel}>
            Cancelar
          </Button>
        </Grid>
        <Grid item>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={submitting || pristine || invalid}
          >
            {rule ? 'Atualizar' : 'Adicionar'}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

PriceRule.propTypes = {
  rule: PropTypes.object,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func
}

PriceRule.defaultProps = {
  onCancel: () => {},
  onSubmit: () => {}
}

export default PriceRule
