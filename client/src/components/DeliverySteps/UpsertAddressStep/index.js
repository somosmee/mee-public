import React from 'react'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'

import Button from 'src/components/Button'
import Spacer from 'src/components/Spacer'

import UpsertAddressForm from 'src/forms/UpsertAddressForm'

import useStyles from './styles'

const UpsertAddressStep = ({ initialValues, onPostalCode, onSubmit }) => {
  const classes = useStyles()

  return (
    <DialogContent className={classes.root}>
      <UpsertAddressForm
        initialValues={initialValues}
        onPostalCode={onPostalCode}
        onSubmit={onSubmit}
        actions={(submitting, pristine, invalid) => (
          <Paper className={classes.paper} elevation={10}>
            <DialogActions>
              <Spacer />
              <Button
                type='submit'
                variant='contained'
                color='primary'
                loading={submitting}
                disabled={initialValues ? invalid : pristine || invalid}
              >
                {initialValues?._id ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogActions>
          </Paper>
        )}
      />
    </DialogContent>
  )
}

UpsertAddressStep.propTypes = {
  initialValues: PropTypes.object,
  onPostalCode: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertAddressStep.defaultProps = {
  onPostalCode: () => {},
  onSubmit: () => {}
}

export default UpsertAddressStep
