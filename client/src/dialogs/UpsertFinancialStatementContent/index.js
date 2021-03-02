import React from 'react'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'

import Button from 'src/components/Button'

import UpsertFinancialStatementForm from 'src/forms/UpsertFinancialStatementForm'

import useStyles from './styles'

const UpsertFinancialStatementContent = ({ loading, operation, isPurchase, onClose, onSubmit }) => {
  const classes = useStyles()

  return (
    <DialogContent className={classes.root}>
      <UpsertFinancialStatementForm
        operation={operation}
        onClose={onClose}
        isPurchase={isPurchase}
        onSubmit={onSubmit}
        actions={(submitting, pristine, invalid) => (
          <Paper className={classes.paper}>
            <DialogActions>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                loading={loading}
                disabled={submitting || pristine || invalid}
              >
                Adicionar
              </Button>
            </DialogActions>
          </Paper>
        )}
      />
    </DialogContent>
  )
}

UpsertFinancialStatementContent.propTypes = {
  loading: PropTypes.bool,
  isPurchase: PropTypes.bool,
  operation: PropTypes.string,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertFinancialStatementContent.defaultProps = {
  loading: false,
  onClose: () => {},
  onSubmit: () => {}
}

export default UpsertFinancialStatementContent
