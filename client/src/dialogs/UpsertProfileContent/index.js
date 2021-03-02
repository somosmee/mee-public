import React from 'react'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'

import Button from 'src/components/Button'

import UpsertMyProfileForm from 'src/forms/UpsertMyProfileForm'

import useStyles from './styles'

const UpsertDiscountContent = ({ initialValues, loading, onClose, onSubmit }) => {
  const classes = useStyles()

  return (
    <DialogContent className={classes.root}>
      <UpsertMyProfileForm
        initialValues={initialValues}
        onClose={onClose}
        onSubmit={onSubmit}
        actions={(invalid, pristine, submitting, handleSubmit) => (
          <Paper className={classes.paper}>
            <DialogActions>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                onClick={handleSubmit}
                disabled={invalid || submitting}
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
  initialValues: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
}

UpsertDiscountContent.defaultProps = {
  loading: false,
  onClose: () => {},
  onSubmit: () => {}
}

export default UpsertDiscountContent
