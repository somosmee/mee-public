import React from 'react'

import classNames from 'classnames'

import Typography from '@material-ui/core/Typography'

import styled from './styles'

const Title = ({
  classes,
  className,
  children,
  ...props
}) => (
  <Typography
    className={classNames(classes.root, className)}
    variant='h4'
    {...props}
  >
    {children}
  </Typography>
)

export default styled(Title)
