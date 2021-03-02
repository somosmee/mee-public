import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'

import Emoji from 'src/components/Emoji'

import useStyles from './styles'

const NotFound = ({ className }) => {
  const classes = useStyles()

  return (
    <div className={classNames(classes.root, className)}>
      <Typography className={classes.title} variant='h3' paragraph>
        Nada Aqui! <Emoji symbol='😕' label='rosto confuso' />
      </Typography>
    </div>
  )
}

NotFound.propTypes = {
  className: PropTypes.string
}

NotFound.defaultProps = {}

export default NotFound
