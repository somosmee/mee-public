import React from 'react'

import DialogActions from '@material-ui/core/DialogActions'

import Button from 'src/components/Button'

import useStyles from './styles'

const AddPaymentActions = ({ fullScreen, loading, onCancel }) => {
  const classes = useStyles()

  const handleCancel = (event) => {
    onCancel()
  }

  return (
    !fullScreen && (
      <DialogActions className={classes.root}>
        <Button
          variant='outlined'
          data-cy='payment-form-cancel'
          color='secondary'
          onClick={handleCancel}
        >
          Voltar
        </Button>
        <Button
          variant='contained'
          data-cy='payment-form-pay'
          type='submit'
          loading={loading}
          color='primary'
        >
          Pagar
        </Button>
      </DialogActions>
    )
  )
}

export default AddPaymentActions
