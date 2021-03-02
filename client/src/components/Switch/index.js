import React from 'react'

import PropTypes from 'prop-types'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

const Swtich = ({ input, label, ...rest }) => (
  <FormControlLabel
    {...rest}
    {...input}
    checked={!!input.value}
    control={<Switch color='primary' />}
    label={label}
  />
)

Swtich.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string
}

export default Swtich
