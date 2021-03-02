import React from 'react'

import PropTypes from 'prop-types'

import useStyles from './styles'

const Step = ({ children }) => {
  const classes = useStyles()

  return <div className={classes.root}>{children}</div>
}

Step.propTypes = {
  children: PropTypes.any
}

Step.defaultProps = {}

export default Step
