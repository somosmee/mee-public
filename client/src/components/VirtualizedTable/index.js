import React from 'react'
import { AutoSizer, Column, Table } from 'react-virtualized'

import clsx from 'clsx'
import PropTypes from 'prop-types'

import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import { withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

import useStyles from './styles'

const StyledTableCellGreen = withStyles((theme) => ({
  head: {
    backgroundColor: green[500],
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell)

const StyledTableCellRed = withStyles((theme) => ({
  head: {
    backgroundColor: red[600],
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell)

const formatData = (column, data) => {
  if (column.percentage) {
    return `${(data * 100).toFixed(2)}%`
  }

  if (column.price) {
    return `R$ ${data.toFixed(2)}`
  }

  if (column.sliceAt) {
    return data.slice(0, column.sliceAt)
  }

  return data
}

const VirtualizedTable = ({
  color,
  columns,
  rowHeight,
  headerHeight,
  onRowClick,
  ...tableProps
}) => {
  const classes = useStyles()

  const getRowClassName = ({ index }) => {
    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null
    })
  }

  const cellRenderer = ({ cellData, columnIndex }) => {
    const column = columns[columnIndex]

    const isNumeric = column.numeric || column.percentage

    return (
      <TableCell
        component='div'
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null
        })}
        variant='body'
        style={{ height: rowHeight }}
        align={(columnIndex != null && isNumeric) || false ? 'right' : 'left'}
      >
        {formatData(column, cellData)}
      </TableCell>
    )
  }

  const headerRenderer = ({ label, columnIndex }) => {
    if (color === 'green') {
      return (
        <StyledTableCellGreen
          component='div'
          className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
          variant='head'
          style={{ height: headerHeight }}
          align={columns[columnIndex].numeric || false ? 'right' : 'left'}
        >
          <span>{label}</span>
        </StyledTableCellGreen>
      )
    } else if (color === 'red') {
      return (
        <StyledTableCellRed
          component='div'
          className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
          variant='head'
          style={{ height: headerHeight }}
          align={columns[columnIndex].numeric || false ? 'right' : 'left'}
        >
          <span>{label}</span>
        </StyledTableCellRed>
      )
    } else {
      return (
        <TableCell
          component='div'
          className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
          variant='head'
          style={{ height: headerHeight }}
          align={columns[columnIndex].numeric || false ? 'right' : 'left'}
        >
          <span>{label}</span>
        </TableCell>
      )
    }
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <Table
          height={height}
          width={width}
          rowHeight={rowHeight}
          gridStyle={{
            direction: 'inherit'
          }}
          headerHeight={headerHeight}
          className={classes.table}
          {...tableProps}
          rowClassName={getRowClassName}
          onRowClick={onRowClick}
        >
          {columns.map(({ dataKey, ...other }, index) => {
            return (
              <Column
                key={dataKey}
                headerRenderer={(headerProps) =>
                  headerRenderer({
                    ...headerProps,
                    columnIndex: index
                  })
                }
                className={classes.flexContainer}
                cellRenderer={cellRenderer}
                dataKey={dataKey}
                {...other}
              />
            )
          })}
        </Table>
      )}
    </AutoSizer>
  )
}

VirtualizedTable.propTypes = {
  color: PropTypes.string,
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      percentage: PropTypes.bool,
      price: PropTypes.bool,
      width: PropTypes.number.isRequired
    })
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number
}

VirtualizedTable.defaultProps = {
  headerHeight: 48,
  rowHeight: 48
}

export default VirtualizedTable
