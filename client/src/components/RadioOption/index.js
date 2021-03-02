import React from 'react'

import PropTypes from 'prop-types'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'

const RadioOption = (props) => {
  return (<FormControlLabel {...props} control={<Radio />} />)
}

RadioOption.propTypes = {
  input: PropTypes.any,
  meta: PropTypes.any,
  helperText: PropTypes.string,
  options: PropTypes.array
}

export default RadioOption
