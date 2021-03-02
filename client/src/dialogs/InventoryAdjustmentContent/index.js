import React from 'react'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'

import Button from 'src/components/Button'

import InventoryAdjustmentForm from 'src/forms/InventoryAdjustmentForm'

import useStyles from './styles'

const InventoryAdjustmentContent = ({ loading, initialValues, onClose, onSubmit }) => {
  const classes = useStyles()

  return (
    <DialogContent className={classes.root}>
      <InventoryAdjustmentForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        onClose={onClose}
        actions={(submitting, pristine, invalid) => (
          <Paper className={classes.paper}>
            <DialogActions>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                loading={submitting}
                disabled={pristine || invalid}
              >
                Atualizar
              </Button>
            </DialogActions>
          </Paper>
        )}
      />
    </DialogContent>
  )
}

InventoryAdjustmentContent.propTypes = {
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
}

InventoryAdjustmentContent.defaultProps = {
  loading: false,
  onClose: () => {},
  onSubmit: () => {}
}

export default InventoryAdjustmentContent
