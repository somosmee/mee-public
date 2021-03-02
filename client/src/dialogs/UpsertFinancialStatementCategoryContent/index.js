import React from 'react'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'

import Button from 'src/components/Button'

import UpsertFinancialStatementCategoryForm from 'src/forms/UpsertFinancialStatementCategoryForm'

import useStyles from './styles'

const UpsertFinancialStatementCategoryContent = ({
  loading,
  initialValues,
  operation,
  onClose,
  onSubmit
}) => {
  const classes = useStyles()

  return (
    <DialogContent className={classes.root}>
      <UpsertFinancialStatementCategoryForm
        initialValues={initialValues}
        operation={operation}
        onClose={onClose}
        onSubmit={onSubmit}
        actions={(submitting, pristine, invalid) => (
          <Paper className={classes.paper}>
            <DialogActions>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                loading={loading}
                disabled={submitting || invalid}
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

UpsertFinancialStatementCategoryContent.propTypes = {
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
  operation: PropTypes.string,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  isAdjust: PropTypes.bool
}

UpsertFinancialStatementCategoryContent.defaultProps = {
  loading: false,
  isAdjust: false,
  initialValues: null,
  onClose: () => {},
  onSubmit: () => {}
}

export default UpsertFinancialStatementCategoryContent
