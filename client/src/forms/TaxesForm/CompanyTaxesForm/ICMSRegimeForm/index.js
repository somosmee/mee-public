import React from 'react'
import { useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import MenuItem from '@material-ui/core/MenuItem'

import TextField from 'src/components/TextField'

import { ICMSTaxRegimes, ICMSNormalTaxType, ICMSSimplesNacionalTaxType } from 'src/utils/enums'

const ICMSRegimeForm = ({ form, values }) => {
  const icmsRegime = useField('icmsRegime', form)
  const icmsTaxGroup = useField('icmsTaxGroup', form)

  const icmsTaxGroupOptions =
    values.icmsRegime === ICMSTaxRegimes.normal.value
      ? ICMSNormalTaxType
      : ICMSSimplesNacionalTaxType

  const renderSelect = (item, index) => {
    return (
      <MenuItem key={index} value={item.value}>
        {item.name}
      </MenuItem>
    )
  }

  return (
    <>
      <TextField
        select
        {...icmsRegime}
        label='Regime'
        fullWidth
        helperText='Selecione o regime do ICMS'
      >
        <MenuItem value={null}>Nenhum</MenuItem>
        {Object.values(ICMSTaxRegimes).map(renderSelect)}
      </TextField>
      {!!values.icmsRegime && (
        <TextField
          select
          {...icmsTaxGroup}
          label='Grupo de Tributação'
          fullWidth
          helperText='Selecione o grupo de tributação do ICMS'
        >
          <MenuItem value={null}>Nenhum</MenuItem>
          {Object.values(icmsTaxGroupOptions).map(renderSelect)}
        </TextField>
      )}
    </>
  )
}

ICMSRegimeForm.propTypes = {
  form: PropTypes.any,
  values: PropTypes.any
}

ICMSRegimeForm.defaultProps = {
  form: null
}

export default ICMSRegimeForm
