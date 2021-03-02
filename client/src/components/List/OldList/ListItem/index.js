import React from 'react'

import classNames from 'classnames'
import get from 'lodash.get'
import moment from 'moment'
import PropTypes from 'prop-types'

import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import ListItemMaterial from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { useTheme } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'

import propTypes from 'src/components/List/OldList/propTypes'

import { LabelTypes } from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import useStyles from './styles'

const ListItem = ({
  index,
  labels,
  item,
  avatar,
  multiple,
  selected,
  open,
  disabled,
  renderActions,
  renderCollapse,
  onClick,
  onSelect,
  onCollapseToggle
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md'))

  const handleCollapseToggle = (event) => {
    event.stopPropagation()
    onCollapseToggle()
  }

  // eslint-disable-next-line
  const renderCell = (rowIndex) => (label, index) => {
    let key = null
    let primaryText = ''
    let secondaryText = ''
    let firstChar = '-'
    if (Array.isArray(label)) {
      const [first, second] = label
      if (first) {
        const [firstKey, secondKey] = first.key
        key = firstKey + secondKey

        if (first.render) {
          if (firstKey && secondKey) {
            secondaryText = first.render(get(item, firstKey), get(item, secondKey))
          } else {
            secondaryText = first.render(get(item, firstKey))
          }
        } else if (first.type === LabelTypes.currency) {
          secondaryText = numeral(get(item, firstKey)).format('$ 0.00')
        } else if (first.type === LabelTypes.date) {
          secondaryText = get(item, firstKey) && get(item, firstKey).toDate()
        } else {
          secondaryText = get(item, firstKey)
        }
      }

      if (second) {
        const [firstKey, secondKey] = second.key
        key = firstKey + secondKey

        if (second.render) {
          if (firstKey && secondKey) {
            primaryText = second.render(get(item, firstKey), get(item, secondKey))
          } else {
            primaryText = first.render(get(item, firstKey))
          }
        } else if (second.type === LabelTypes.currency) {
          primaryText = numeral(get(item, firstKey)).format('$ 0.00')
        } else if (second.type === LabelTypes.date) {
          primaryText = get(item, firstKey) && get(item, firstKey).toDate()
        } else {
          primaryText = get(item, firstKey)
        }

        if (get(item, firstKey)) {
          firstChar = get(item, firstKey)[0]
        }
      }
    } else {
      const [firstKey, secondKey] = label.key
      key = firstKey + secondKey

      if (label.render) {
        if (firstKey && secondKey) {
          primaryText = label.render(get(item, firstKey), get(item, secondKey))
        } else {
          primaryText = label.render(get(item, firstKey))
        }
      } else if (label.type === LabelTypes.currency) {
        primaryText = numeral(get(item, firstKey)).format('$ 0.00')
      } else if (label.type === LabelTypes.date) {
        if (label.format) {
          primaryText = get(item, firstKey) && moment(get(item, firstKey)).format(label.format)
        } else {
          primaryText = get(item, firstKey) && get(item, firstKey).toDate()
        }
      } else {
        primaryText = get(item, firstKey)
      }

      if (index === 0 && get(item, firstKey)) {
        firstChar = get(item, firstKey)[0]
      }
    }

    const align = 'left'

    return (
      <TableCell key={key + rowIndex} className={classes.cell} align={align} onClick={onSelect}>
        <ListItemMaterial
          classes={{ root: classes.listItem }}
          alignItems='center'
          dense
          disabled={disabled}
        >
          {index === 0 && (
            <>
              {multiple && (
                <ListItemIcon
                  className={classNames(classes.listItemIcon, { [classes.show]: selected })}
                >
                  <Checkbox checked={selected} tabIndex={-1} disableRipple />
                </ListItemIcon>
              )}
              {avatar && (
                <ListItemAvatar
                  className={classNames(classes.listItemAvatar, { [classes.hide]: selected })}
                >
                  <Avatar className={classes.avatar}>{firstChar.toUpperCase() || '-'}</Avatar>
                </ListItemAvatar>
              )}
            </>
          )}
          <ListItemText
            classes={{
              primary: classes.listItemTextPrimary,
              secondary: classes.listItemTextSecondary
            }}
            primary={
              <Box fontSize={14} textAlign={align}>
                {primaryText}
              </Box>
            }
            secondary={secondaryText}
          />
        </ListItemMaterial>
      </TableCell>
    )
  }

  return (
    <>
      <TableRow
        className={classNames(classes.row, {
          [classes.listItemAvatarHover]: multiple,
          [classes.listItemIconHover]: multiple
        })}
        hover
        selected={selected}
        onClick={onClick}
      >
        {upMedium && !!renderCollapse() && (
          <TableCell>
            <IconButton aria-label='expand row' size='small' onClick={handleCollapseToggle}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
        )}
        {labels.map(renderCell(index))}
        {renderActions() && (
          <TableCell className={classes.cell} align='right'>
            <div className={classes.actions}>{renderActions()}</div>
          </TableCell>
        )}
      </TableRow>
      {upMedium && renderCollapse()}
    </>
  )
}

ListItem.propTypes = {
  index: PropTypes.number,
  labels: PropTypes.arrayOf(
    PropTypes.oneOfType([propTypes.label, PropTypes.arrayOf(propTypes.label)])
  ).isRequired,
  item: PropTypes.object.isRequired,
  avatar: PropTypes.bool,
  multiple: PropTypes.bool,
  selected: PropTypes.bool,
  open: PropTypes.bool,
  disabled: PropTypes.bool,
  renderActions: PropTypes.func,
  renderCollapse: PropTypes.func,
  onClick: PropTypes.func,
  onSelect: PropTypes.func,
  onCollapseToggle: PropTypes.func
}

ListItem.defaultProps = {
  avatar: false,
  multiple: false,
  selected: false,
  open: false,
  disabled: false,
  renderActions: () => false,
  // renderCollapse: () => {},
  onClick: () => false,
  onCollapseToggle: () => {}
}

export default ListItem
