import React from 'react'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'

import useStyles from './styles'

const Link = ({ children, ...props }) => {
  const classes = useStyles()

  return (
    <Button className={classes.root} disableElevation disableRipple disableFocusRipple color='primary' {...props}>
      {children}
    </Button>
  )
}

Link.propTypes = { children: PropTypes.node }

export default Link
