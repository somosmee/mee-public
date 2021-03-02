import React from 'react'

import PropTypes from 'prop-types'

import DialogTitle from '@material-ui/core/DialogTitle'

import Dialog from 'src/components/DialogOld'

import AddPaymentContent from './AddPaymentContent'

const PaymentDialog = ({ fullScreen, loading, total, onAddPayment, onCancel }) => {
  const title = 'Adicionar Pagamento'

  return (
    <Dialog title={title} fullScreen={fullScreen}>
      {!fullScreen && <DialogTitle id='dialog-title'>{title}</DialogTitle>}
      <AddPaymentContent
        initialValues={{ total }}
        loading={loading}
        onClose={onCancel}
        onSubmit={onAddPayment}
      />
    </Dialog>
  )
}

PaymentDialog.propTypes = {
  fullScreen: PropTypes.bool,
  loading: PropTypes.bool,
  total: PropTypes.number.isRequired,
  onAddPayment: PropTypes.func,
  onCancel: PropTypes.func
}

PaymentDialog.defaultProps = {
  onAddPayment: () => {},
  onCancel: () => {}
}

export default PaymentDialog
