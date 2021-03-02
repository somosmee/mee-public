import React, { useState } from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableFooter from '@material-ui/core/TableFooter'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'

import ListHead from 'src/components/List/OldList/ListHead'
import ListItem from 'src/components/List/OldList/ListItem'
import propTypes from 'src/components/List/OldList/propTypes'
import TablePaginationActions from 'src/components/TablePaginationActions'

import useStyles from './styles'

const List = ({
  id,
  labels,
  items,
  className,
  filtered,
  avatar,
  open,
  multiple,
  pagination,
  renderActions,
  renderCollapse,
  getItemDisabled,
  onCollapseToggle,
  onClick,
  onPageChange,
  onRowsPerPageChange
}) => {
  const classes = useStyles()

  const [selected, setSelected] = useState([])

  const hasItems = !!items.length
  const hasPagination = pagination && onPageChange && onRowsPerPageChange

  const handlePageChange = (e, page) => {
    onPageChange(page)
  }

  const hadleRowsPerPageChange = (e) => {
    const offset = e.target.value
    onRowsPerPageChange(offset)
  }

  const handleItemSelect = (index) => {
    if (!multiple) return

    setSelected((prevSelected) => {
      const currentIndex = prevSelected.indexOf(index)

      if (currentIndex < 0) return { selected: [...prevSelected, index] }

      return { selected: prevSelected.filter((currentIndex) => currentIndex !== index) }
    })
  }

  const handleChange = () => {
    setSelected([])
  }

  const handleSelectAll = () => {
    setSelected(items.map((_, index) => index))
  }

  const handleDeselectAll = () => {
    setSelected([])
  }

  const renderItem = (item, index) => {
    const key = item._id || item.gtin || item.name + index
    const disabled = getItemDisabled(item)

    return (
      <ListItem
        key={key}
        index={index}
        labels={labels}
        item={item}
        avatar={avatar}
        multiple={multiple}
        selected={selected.indexOf(index) !== -1}
        open={open}
        disabled={disabled}
        renderActions={() => renderActions?.(item, index, disabled)}
        renderCollapse={() => renderCollapse?.(item, index, disabled, open)}
        onClick={onClick(item, index)}
        onSelect={() => handleItemSelect?.(index)}
        onCollapseToggle={onCollapseToggle}
      />
    )
  }

  return (
    hasItems && (
      <Table id={id} className={classNames(classes.root, className)}>
        <ListHead
          collapse={!!renderCollapse()}
          labels={labels}
          multiple={multiple}
          items={items.length}
          selected={selected.length}
          hasActions={!!renderActions}
          onSelectChange={handleChange}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
        />
        <TableBody>{items.map(renderItem)}</TableBody>
        {hasPagination && !filtered && (
          <TableFooter>
            <TableRow>
              <TablePagination
                className={classes.pagination}
                classes={{ spacer: classes.spacer }}
                count={pagination.totalItems}
                rowsPerPage={pagination.offset}
                page={pagination.page}
                onChangePage={handlePageChange}
                labelRowsPerPage='Itens por página:'
                onChangeRowsPerPage={hadleRowsPerPageChange}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        )}
      </Table>
    )
  )
}

List.propTypes = {
  id: PropTypes.string,
  labels: PropTypes.arrayOf(
    PropTypes.oneOfType([propTypes.label, PropTypes.arrayOf(propTypes.label)])
  ).isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  className: PropTypes.string,
  filtered: PropTypes.bool,
  pagination: PropTypes.object,
  getItemDisabled: PropTypes.func,
  onClick: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func
}

List.defaultProps = {
  labels: [],
  items: [],
  filtered: false,
  getItemDisabled: () => false,
  onClick: () => false,
  onPageChange: () => {},
  onRowsPerPageChange: () => {}
}

export default List
