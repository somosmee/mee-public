import React from 'react'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'

import Button from 'src/components/Button'

import BarcodeForm from 'src/forms/BarcodeForm'

import useStyles from './styles'

const BarcodeStep = ({ loading, onSubmit }) => {
  const classes = useStyles()

  return (
    <DialogContent className={classes.root}>
      <BarcodeForm
        onSubmit={onSubmit}
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
                Continuar
              </Button>
            </DialogActions>
          </Paper>
        )}
      />
    </DialogContent>
  )
}

BarcodeStep.propTypes = {
  loading: PropTypes.bool,
  onSubmit: PropTypes.func
}

BarcodeStep.defaultProps = {
  loading: false,
  onSubmit: () => {}
}

export default BarcodeStep
