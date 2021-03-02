import React, { forwardRef } from 'react'
import { NavLink as RouterLink } from 'react-router-dom'

import { useTheme } from '@material-ui/core/styles'

import useStyles from './styles'

const NavLink = forwardRef((props, ref) => {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <RouterLink
      className={classes.root}
      ref={ref}
      {...props}
      activeStyle={{ color: theme.palette.secondary.main }}
    />
  )
})

NavLink.displayName = 'NavLink'

export default NavLink
