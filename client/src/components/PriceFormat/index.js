import React from 'react'
import NumberFormat from 'react-number-format'

import PropTypes from 'prop-types'

const PriceFormat = ({ name, inputRef, onChange, ...other }) => {
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
      inputMode='decimal'
      decimalScale={2}
      fixedDecimalScale
      decimalSeparator=','
      thousandSeparator='.'
      isNumericString
      prefix='R$ '
    />
  )
}

PriceFormat.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default PriceFormat
