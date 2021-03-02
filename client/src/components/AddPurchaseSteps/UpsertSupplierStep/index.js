import React from 'react'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import UpsertSupplierForm from 'src/forms/UpsertSupplierForm'

import useStyles from './styles'

const UpsertSupplierStep = ({ onSubmit }) => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md')) || true

  return (
    <DialogContent className={classes.content}>
      <UpsertSupplierForm
        onSubmit={onSubmit}
        actions={(submitting, pristine, invalid, handleSubmit) => (
          <Paper className={classes.paper} elevation={10}>
            <DialogActions>
              <Button
                variant='contained'
                color='primary'
                size='large'
                fullWidth={!upMedium}
                disabled={submitting || pristine || invalid}
                onClick={handleSubmit}
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

UpsertSupplierStep.propTypes = {
  onSubmit: PropTypes.func
}

UpsertSupplierStep.defaultProps = {
  onSubmit: () => {}
}

export default UpsertSupplierStep
