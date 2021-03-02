import React, { memo } from 'react'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'

import Order from 'src/components/Order'

import useStyles from './styles'

const OrderList = ({
  id,
  orders,
  onSelect,
  onEdit,
  onFees,
  onCancel,
  onInvoice,
  onDiscount,
  onAddPayment,
  onAddItems,
  onCloseOrder,
  onAddCustomer,
  onDelivery,
  onEditTitle,
  onTransferItems,
  onProductionRequests
}) => {
  const classes = useStyles()

  const renderOrder = (order, index) => (
    <Grid key={order._id} item container justify='center' xs={12}>
      <Order
        index={index}
        order={order}
        onEdit={onEdit}
        onFees={onFees}
        onCancel={onCancel}
        onInvoice={onInvoice}
        onDelivery={onDelivery}
        onDiscount={onDiscount}
        onAddCustomer={onAddCustomer}
        onSelect={onSelect}
        onEditTitle={onEditTitle}
        onAddPayment={onAddPayment}
        onAddItems={onAddItems}
        onCloseOrder={onCloseOrder}
        onTransferItems={onTransferItems}
        onProductionRequests={onProductionRequests}
      />
    </Grid>
  )

  return (
    <Grid
      id={id}
      className={classes.root}
      container
      justify='center'
      alignItems='center'
      spacing={1}
    >
      {orders.map(renderOrder)}
    </Grid>
  )
}

OrderList.displayName = 'OrderList'

OrderList.propTypes = {
  id: PropTypes.string,
  orders: PropTypes.array,
  onEdit: PropTypes.func,
  onFees: PropTypes.func,
  onCancel: PropTypes.func,
  onEditTitle: PropTypes.func,
  onDiscount: PropTypes.func,
  onSelect: PropTypes.func,
  onDelivery: PropTypes.func,
  onAddPayment: PropTypes.func,
  onAddItems: PropTypes.func,
  onCloseOrder: PropTypes.func,
  onAddCustomer: PropTypes.func,
  onInvoice: PropTypes.func,
  onTransferItems: PropTypes.func,
  onProductionRequests: PropTypes.func
}

OrderList.defaultProps = {
  id: 'orders',
  orders: [],
  onFees: () => {},
  onSelect: () => {},
  onDelivery: () => {},
  onEdit: () => {},
  onCancel: () => {},
  onInvoice: () => {},
  onDiscount: () => {},
  onAddPayment: () => {},
  onAddItems: () => {},
  onCloseOrder: () => {},
  onAddCustomer: () => {},
  onTransferItems: () => {},
  onProductionRequests: () => {}
}

export default memo(OrderList)
