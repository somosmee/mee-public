import React from 'react'

import moment from 'moment'
import PropTypes from 'prop-types'

import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import OrderContentCustomer from 'src/components/Order/OrderContentCustomer'
import OrderContentFirstRow from 'src/components/Order/OrderContentFirstRow'
import OrderContentTotals from 'src/components/Order/OrderContentTotals'

import useStyles from './styles'

const renderTitle = (order) => {
  let title = ''
  if (order.title) {
    title = (
      <>
        <b>{order.title}</b> - {moment(order.createdAt).format('LT')}
      </>
    )
  } else {
    title = moment(order.createdAt).format('LT')
  }

  return title
}

const OrderContent = ({ order, onSelect }) => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md'))

  if (!upMedium) {
    const title = renderTitle(order)
    return (
      <CardActionArea
        onClick={() => {
          onSelect(order)
        }}
      >
        <CardHeader subheader={title} />
        <CardContent id='content' className={classes.root}>
          <Grid
            id='content-container'
            container
            direction='column'
            justify='flex-start'
            spacing={1}
          >
            <OrderContentFirstRow order={order} />
            <OrderContentCustomer order={order} />
            <Grid id='divider-line-2' item container xs={12} className={classes.divider}>
              <Divider variant='middle' />
            </Grid>
            <OrderContentTotals order={order} />
          </Grid>
        </CardContent>
      </CardActionArea>
    )
  } else {
    return (
      <CardContent id='content' className={classes.root}>
        <Grid id='content-container' container direction='column' justify='flex-start' spacing={1}>
          <OrderContentFirstRow order={order} />
          <OrderContentCustomer order={order} />
          <Grid id='divider-line-2' item container xs={12} className={classes.divider}>
            <Divider variant='middle' />
          </Grid>
          <OrderContentTotals order={order} />
        </Grid>
      </CardContent>
    )
  }
}

OrderContent.propTypes = {
  order: PropTypes.object,
  onSelect: PropTypes.func
}

OrderContent.defaultProps = {
  order: {},
  onSelect: () => {}
}

export default OrderContent
