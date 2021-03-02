import React, { forwardRef } from 'react'

import PropTypes from 'prop-types'

import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Slide from '@material-ui/core/Slide'

import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike'
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk'
import StorefrontIcon from '@material-ui/icons/Storefront'

import AddressDisplay from 'src/components/AddressDisplay'
import Dialog from 'src/components/Dialog'

import { DeliveryTypes } from 'src/utils/enums'

import useStyles from './styles'

const Transition = forwardRef((props, ref) => <Slide direction='up' ref={ref} {...props} />)

Transition.displayName = 'Transition'

const ShopfrontDeliveryMethodDialog = ({
  open,
  address,
  method,
  onClose,
  onExited,
  onDeliveryMethodChange
}) => {
  const classes = useStyles()

  const handleDeliveryMethodClick = (method) => (event) => {
    onDeliveryMethodChange({ method })
  }

  return (
    <Dialog
      className={classes.root}
      open={open}
      onClose={onClose}
      onExited={onExited}
      TransitionComponent={Transition}
      position='bottom'
    >
      <DialogTitle>Tipo de pedido</DialogTitle>
      <DialogContent>
        <Grid container direction='column' spacing={3}>
          {method === DeliveryTypes.delivery.type && address && (
            <Grid xs={12} item>
              <AddressDisplay address={address} />
            </Grid>
          )}
          <Grid item>
            <List component='nav'>
              <ListItem
                button
                selected={method === DeliveryTypes.indoor.type}
                onClick={handleDeliveryMethodClick(DeliveryTypes.indoor.type)}
              >
                <ListItemIcon>
                  <StorefrontIcon />
                </ListItemIcon>
                <ListItemText primary={DeliveryTypes.indoor.label} secondary='Você está na mesa' />
              </ListItem>
              <ListItem
                button
                selected={method === DeliveryTypes.takeout.type}
                onClick={handleDeliveryMethodClick(DeliveryTypes.takeout.type)}
              >
                <ListItemIcon>
                  <DirectionsWalkIcon />
                </ListItemIcon>
                <ListItemText
                  primary={DeliveryTypes.takeout.label}
                  secondary='Você retira no local'
                />
              </ListItem>
              <ListItem
                button
                selected={method === DeliveryTypes.delivery.type}
                onClick={handleDeliveryMethodClick(DeliveryTypes.delivery.type)}
              >
                <ListItemIcon>
                  <DirectionsBikeIcon />
                </ListItemIcon>
                <ListItemText
                  primary={DeliveryTypes.delivery.label}
                  secondary='A gente leva até você'
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

ShopfrontDeliveryMethodDialog.propTypes = {
  open: PropTypes.bool,
  address: PropTypes.object,
  method: PropTypes.string,
  onClose: PropTypes.func,
  onExited: PropTypes.func,
  onDeliveryMethodChange: PropTypes.func
}

ShopfrontDeliveryMethodDialog.defaultProps = {
  open: false,
  address: null,
  method: DeliveryTypes.indoor.type,
  onClose: () => {},
  onExited: () => {},
  onDeliveryMethodChange: () => {}
}

export default ShopfrontDeliveryMethodDialog
