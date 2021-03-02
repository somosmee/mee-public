import React, { memo, useState } from 'react'

import PropTypes from 'prop-types'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Collapse from '@material-ui/core/Collapse'
import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import OrderActions from 'src/components/Order/OrderActions'
import OrderContent from 'src/components/Order/OrderContent'
import OrderHeader from 'src/components/Order/OrderHeader'

import useMe from 'src/hooks/useMe'

import { Payments, IfoodBenefitTargets } from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import useStyles from './styles'

const Order = ({
  index,
  order,
  onSelect,
  onEdit,
  onFees,
  onCancel,
  onInvoice,
  onDelivery,
  onDiscount,
  onAddPayment,
  onAddItems,
  onCloseOrder,
  onEditTitle,
  onAddCustomer,
  onTransferItems,
  onProductionRequests
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const upSmall = useMediaQuery(theme.breakpoints.up('sm'))
  const upMedium = useMediaQuery(theme.breakpoints.up('md'))

  const { me } = useMe()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const hasBenefits = order.ifood && order.ifood.benefits && !!order.ifood.benefits.length

  const renderItemModifier = (item) => (
    <Grid className={classes.subitems} key={item.gtin} container>
      <Grid item xs>
        <Typography className={classes.name} color='textSecondary'>
          {item.name}
        </Typography>
      </Grid>
      <Grid item xs>
        <Typography className={classes.name} color='textSecondary'>
          {item.note}
        </Typography>
      </Grid>
      <Grid item>
        <Typography>
          {item.quantity}x {numeral(item.price).format('$ 0.00')}
        </Typography>
      </Grid>
    </Grid>
  )

  const renderPaymentItem = (payment, index) => (
    <Grid key={index} container spacing={1}>
      <Grid item xs>
        <Typography className={classes.name} color='textSecondary'>
          {Payments[payment.method].label}
        </Typography>
      </Grid>
      <Grid item>
        <Typography>{numeral(payment.value).format('$ 0.00')}</Typography>
      </Grid>
    </Grid>
  )

  const renderFeeItem = (fee, index) => (
    <Grid key={index} container spacing={1}>
      <Grid item xs>
        <Typography className={classes.name} color='textSecondary'>
          {fee.name}
        </Typography>
      </Grid>
      <Grid item>
        <Typography>{numeral(fee.value).format('$ 0.00')}</Typography>
      </Grid>
    </Grid>
  )

  const renderItem = (item) => (
    <div key={item.gtin}>
      <Grid container spacing={1}>
        <Grid item xs>
          <Typography className={classes.name} color='textSecondary'>
            {item.name}
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography className={classes.name} color='textSecondary'>
            {item.note}
          </Typography>
        </Grid>
        <Grid item>
          <Typography>
            {item.quantity}x {numeral(item.price).format(upSmall ? '$ 0.00' : '0.00')} ={' '}
            {numeral(item.subtotal).format(upSmall ? '$ 0.00' : '0.00')}
          </Typography>
        </Grid>
      </Grid>
      {item.modifiers?.map(renderItemModifier)}
    </div>
  )

  const renderBenefitItem = (item, index) => (
    <div key={index}>
      <Grid container spacing={1}>
        <Grid item xs>
          <Typography className={classes.name} color='textSecondary'>
            {IfoodBenefitTargets[item.target].label}
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography className={classes.name} color='textSecondary'>
            {parseInt(item.sponsorshipValues.IFOOD) !== 0 ? 'IFOOD' : me?.name || 'RESTAURANTE'}
          </Typography>
        </Grid>
        <Grid item>
          <Typography>{numeral(item.value).format('$ 0.00')}</Typography>
        </Grid>
      </Grid>
    </div>
  )

  return (
    <Card id='order' className={classes.root} elevation={2}>
      {upMedium && (
        <OrderHeader
          order={order}
          onEdit={onEdit}
          onFees={onFees}
          onDelivery={onDelivery}
          onCancel={onCancel}
          onInvoice={onInvoice}
          onDiscount={onDiscount}
          onAddItems={onAddItems}
          onAddCustomer={onAddCustomer}
          onEditTitle={onEditTitle}
          onTransferItems={onTransferItems}
          onProductionRequests={onProductionRequests}
        />
      )}
      <OrderContent order={order} onSelect={onSelect} />
      <OrderActions
        index={index}
        expanded={isExpanded}
        order={order}
        onExpanseChange={handleToggleExpand}
        onEdit={onEdit}
        onAddPayment={onAddPayment}
        onAddItems={onAddItems}
        onEditTitle={onEditTitle}
        onCloseOrder={onCloseOrder}
      />
      {upMedium && (
        <Collapse in={isExpanded} timeout='auto' unmountOnExit>
          <CardContent id='items' className={classes.content}>
            {!!order.fees?.length && (
              <>
                <Typography className={classes.name} color='textPrimary'>
                  Taxas
                </Typography>
                {order.fees.map(renderFeeItem)}
              </>
            )}
            {!!order.payments?.length && (
              <>
                <Typography className={classes.name} color='textPrimary'>
                  Pagamentos
                </Typography>
                {order.payments.map(renderPaymentItem)}
              </>
            )}
            <Typography className={classes.name} color='textPrimary'>
              Items
            </Typography>
            {order.items.map(renderItem)}
            {hasBenefits && (
              <>
                <Typography className={classes.name} color='textPrimary'>
                  Descontos
                </Typography>
                {order.ifood.benefits.map(renderBenefitItem)}
              </>
            )}
          </CardContent>
        </Collapse>
      )}
    </Card>
  )
}

Order.propTypes = {
  index: PropTypes.number,
  order: PropTypes.object,
  onSelect: PropTypes.func,
  onEdit: PropTypes.func,
  onFees: PropTypes.func,
  onDelivery: PropTypes.func,
  onCancel: PropTypes.func,
  onInvoice: PropTypes.func,
  onDiscount: PropTypes.func,
  onAddPayment: PropTypes.func,
  onAddItems: PropTypes.func,
  onCloseOrder: PropTypes.func,
  onAddCustomer: PropTypes.func,
  onEditTitle: PropTypes.func,
  onTransferItems: PropTypes.func,
  onProductionRequests: PropTypes.func
}

Order.defaultProps = {
  onSelect: () => {},
  onEdit: () => {},
  onFees: () => {},
  onDelivery: () => {},
  onCancel: () => {},
  onInvoice: () => {},
  onDiscount: () => {},
  onAddPayment: () => {},
  onAddItems: () => {},
  onCloseOrder: () => {},
  onAddCustomer: () => {},
  onEditTitle: () => {},
  onTransferItems: () => {},
  onProductionRequests: () => {}
}

export default memo(Order)
