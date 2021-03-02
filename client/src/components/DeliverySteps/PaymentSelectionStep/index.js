import React, { useState } from 'react'

import PropTypes from 'prop-types'

import Avatar from '@material-ui/core/Avatar'
import DialogContent from '@material-ui/core/DialogContent'
import Icon from '@material-ui/core/Icon'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'

import ChevronRight from '@material-ui/icons/ChevronRight'

import Dialog from 'src/components/Dialog'

import ChangeContent from 'src/views/LoggiView/DialogContents/ChangeContent'

import { Payments } from 'src/utils/enums'

import useStyles from './styles'

const DialogContents = {
  setChange: 'setChange'
}

const PaymentSelectionStep = ({ source, paymentMethods, onSelect }) => {
  const classes = useStyles()

  const [openDialog, setOpenDialog] = useState(false)
  const [paymentType, setPaymentType] = useState(null)

  const handleClick = ({ type }) => () => {
    // money with change Loggi
    if (type === Payments.cash.type || type === 8) {
      setPaymentType(type)
      setOpenDialog(true)
    } else {
      const payments = [{ method: type }]
      onSelect({ payments })
    }
  }

  const handleChangeSubmit = (data) => {
    const payments = [{ method: paymentType, received: data.change }]

    onSelect({ payments })
  }

  const renderPaymentType = (payment, index) => (
    <ListItem button key={index} divider onClick={handleClick(payment)}>
      <ListItemIcon>
        <Avatar>
          <Icon>{payment.icon}</Icon>
        </Avatar>
      </ListItemIcon>
      <ListItemText primary={payment.label} secondary={payment.installment} />
      <ChevronRight />
    </ListItem>
  )

  return (
    <DialogContent className={classes.content}>
      <List className={classes.root}>
        <Paper>{Object.values(paymentMethods || Payments).map(renderPaymentType)}</Paper>
      </List>
      <Dialog
        className={classes.dialog}
        open={openDialog}
        activeContent={DialogContents.setChange}
        onExited={() => {}}
      >
        <ChangeContent
          id={DialogContents.setChange}
          title='Troco pra quanto?'
          loading={false}
          onSubmit={handleChangeSubmit}
        />
      </Dialog>
    </DialogContent>
  )
}

PaymentSelectionStep.propTypes = {
  source: PropTypes.string,
  paymentMethods: PropTypes.array,
  onSelect: PropTypes.func
}

PaymentSelectionStep.defaultProps = {
  source: 'ifood',
  onSelect: () => {}
}

export default PaymentSelectionStep
