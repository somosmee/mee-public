import React, { forwardRef } from 'react'

import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'

import Button from 'src/components/Button'
import Dialog from 'src/components/Dialog'

import UpsertChangeForForm from 'src/forms/UpsertChangeForForm'

import useStyles from './styles'

const Transition = forwardRef((props, ref) => <Slide direction='up' ref={ref} {...props} />)

Transition.displayName = 'Transition'

const ChangeForDialog = ({ open, changeFor, onSubmit, onClose, onExited }) => {
  const classes = useStyles()

  return (
    <Dialog
      className={classes.root}
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      position='bottom'
    >
      <DialogTitle>Troco para</DialogTitle>
      <DialogContent>
        <UpsertChangeForForm
          initialValues={{ changeFor }}
          onSubmit={onSubmit}
          actions={(submitting, pristine, invalid) => (
            <Box className={classes.actions}>
              <Button
                className={classes.button}
                variant='contained'
                color='primary'
                type='submit'
                disabled={submitting || pristine || invalid}
                fullWidth
              >
                Adicionar
              </Button>
            </Box>
          )}
        />
      </DialogContent>
    </Dialog>
  )
}

ChangeForDialog.propTypes = {
  open: PropTypes.bool,
  changeFor: PropTypes.number,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  onExited: PropTypes.func
}

ChangeForDialog.defaultProps = {
  onSubmit: () => {},
  onClose: () => {},
  onExited: () => {}
}

export default ChangeForDialog
