import React from 'react'

import PropTypes from 'prop-types'

import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import AddressDisplay from 'src/components/AddressDisplay'

import useStyles from './styles'

const OrderContentCustomer = ({ order }) => {
  const classes = useStyles()

  const mapCustomer = (order) => {
    if (order.customer) {
      return {
        name: `${order.customer?.firstName} ${order.customer?.lastName}`,
        mobile: order.customer?.mobile
      }
    } else if (order?.ifood?.customer) {
      const customer = order.ifood.customer
      return {
        name: customer?.name,
        mobile: customer?.phone
      }
    }

    return null
  }

  const customer = mapCustomer(order)

  if (!customer && !order?.delivery?.address) return null

  return (
    <>
      <Grid id='divider-line-1' item container xs={12} className={classes.divider}>
        <Divider variant='middle' />
      </Grid>
      <Grid id='second-line' item container spacing={2}>
        <Grid xs={12} sm={6} item>
          <Typography variant='subtitle2' display='block' gutterBottom>
            Cliente
          </Typography>
          <Grid item container direction='row'>
            <Typography variant='body2' color='textPrimary' gutterBottom>
              {customer?.name}
            </Typography>
            <Typography variant='body2' color='textSecondary' gutterBottom>
              &nbsp;{`- ${customer?.mobile}`}
            </Typography>
          </Grid>
        </Grid>
        {order?.delivery?.address && (
          <Grid xs={12} sm={6} item>
            <Typography variant='subtitle2' display='block' gutterBottom>
              Endereço
            </Typography>
            <Grid item>
              <AddressDisplay primaryVariant='body2' dense address={order?.delivery?.address} />
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  )
}

OrderContentCustomer.propTypes = {
  order: PropTypes.object
}

OrderContentCustomer.defaultProps = {
  order: {}
}

export default OrderContentCustomer
