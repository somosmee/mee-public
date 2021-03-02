import React, { useState } from 'react'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import AddCircleOutline from '@material-ui/icons/AddCircleOutline'
import DeleteIcon from '@material-ui/icons/Delete'

import PercentageFormat from 'src/components/PercentageFormat'
import PriceFormat from 'src/components/PriceFormat'

import { OperationTypes } from 'src/utils/enums'

import useStyles from './styles'

const FeesForm = ({ initialValues, actions, loading, onSubmit }) => {
  const classes = useStyles()

  const [fees, setFees] = useState(initialValues || [])

  const handleAddRule = () => {
    setFees([
      ...fees,
      {
        name: 'Serviço',
        fee: 10.0,
        operationType: OperationTypes.percentage.value,
        enabled: true
      }
    ])
  }

  const handleDeleteRule = (index) => {
    setFees(fees.filter((item, i) => i !== index))
  }

  const handleChange = (value, index, key) => {
    setFees((fees) => fees.map((rule, i) => (i === index ? { ...rule, [key]: value } : rule)))
  }

  const renderSelect = (item, index) => {
    return (
      <MenuItem key={index} value={item.value}>
        {item.name}
      </MenuItem>
    )
  }

  const renderRule = (item, index) => {
    return (
      <>
        <Grid item xs={3}>
          <TextField
            value={fees[index].name}
            onChange={(event) => handleChange(event.target.value, index, 'name')}
            required
            label='Nome'
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            value={fees[index].fee}
            onChange={(event) => handleChange(parseFloat(event.target.value), index, 'fee')}
            required
            placeholder='0,00'
            label='Valor'
            fullWidth
            InputProps={{
              inputComponent:
                fees[index].operationType === OperationTypes.percentage.value
                  ? PercentageFormat
                  : PriceFormat
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            select
            value={fees[index].operationType}
            onChange={(event) => handleChange(event.target.value, index, 'operationType')}
            required
            label='Tipo'
            fullWidth
          >
            {[
              { value: OperationTypes.percentage.value, name: OperationTypes.percentage.label },
              { value: OperationTypes.absolute.value, name: OperationTypes.absolute.label }
            ].map(renderSelect)}
          </TextField>
        </Grid>
        <Grid item xs={1}>
          <Switch
            checked={fees[index].enabled}
            onChange={(event) => handleChange(event.target.checked, index, 'enabled')}
            name='enabled'
            color='primary'
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton
            aria-label='delete'
            className={classes.margin}
            onClick={() => handleDeleteRule(index)}
          >
            <DeleteIcon fontSize='small' />
          </IconButton>
        </Grid>
      </>
    )
  }

  const handleSubmit = () => {
    onSubmit(fees)
  }

  const isEmpty = !fees?.length > 0

  return (
    <>
      <CardContent>
        <Grid
          className={classes.root}
          container
          spacing={3}
          component='form'
          autoComplete='off'
          onSubmit={onSubmit}
        >
          <Grid item xs={12}>
            <Button
              size='small'
              color='primary'
              variant='contained'
              disabled={fees?.length >= 5}
              startIcon={<AddCircleOutline />}
              onClick={handleAddRule}
            >
              Adicionar taxa
            </Button>
          </Grid>
          <Grid item container justify='center' spacing={2} xs={12}>
            {!isEmpty ? (
              fees.map(renderRule)
            ) : (
              <Typography variant='body2' color='textSecondary' align='center'>
                Você ainda não tem taxas de venda cadastradas
              </Typography>
            )}
            {}
          </Grid>
        </Grid>
      </CardContent>
      {actions && actions(loading, handleSubmit, isEmpty)}
    </>
  )
}

FeesForm.propTypes = {
  initialValues: PropTypes.object,
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

FeesForm.defaultProps = {
  onSubmit: () => {}
}

export default FeesForm
