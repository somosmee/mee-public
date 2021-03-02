import React from 'react'

import PropTypes from 'prop-types'

import useStyles from './styles'

const StepContent = ({ children }) => {
  const classes = useStyles()

  return <div className={classes.root}>{children}</div>
}

StepContent.propTypes = {
  children: PropTypes.any
}

StepContent.defaultProps = {}

export default StepContent
