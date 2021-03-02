import React from 'react'
import NumberFormat from 'react-number-format'

import PropTypes from 'prop-types'

const IntegerFormat = ({ name, inputRef, onChange, decimalScale, ...other }) => {
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
      inputMode='number'
      decimalScale={0}
      fixedDecimalScale
      decimalSeparator=','
      thousandSeparator='.'
      isNumericString
    />
  )
}

IntegerFormat.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

IntegerFormat.defaultProps = {
  decimalScale: 2
}

export default IntegerFormat
