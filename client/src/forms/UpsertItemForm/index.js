import React, { useRef, useEffect } from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import IntegerFormat from 'src/components/IntegerFormat'
import PriceFormat from 'src/components/PriceFormat'
import TextField from 'src/components/TextField'

import numeral from 'src/utils/numeral'

import useStyles from './styles'

const validate = (values) => {
  const errors = {}

  if (isNaN(values.unitPrice)) {
    errors.unitPrice = 'Insira o preço unitário do item'
  }

  if (!values.quantity) {
    errors.quantity = 'Insira a quantidade'
  }

  return errors
}

const UpsertItemForm = ({ item, actions, onSubmit }) => {
  const classes = useStyles()

  const inputUnitPrice = useRef()

  useEffect(() => {
    inputUnitPrice.current.focus()
  }, [])

  const hasItemProperties = item && item.unitPrice && item.quantity

  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues: hasItemProperties ? item : { quantity: 1 },
    onSubmit,
    validate
  })

  const unitPrice = useField('unitPrice', form)
  const quantity = useField('quantity', form)

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      ...item,
      ...values,
      totalPrice: parseFloat(values.quantity) * parseFloat(values.unitPrice)
    })
  }

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <Grid container spacing={3} alignItems='center'>
        <Grid item xs>
          <TextField
            {...unitPrice}
            required
            variant='outlined'
            inputRef={inputUnitPrice}
            label='Preço unitário'
            placeholder='0,00'
            fullWidth
            InputProps={{
              inputComponent: PriceFormat
            }}
          />
        </Grid>
        <Grid container item xs direction='column' justify='center' alignItems='center'>
          <TextField
            {...quantity}
            variant='outlined'
            label='Quantidade'
            required
            fullWidth
            InputProps={{
              inputComponent: IntegerFormat
            }}
          />
        </Grid>
        <Grid item xs>
          <Typography>Preço Total</Typography>
          <Typography>
            {numeral(parseFloat(values.quantity) * parseFloat(values.unitPrice)).format('$ 0.00')}
          </Typography>
        </Grid>
      </Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </form>
  )
}

UpsertItemForm.propTypes = {
  item: PropTypes.object,
  actions: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertItemForm.defaultProps = {
  item: {},
  onSubmit: () => {}
}

export default UpsertItemForm
