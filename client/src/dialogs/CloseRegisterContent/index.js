import React from 'react'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'

import Button from 'src/components/Button'

import CloseRegisterForm from 'src/forms/CloseRegisterForm'

import useStyles from './styles'

const CloseRegisterContent = ({ loading, initialValues, onClose, onSubmit }) => {
  const classes = useStyles()

  return (
    <DialogContent className={classes.root}>
      <CloseRegisterForm
        initialValues={initialValues}
        onClose={onClose}
        onSubmit={onSubmit}
        actions={(invalid) => (
          <Paper className={classes.paper}>
            <DialogActions>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                loading={loading}
                disabled={invalid}
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

CloseRegisterContent.propTypes = {
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
  operation: PropTypes.string,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  isAdjust: PropTypes.bool
}

CloseRegisterContent.defaultProps = {
  loading: false,
  isAdjust: false,
  initialValues: null,
  onClose: () => {},
  onSubmit: () => {}
}

export default CloseRegisterContent
