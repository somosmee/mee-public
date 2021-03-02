import React from 'react'

import PropTypes from 'prop-types'

import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import Grid from '@material-ui/core/Grid'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'

import useStyles from './styles'

const ShopfrontListItem = ({ isCart, data, onClick }) => {
  /**
   * CLASSES & STYLES
   */
  const classes = useStyles()

  const price = isCart ? data?.subtotal?.toFixed(2) : data?.price?.toFixed(2)

  return (
    <ListItem button onClick={onClick(data)} key={data._id.toString()} alignItems='flex-start'>
      <Grid container direction='row' spacing={1}>
        <Grid item xs={9} container direction='column'>
          {!isCart && <ListItemText primary={data?.name} secondary={data?.description} />}
          {isCart && <ListItemText primary={data?.name} secondary={data?.note} />}
          <ListItemText primary={`R$ ${price}`} />
        </Grid>
        <Grid item xs={3} container alignItems='center'>
          {!isCart && (
            <ListItemAvatar>
              <Avatar
                className={classes.avatar}
                alt={data?.name}
                variant='rounded'
                src={data?.image}
              />
            </ListItemAvatar>
          )}
          {isCart && (
            <Badge badgeContent={data.quantity} overlap='circle' color='error'>
              <ListItemAvatar>
                <Avatar
                  className={classes.avatar}
                  alt={data?.name}
                  variant='rounded'
                  src={data?.image}
                />
              </ListItemAvatar>
            </Badge>
          )}
        </Grid>
      </Grid>
    </ListItem>
  )
}

ShopfrontListItem.propTypes = {
  isCart: PropTypes.bool,
  data: PropTypes.object,
  onClick: PropTypes.func
}

ShopfrontListItem.defaultProps = {
  onClick: () => {}
}

export default ShopfrontListItem
