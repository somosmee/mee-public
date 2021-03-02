import React from 'react'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'

import Button from 'src/components/Button'

import UpsertFeeForm from 'src/forms/UpsertFeeForm'

import useStyles from './styles'

const UpsertDiscountContent = ({ loading, order, onClose, onSubmit }) => {
  const classes = useStyles()

  return (
    <DialogContent className={classes.root}>
      <UpsertFeeForm
        initialValues={order.fees}
        onClose={onClose}
        onSubmit={onSubmit}
        actions={(handleSubmit) => (
          <Paper className={classes.paper}>
            <DialogActions>
              <Button
                onClick={handleSubmit}
                type='submit'
                variant='contained'
                color='primary'
                loading={loading}
              >
                Salvar
              </Button>
            </DialogActions>
          </Paper>
        )}
      />
    </DialogContent>
  )
}

UpsertDiscountContent.propTypes = {
  loading: PropTypes.bool,
  order: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertDiscountContent.defaultProps = {
  loading: false,
  onClose: () => {},
  onSubmit: () => {}
}

export default UpsertDiscountContent
