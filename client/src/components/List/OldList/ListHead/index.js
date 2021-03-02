import React, { useState } from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import CardHeader from '@material-ui/core/CardHeader'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { useTheme } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import ArrowDropDown from '@material-ui/icons/ArrowDropDownOutlined'

import useStyles from './styles'

const ListHead = ({
  labels,
  items,
  collapse,
  hasActions,
  selected,
  multiple,
  onSelectAll,
  onDeselectAll
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md'))

  const [anchor, setAnchor] = useState(null)

  const handleClick = (event) => {
    setAnchor(event.currentTarget)
  }

  const handleClose = () => {
    setAnchor(null)
  }

  const handleSelectAll = (event) => {
    event.stopPropagation()
    handleClose()
    onSelectAll()
  }

  const handleDeselectAll = (event) => {
    event.stopPropagation()
    handleClose()
    onDeselectAll()
  }

  const renderLabel = (label, index) => {
    const hasSelected = !!selected

    if (hasSelected && index === 0) return

    let key = null
    let name = ''

    if (Array.isArray(label)) {
      const [, second] = label
      if (second) {
        key = second.key
        name = second.name
      }
    } else {
      key = label.key
      name = label.name
    }

    const align = 'left'

    return (
      <TableCell
        key={key}
        className={classNames(classes.cell, classes.padding, {
          [classes.transparent]: hasSelected
        })}
        align={align}
      >
        {name}
      </TableCell>
    )
  }

  const hasSelected = !!selected
  const hasAllChecked = selected === items
  const hasSomeChecked = selected < items

  return (
    <TableHead>
      <TableRow className={classes.row}>
        {(multiple || collapse) && upMedium && <TableCell />}
        {multiple && hasSelected && (
          <TableCell className={classes.cell}>
            <CardHeader
              className={classes.cardHeader}
              avatar={
                <>
                  <Checkbox
                    checked={hasAllChecked}
                    onChange={handleDeselectAll}
                    indeterminate={hasSomeChecked}
                    disable={hasSelected}
                    disableRipple
                    inputProps={{ 'aria-label': 'indeterminate checkbox' }}
                  />
                  <IconButton
                    className={classes.button}
                    disableFocusRipple
                    disableRipple
                    onClick={handleClick}
                    aria-controls='simple-menu'
                    aria-haspopup='true'
                  >
                    <ArrowDropDown />
                  </IconButton>
                  <Menu id='simple-menu' anchorEl={anchor} open={!!anchor} onClose={handleClose}>
                    <MenuItem onClick={handleSelectAll}>Todos</MenuItem>
                    <MenuItem onClick={handleDeselectAll}>Nenhum</MenuItem>
                  </Menu>
                </>
              }
              subheader={`${selected} selecionados`}
            />
          </TableCell>
        )}
        {labels.map(renderLabel)}
        {hasActions && (
          <TableCell className={classNames(classes.cell, { [classes.transparent]: hasSelected })} />
        )}
      </TableRow>
    </TableHead>
  )
}

ListHead.propTypes = {
  labels: PropTypes.array,
  items: PropTypes.number,
  onClick: PropTypes.func
}

ListHead.defaultProps = {
  labels: [],
  multiple: false,
  collapse: false,
  onClick: () => {}
}

export default ListHead
