import React from 'react'

import moment from 'moment'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import { Origins } from 'src/utils/enums'

import useStyles from './styles'

const OrderReceiptHeader = ({ order }) => {
  const classes = useStyles()

  return (
    <Grid className={classes.root} container item>
      <Grid item xs={3}>
        <Typography className={classes.shortId}>{order.shortID}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography className={classes.origin}>{Origins[order.origin].label}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography className={classes.createdAt} align='right'>
          {moment(order.createdAt).format('DD/MM/YY LTS')}
        </Typography>
      </Grid>
    </Grid>
  )
}

OrderReceiptHeader.propTypes = {
  order: PropTypes.shape({
    shortID: PropTypes.string,
    origin: PropTypes.string,
    createdAt: PropTypes.string
  })
}

OrderReceiptHeader.defaultProps = {}

export default OrderReceiptHeader
