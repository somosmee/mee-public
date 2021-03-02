import React from 'react'
import MaskedInput from 'react-text-mask'

import PropTypes from 'prop-types'

import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'

const TextMaskCustom = (props) => {
  const { inputRef, mask, placeholder, ...other } = props
  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null)
      }}
      guide={false}
      placeholder={placeholder}
      mask={mask}
      placeholderChar={'\u2000'}
      showMask
    />
  )
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired
}

const TextFieldMasked = (props) => (
  <FormControl {...props} fullWidth={props.fullWidth} error={!!props.meta.error && props.meta.touched}>
    <InputLabel {...props} htmlFor={props.id}>
      {props.label}
    </InputLabel>
    <Input
      id={props.id}
      {...props}
      {...props.input}
      inputProps={{ mask: props.mask, placeholder: props.placeholder }}
      inputComponent={TextMaskCustom}
      aria-describedby='my-helper-text'
    />
    {props.helperText && props.meta.error && (
      <FormHelperText id={`${props.id}-helper-text`}>{props.meta.error}</FormHelperText>
    )}
  </FormControl>
)

export default TextFieldMasked
