import React, { useState } from 'react'

import PropTypes from 'prop-types'

import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import DeleteIcon from '@material-ui/icons/Delete'

import PercentageFormat from 'src/components/PercentageFormat'
import PriceFormat from 'src/components/PriceFormat'

import { OperationTypes } from 'src/utils/enums'

import useStyles from './styles'

const UpsertFeesForm = ({ initialValues, actions, onSubmit }) => {
  const classes = useStyles()

  const [fees, setFees] = useState(initialValues || [])

  const handleDeleteRule = (index) => {
    setFees(fees.filter((item, i) => i !== index))
  }

  const handleChange = (value, index, key) => {
    setFees((fees) => fees.map((rule, i) => (i === index ? { ...rule, [key]: value } : rule)))
  }

  const renderRule = (item, index) => {
    return (
      <>
        <Grid item xs={5}>
          <TextField
            value={fees[index].name}
            onChange={(event) => handleChange(event.target.value, index, 'name')}
            required
            label='Nome'
            fullWidth
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            value={fees[index].value}
            onChange={(event) => handleChange(parseFloat(event.target.value), index, 'value')}
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
          <Grid item container justify='center' spacing={2} xs={12}>
            {!isEmpty ? (
              fees.map(renderRule)
            ) : (
              <Typography variant='body2' color='textSecondary' align='center'>
                Não existem taxas para esse pedido
              </Typography>
            )}
            {}
          </Grid>
        </Grid>
      </CardContent>
      {actions && actions(handleSubmit)}
    </>
  )
}

UpsertFeesForm.propTypes = {
  initialValues: PropTypes.object,
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertFeesForm.defaultProps = {
  onSubmit: () => {}
}

export default UpsertFeesForm
