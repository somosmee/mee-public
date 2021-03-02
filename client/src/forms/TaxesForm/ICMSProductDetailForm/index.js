import React from 'react'
import { useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'

import TextField from 'src/components/TextField'

import { ICMSOrigin } from 'src/utils/enums'

import useStyles from './styles'

const ICMSProductDetailForm = ({ form, values }) => {
  const classes = useStyles()

  const icmsOrigin = useField('tax.icmsOrigin', form)
  const icmsTaxPercentage = useField('tax.icmsTaxPercentage', form)

  const renderSelect = (item, index) => {
    return (
      <MenuItem className={classes.menuItem} key={index} value={item.value}>
        {item.name}
      </MenuItem>
    )
  }

  return (
    <Grid className={classes.root} container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          {...icmsOrigin}
          label='Origem da mercadoria'
          disabled
          fullWidth
          helperText='Selecione a origem da mercadoria'
        >
          <MenuItem value={''}>Nenhum</MenuItem>
          {Object.values(ICMSOrigin).map(renderSelect)}
        </TextField>
        <TextField
          {...icmsTaxPercentage}
          type='number'
          fullWidth
          disabled
          helperText='Ex: 1.00 (1%)'
          label='Porcentagem do imposto'
        >
          <MenuItem value={''}>Nenhum</MenuItem>
          {Object.values(ICMSOrigin).map(renderSelect)}
        </TextField>
      </Grid>
    </Grid>
  )
}

ICMSProductDetailForm.propTypes = {
  form: PropTypes.any,
  values: PropTypes.any
}

ICMSProductDetailForm.defaultProps = {
  form: null
}

export default ICMSProductDetailForm
