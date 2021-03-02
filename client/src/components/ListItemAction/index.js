import React, { PureComponent } from 'react'

import PropTypes from 'prop-types'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import styled from './styles'

class ListItemAction extends PureComponent {
  handleClick = (e) => {
    e.stopPropagation()
    const { item, onClick } = this.props
    onClick && onClick(item, e)
  }

  render() {
    const { classes, title, children, disabled } = this.props

    return (
      <Tooltip title={title}>
        <div>
          <IconButton
            className={classes.button}
            aria-label={title}
            disableRipple
            disabled={disabled}
            onClick={this.handleClick}
          >
            {children}
          </IconButton>
        </div>
      </Tooltip>
    )
  }
}

ListItemAction.propTypes = {
  title: PropTypes.string.isRequired
}

ListItemAction.defaultProps = {
  title: ''
}

export default styled(ListItemAction)
