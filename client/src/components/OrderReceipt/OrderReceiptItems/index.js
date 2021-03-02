import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import { Measurements } from 'src/utils/enums'
import numeral from 'src/utils/numeral'

import useStyles from './styles'

const OrderReceiptItems = ({ items }) => {
  const classes = useStyles()

  const renderModifier = ({ name, quantity, measurement, price }, index) => (
    <Fragment key={index}>
      <Grid item xs={8}>
        <Typography className={classes.nameModifier}>&bull; {name}</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography className={classes.quantity} align='right'>
          {quantity}x {Measurements.unit.symbol}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography className={classes.price} align='right'>
          {numeral(price).format('0.00')}
        </Typography>
      </Grid>
    </Fragment>
  )

  const renderItem = ({
    gtin,
    name,
    description,
    note,
    quantity,
    measurement,
    price,
    subtotal,
    modifiers
  }) => {
    const hasModifiers = !!modifiers?.length

    return (
      <Fragment key={gtin}>
        <Grid key={gtin} container item spacing={1}>
          <Grid item xs={6}>
            <Typography className={classes.name}>{name}</Typography>
            {description && <Typography className={classes.description}>{description}</Typography>}
            {note && <Typography className={classes.note}>{note}</Typography>}
          </Grid>
          <Grid item xs={2}>
            <Typography className={classes.quantity} align='right'>
              {quantity}x {Measurements[measurement].symbol}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography className={classes.price} align='right'>
              {numeral(price).format('0.00')}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography className={classes.price} align='right'>
              {numeral(subtotal).format('0.00')}
            </Typography>
          </Grid>
        </Grid>
        {hasModifiers && (
          <Grid container item spacing={1}>
            {modifiers.map(renderModifier)}
          </Grid>
        )}
      </Fragment>
    )
  }

  return (
    <Grid className={classes.root} container item>
      {items.map(renderItem)}
    </Grid>
  )
}

OrderReceiptItems.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      gtin: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string,
      note: PropTypes.string,
      quantity: PropTypes.number,
      measurement: PropTypes.string,
      price: PropTypes.number
    }).isRequired
  )
}

OrderReceiptItems.defaultProps = {
  items: []
}

export default OrderReceiptItems
