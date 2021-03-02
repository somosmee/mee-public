import React from 'react'
import MaskedInput from 'react-text-mask'

import PropTypes from 'prop-types'

import { numberMask } from 'src/utils/mask'

const InputMasked = ({ inputRef, ...other }) => (
  <MaskedInput
    {...other}
    ref={(ref) => inputRef(ref ? ref.inputElement : null)}
    placeholderChar={'\u2000'}
    mask={numberMask}
  />
)

InputMasked.propTypes = {
  inputRef: PropTypes.object
}

InputMasked.defaultProps = {}

export default InputMasked
