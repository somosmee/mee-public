import React from 'react'

import PropTypes from 'prop-types'

import IconButton from '@material-ui/core/IconButton'
import ListItemText from '@material-ui/core/ListItemText'
import { withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import Remove from '@material-ui/icons/DeleteOutlined'

import { Measurements } from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import styles from './styles'

const OrderWidgetItem = ({
  classes,
  index,
  item: { gtin, name, quantity, price, measurement },
  onDeleteItem
}) => {
  const handleDelete = () => {
    onDeleteItem(index)
  }

  return (
    <TableRow className={classes.row} hover>
      <TableCell className={classes.cell}>
        <ListItemText
          className={classes.listItemText}
          disableTypography
          primary={<Typography color='textSecondary'>{gtin}</Typography>}
          secondary={<Typography>{name}</Typography>}
        />
      </TableCell>
      <TableCell className={classes.cell} align='right'>
        <Typography noWrap>{numeral(price).format('$ 0.00')}</Typography>
      </TableCell>
      <TableCell
        className={classes.cell}
        align='right'
      >{`${quantity} ${Measurements[measurement].symbol}`}</TableCell>
      <TableCell className={classes.cell} align='right'>
        <Typography noWrap>{numeral(quantity * price).format('$ 0.00')}</Typography>
      </TableCell>
      <TableCell className={classes.cell} align='right'>
        <div className={classes.actions} data-cy='actions'>
          <Tooltip title='Remover'>
            <IconButton
              className={classes.button}
              data-cy='order-widget-item-remove'
              aria-label='Remover Item'
              disableRipple
              onClick={handleDelete}
            >
              <Remove fontSize='small' />
            </IconButton>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  )
}

OrderWidgetItem.propTypes = {
  item: PropTypes.object.isRequired
}

OrderWidgetItem.defaultProps = {
  item: {
    product: '1111111111111',
    gtin: '1111111111111',
    name: 'NOME DO PRODUTO',
    description: 'DESCRIÇÃO DO PRODUTO',
    price: 0,
    imageUrl:
      'http://maxxiovos.com.br/wp-content/uploads/2015/10/alimentos-que-emagrecem-maxxiovos-alface.png',
    measurement: 'unit',
    quantity: 1
  }
}

export default withStyles(styles)(OrderWidgetItem)
