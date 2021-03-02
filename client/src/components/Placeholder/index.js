import React, { cloneElement } from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Emoji from 'src/components/Emoji'

import useStyles from './styles'

const Placeholder = ({ className, icon, message, subtitle, actions, symbol }) => {
  const classes = useStyles()

  const renderAction = (action, index) => (
    <Grid key={index} item xs={12} sm={6}>
      <Button {...action}>{action.label}</Button>
    </Grid>
  )

  return (
    <div className={classNames(classes.root, className)}>
      {icon && cloneElement(icon, { className: classes.icon })}
      {message && (
        <Typography
          className={classes.message}
          data-cy='placeholder-title'
          variant='h5'
          paragraph={!!actions}
        >
          {message} {symbol && <Emoji symbol={symbol} label='mão acenando' />}
        </Typography>
      )}
      {subtitle && (
        <Typography className={classes.subtitle} data-cy='placeholder-subtitle' variant='subtitle'>
          {subtitle}
        </Typography>
      )}
      <Grid container spacing={3} direction='column' justify='center' alignItems='center'>
        {actions?.map(renderAction)}
      </Grid>
    </div>
  )
}

Placeholder.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node,
  message: PropTypes.string,
  subtitle: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.object),
  symbol: PropTypes.string
}

Placeholder.defaultProps = {}

export default Placeholder
