import React, { useState, useRef, useEffect } from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'

import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import PercentageFormat from 'src/components/PercentageFormat'
import PriceFormat from 'src/components/PriceFormat'
import TextField from 'src/components/TextField'

const validate = (order, toggle) => (values) => {
  const errors = {}

  if (!values.discount) {
    errors.discount = 'Esse campo é obrigatório'
  }

  const rest = order.total - order.totalPaid

  const discount =
    toggle === 'percentage'
      ? (parseFloat(values?.discount) / 100) * order?.subtotal
      : values?.discount

  if (discount > rest) {
    errors.discount = `Desconto não pode ser maior do que o restante a pagar (R$ ${rest.toFixed(
      2
    )})`
  }

  return errors
}

const UpsertDiscountForm = ({ order, actions, onClose, onSubmit }) => {
  const inputPrice = useRef()

  const [toggle, setToggle] = useState('value')

  useEffect(() => {
    inputPrice.current.focus()
  }, [])

  /* FORM */
  const { form, values, invalid, pristine, submitting } = useForm({
    initialValues: {},
    validate: validate(order, toggle),
    onSubmit
  })

  /* FORM FIELDS */
  const discount = useField('discount', form)

  /* HANDLE FUNCTIONS */

  const handleChangeToggle = (e, value) => {
    setToggle(value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (toggle === 'percentage') {
      onSubmit({ discount: (parseFloat(values.discount) / 100) * order.subtotal })
    } else {
      onSubmit({ discount: parseFloat(values.discount) })
    }
  }

  const margin = 'dense'

  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item container justify='center' xs={12}>
          <Grid item>
            <ToggleButtonGroup
              value={toggle}
              exclusive
              onChange={handleChangeToggle}
              aria-label='selecione modo de venda'
            >
              <ToggleButton value='value' aria-label='left aligned'>
                Valor bruto
              </ToggleButton>
              <ToggleButton value='percentage' aria-label='centered'>
                Porcentagem
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...discount}
            required
            inputRef={inputPrice}
            label='Desconto'
            placeholder='0,00'
            margin={margin}
            fullWidth
            helperText='Desconto no valor total do pedido'
            InputProps={{
              inputComponent: toggle === 'value' ? PriceFormat : PercentageFormat
            }}
          />
        </Grid>
      </Grid>
      {actions && actions(submitting, pristine, invalid, handleSubmit)}
    </form>
  )
}

UpsertDiscountForm.propTypes = {
  actions: PropTypes.func,
  onClose: PropTypes.func,
  order: PropTypes.object,
  onSubmit: PropTypes.func
}

UpsertDiscountForm.defaultProps = {
  onSubmit: () => {}
}

export default UpsertDiscountForm
