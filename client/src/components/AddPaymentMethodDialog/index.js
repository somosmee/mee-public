import React, { forwardRef } from 'react'

import PropTypes from 'prop-types'

import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Slide from '@material-ui/core/Slide'

import Dialog from 'src/components/Dialog'

import { Payments } from 'src/utils/enums'

import useStyles from './styles'

const Transition = forwardRef((props, ref) => <Slide direction='up' ref={ref} {...props} />)

Transition.displayName = 'Transition'

const AddPaymentMethodDialog = ({ title, open, method, onChange, onClose, onExited }) => {
  const classes = useStyles()

  const handleClick = (method) => (event) => {
    onChange({ method })
  }

  const renderItem = (payment) => (
    <ListItem
      key={payment.type}
      button
      selected={method === payment.type}
      onClick={handleClick(payment.type)}
    >
      <ListItemIcon>{payment.icon}</ListItemIcon>
      <ListItemText primary={payment.label} secondary={payment.installment} />
    </ListItem>
  )

  return (
    <Dialog
      className={classes.root}
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      position='bottom'
    >
      <DialogTitle>Tipo de pagamento</DialogTitle>
      <DialogContent>
        <List component='nav'>{Object.values(Payments).map(renderItem)}</List>
      </DialogContent>
    </Dialog>
  )
}

AddPaymentMethodDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  method: PropTypes.string,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onExited: PropTypes.func
}

AddPaymentMethodDialog.defaultProps = {
  onChange: () => {},
  onClose: () => {},
  onExited: () => {}
}

export default AddPaymentMethodDialog
