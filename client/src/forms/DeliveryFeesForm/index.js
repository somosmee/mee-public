import React, { useState } from 'react'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import AddCircleOutline from '@material-ui/icons/AddCircleOutline'
import DeleteIcon from '@material-ui/icons/Delete'

import IntegerFormat from 'src/components/IntegerFormat'
import PriceFormat from 'src/components/PriceFormat'

import { Conditions } from 'src/utils/enums'

import useStyles from './styles'

const DeliveryFeesForm = ({ initialValues, actions, loading, onSubmit }) => {
  const classes = useStyles()

  const [deliveryFeeRules, setDeliveryFeeRules] = useState(initialValues || [])

  const handleAddRule = () => {
    setDeliveryFeeRules([
      ...deliveryFeeRules,
      {
        condition: Conditions.LESS_THAN,
        distance: 3,
        fee: 3.5
      }
    ])
  }

  const handleDeleteRule = (index) => {
    setDeliveryFeeRules(deliveryFeeRules.filter((item, i) => i !== index))
  }

  const handleChange = (value, index, key) => {
    setDeliveryFeeRules((deliveryFeeRules) =>
      deliveryFeeRules.map((rule, i) => (i === index ? { ...rule, [key]: value } : rule))
    )
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
            select
            value={deliveryFeeRules[index].condition}
            onChange={(event) => handleChange(event.target.value, index, 'condition')}
            required
            label='Condição'
            fullWidth
          >
            {[
              { value: Conditions.LESS_THAN, name: 'Menor que' },
              { value: Conditions.GREATER_THAN, name: 'Maior que' }
            ].map(renderSelect)}
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <TextField
            value={deliveryFeeRules[index].distance}
            onChange={(event) => handleChange(parseFloat(event.target.value), index, 'distance')}
            required
            label='Distância'
            helperText='Distância em KM'
            fullWidth
            InputProps={{
              inputComponent: IntegerFormat
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            value={deliveryFeeRules[index].fee}
            onChange={(event) => handleChange(parseFloat(event.target.value), index, 'fee')}
            required
            label='Taxa delivery'
            fullWidth
            InputProps={{
              inputComponent: PriceFormat
            }}
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
    onSubmit(deliveryFeeRules)
  }

  const isEmpty = !deliveryFeeRules?.length > 0

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
              disabled={deliveryFeeRules?.length >= 5}
              startIcon={<AddCircleOutline />}
              onClick={handleAddRule}
            >
              Adicionar regra
            </Button>
          </Grid>
          <Grid item container justify='center' spacing={2} xs={12}>
            {!isEmpty ? (
              deliveryFeeRules.map(renderRule)
            ) : (
              <Typography variant='body2' color='textSecondary' align='center'>
                Você ainda não tem regras de taxa de delivery cadastradas
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

DeliveryFeesForm.propTypes = {
  initialValues: PropTypes.object,
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

DeliveryFeesForm.defaultProps = {
  onSubmit: () => {}
}

export default DeliveryFeesForm
