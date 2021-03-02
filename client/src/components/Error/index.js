import React from 'react'

import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'

import Emoji from 'src/components/Emoji'

import useStyles from './styles'

const Error = ({ message }) => {
  const classes = useStyles()

  return (
    <Typography className={classes.root} align='center' variant='h3'>
      {message}&nbsp;
      <Emoji symbol='😕' label='rosto confuso' />
    </Typography>
  )
}

Error.propTypes = {
  message: PropTypes.string
}

Error.defaultProps = {
  message: ''
}

export default Error
