import React from 'react'
import NumberFormat from 'react-number-format'

import PropTypes from 'prop-types'

const PercentageFormat = ({ name, inputRef, onChange, ...other }) => {
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: name,
            value: values.value
          }
        })
      }}
      isAllowed={(values) => {
        if (!values.floatValue) return true
        return values.floatValue <= 100
      }}
      inputMode='decimal'
      decimalScale={2}
      fixedDecimalScale
      decimalSeparator=','
      isNumericString
      suffix=' %'
    />
  )
}

PercentageFormat.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default PercentageFormat
