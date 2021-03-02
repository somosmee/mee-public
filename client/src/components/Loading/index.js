import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

import useApp from 'src/hooks/useApp'

import useStyles from './styles'

const Loading = ({ className, message, size, drawer }) => {
  const classes = useStyles()

  const { app } = useApp()

  return (
    <div
      className={classNames(classes.root, className, {
        [classes.rootOpen]: app.openDrawer && drawer,
        [classes.rootClose]: !app.openDrawer && drawer
      })}
    >
      <Box display='flex' flexDirection='column' alignItems='center'>
        <CircularProgress className={classes.progress} size={size} />
        {message && <Typography>{message}</Typography>}
      </Box>
    </div>
  )
}

Loading.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  size: PropTypes.number,
  drawer: PropTypes.bool
}

Loading.defaultProps = {
  message: '',
  size: 80,
  drawer: true
}

export default Loading
