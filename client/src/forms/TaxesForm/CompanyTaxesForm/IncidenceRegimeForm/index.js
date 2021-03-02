import React from 'react'
import { useField } from 'react-final-form-hooks'

import PropTypes from 'prop-types'

import MenuItem from '@material-ui/core/MenuItem'

import TextField from 'src/components/TextField'

import { IncidenceRegimes } from 'src/utils/enums'

const IncidenceRegimeForm = ({ form, values }) => {
  const incidenceRegime = useField('incidenceRegime', form)

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
        {...incidenceRegime}
        label='Regime de Incidência'
        fullWidth
        helperText='Selecione o regime de Incidência'
      >
        <MenuItem value={null}>Nenhum</MenuItem>
        {Object.values(IncidenceRegimes).map(renderSelect)}
      </TextField>
    </>
  )
}

IncidenceRegimeForm.propTypes = {
  form: PropTypes.any,
  values: PropTypes.any
}

IncidenceRegimeForm.defaultProps = {
  form: null
}

export default IncidenceRegimeForm
