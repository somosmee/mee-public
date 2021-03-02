import React from 'react'

import PropTypes from 'prop-types'

import TextFieldMaterial from '@material-ui/core/TextField'

const TextField = ({
  input: { name, onChange, value, ...restInput },
  meta: { error, invalid, touched },
  helperText,
  ...rest
}) => {
  return (
    <TextFieldMaterial
      {...rest}
      error={touched && invalid}
      name={name}
      helperText={touched && invalid ? error : helperText}
      inputProps={restInput}
      onChange={onChange}
      value={value}
    />
  )
}

TextField.propTypes = {
  input: PropTypes.any,
  meta: PropTypes.any,
  helperText: PropTypes.string
}

export default TextField
