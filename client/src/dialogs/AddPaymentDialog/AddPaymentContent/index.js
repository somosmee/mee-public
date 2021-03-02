import React from 'react'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'

import Button from 'src/components/Button'

import PaymentForm from 'src/forms/PaymentForm'

const AddPaymentContent = ({ loading, initialValues, onClose, onSubmit }) => {
  return (
    <DialogContent>
      <PaymentForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        actions={(submitting, pristine, invalid, handleSubmit) => (
          <DialogActions>
            <Button
              variant='outlined'
              data-cy='payment-form-cancel'
              color='secondary'
              size='large'
              onClick={onClose}
            >
              VOLTAR
            </Button>
            <Button
              variant='contained'
              data-cy='payment-form-pay'
              type='submit'
              color='primary'
              size='large'
              loading={loading || submitting}
              disabled={initialValues ? submitting || invalid : submitting || pristine || invalid}
            >
              PAGAR
            </Button>
          </DialogActions>
        )}
      />
    </DialogContent>
  )
}

AddPaymentContent.propTypes = {
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
}

AddPaymentContent.defaultProps = {
  loading: false,
  initialValues: {},
  onSubmit: () => {},
  onClose: () => {}
}

export default AddPaymentContent
