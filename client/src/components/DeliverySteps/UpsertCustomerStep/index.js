import React from 'react'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Button from 'src/components/Button'

import UpsertCustomerForm from 'src/forms/UpsertCustomerForm'

import useStyles from './styles'

const UpsertCustomerStep = ({ initialValues, onManageAddress, onSubmit }) => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md')) || true

  return (
    <DialogContent className={classes.root}>
      <UpsertCustomerForm
        initialValues={initialValues}
        onManageAddress={onManageAddress}
        onSubmit={onSubmit}
        actions={(submitting, pristine, invalid) => (
          <Paper className={classes.paper} elevation={10}>
            <DialogActions>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                size='large'
                fullWidth={!upMedium}
                loading={submitting}
                disabled={initialValues ? invalid : pristine || invalid}
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

UpsertCustomerStep.propTypes = {
  initialValues: PropTypes.object,
  onManageAddress: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertCustomerStep.defaultProps = {
  onManageAddress: () => {},
  onSubmit: () => {}
}

export default UpsertCustomerStep
