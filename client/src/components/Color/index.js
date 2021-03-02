import React from 'react'

import clsx from 'clsx'
import PropTypes from 'prop-types'

import Badge from '@material-ui/core/Badge'

import useStyles from './styles'

const Color = ({ color, size, showBadge, onClick }) => {
  const classes = useStyles()

  const style = { backgroundColor: color }

  if (onClick) style.cursor = 'pointer'

  if (size === 'extraSmall') {
    style.width = 10
    style.height = 10
  } else if (size === 'small') {
    style.width = 20
    style.height = 20
  } else if (size === 'medium') {
    style.width = 30
    style.height = 30
  } else if (size === 'large') {
    style.width = 40
    style.height = 40
  }

  const handleClick = () => {
    onClick && onClick(color)
  }

  const circle = (
    // eslint-disable-next-line
    <div className={clsx(classes.shape, classes.shapeCircle)} style={style} onClick={handleClick} />
  )

  if (showBadge) {
    return (
      <Badge color='secondary' overlap='circle' badgeContent='' variant='dot'>
        {circle}
      </Badge>
    )
  }

  return circle
}

Color.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func
}

Color.defaultProps = {
  size: 'small'
}

export default Color
