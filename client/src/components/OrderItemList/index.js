import React from 'react'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'

import OrderItem from 'src/components/OrderItem'

import useStyles from './styles'

const OrderItemList = ({
  items,
  onAddNote,
  onDelete,
  onIncrease,
  onDecrease,
  onQuantityChange
}) => {
  const classes = useStyles()

  const renderItem = (item, index) => (
    <Grid key={item._id || item.product} item xs={12}>
      <OrderItem
        index={index}
        item={item}
        onAddNote={onAddNote}
        onDelete={onDelete}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onQuantityChange={onQuantityChange}
      />
    </Grid>
  )

  return (
    <Grid className={classes.root} container spacing={1}>
      {items.map(renderItem)}
    </Grid>
  )
}

OrderItemList.propTypes = {
  items: PropTypes.array,
  onAddNote: PropTypes.func,
  onDelete: PropTypes.func,
  onIncrease: PropTypes.func,
  onDecrease: PropTypes.func,
  onQuantityChange: PropTypes.func
}

OrderItemList.defaultProps = {
  items: [],
  onAddNote: () => {},
  onDelete: () => {},
  onIncrease: () => {},
  onDecrease: () => {},
  onQuantityChange: () => {}
}

export default OrderItemList
