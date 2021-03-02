import React from 'react'

import PropTypes from 'prop-types'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'

import Button from 'src/components/Button'

import OpenRegisterForm from 'src/forms/OpenRegisterForm'

import useStyles from './styles'

const OpenRegisterContent = ({ loading, initialValues, onClose, onSubmit }) => {
  const classes = useStyles()

  return (
    <DialogContent className={classes.root}>
      <OpenRegisterForm
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
                Salvar & Atualizar saldos
              </Button>
            </DialogActions>
          </Paper>
        )}
      />
    </DialogContent>
  )
}

OpenRegisterContent.propTypes = {
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
  operation: PropTypes.string,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  isAdjust: PropTypes.bool
}

OpenRegisterContent.defaultProps = {
  loading: false,
  isAdjust: false,
  initialValues: null,
  onClose: () => {},
  onSubmit: () => {}
}

export default OpenRegisterContent
