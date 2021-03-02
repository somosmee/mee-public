import React from 'react'

import PropTypes from 'prop-types'

import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import RadioGroup from '@material-ui/core/RadioGroup'

const RadioFinalForm = ({ input: { name, onChange, value }, meta: { error, invalid, touched }, helperText, children }) => {
  return (
    <FormControl component='fieldset' error={touched && invalid}>
      <FormLabel component='legend'>Gender</FormLabel>
      <RadioGroup aria-label='gender' name='gender1' value={value} onChange={onChange}>
        {children}
      </RadioGroup>
    </FormControl>
  )
}

RadioFinalForm.propTypes = {
  input: PropTypes.any,
  meta: PropTypes.any,
  helperText: PropTypes.string,
  children: PropTypes.any
}

export default RadioFinalForm
