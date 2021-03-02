import React from 'react'

import PropTypes from 'prop-types'

import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import SelectMaterial from '@material-ui/core/Select'

const Select = ({
  input: { name, onChange, value, ...restInput },
  children,
  helperText,
  meta: { error, invalid, touched },
  label,
  required,
  fullWidth,
  ...rest
}) => (
  <FormControl error={touched && invalid} required={required} fullWidth={fullWidth}>
    <InputLabel>{label}</InputLabel>
    <SelectMaterial {...rest} name={name} inputProps={restInput} onChange={onChange} value={value}>
      {children}
    </SelectMaterial>
    <FormHelperText>{touched && invalid ? error : helperText}</FormHelperText>
  </FormControl>
)

Select.propTypes = {
  input: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  meta: PropTypes.object,
  label: PropTypes.string,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  helperText: PropTypes.string
}

export default Select
