import React from 'react'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'

import Button from 'src/components/Button'

import UpsertFinancialFundForm from 'src/forms/UpsertFinancialFundForm'

import useStyles from './styles'

const UpsertFinancialFundContent = ({
  loading,
  initialValues,
  isAdjust,
  operation,
  onClose,
  onSubmit
}) => {
  const classes = useStyles()

  return (
    <DialogContent className={classes.root}>
      <UpsertFinancialFundForm
        operation={operation}
        initialValues={initialValues}
        onClose={onClose}
        isAdjust={isAdjust}
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
                {initialValues ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogActions>
          </Paper>
        )}
      />
    </DialogContent>
  )
}

UpsertFinancialFundContent.propTypes = {
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
  operation: PropTypes.string,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  isAdjust: PropTypes.bool
}

UpsertFinancialFundContent.defaultProps = {
  loading: false,
  isAdjust: false,
  initialValues: null,
  onClose: () => {},
  onSubmit: () => {}
}

export default UpsertFinancialFundContent
