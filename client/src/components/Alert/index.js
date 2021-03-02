import React from 'react'

import PropTypes from 'prop-types'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import Button from 'src/components/Button'

const Alert = ({
  open,
  title,
  loading,
  primaryLabel,
  secondaryLabel,
  children,
  onExited,
  onClose,
  onPrimary,
  onSecondary
}) => (
  <Dialog
    open={open}
    onExited={onExited}
    onClose={onClose}
    aria-labelledby='alert-dialog-title'
    aria-describedby='alert-dialog-description'
  >
    <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText id='alert-dialog-description'>{children}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button id='alert-dialog-secondary' color='primary' onClick={onSecondary}>
        {secondaryLabel}
      </Button>
      <Button
        id='alert-dialog-primary'
        type='submit'
        color='primary'
        loading={loading}
        onClick={onPrimary}
      >
        {primaryLabel}
      </Button>
    </DialogActions>
  </Dialog>
)

Alert.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  primaryLabel: PropTypes.string,
  secondaryLabel: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  onExited: PropTypes.func,
  onClose: PropTypes.func,
  onPrimary: PropTypes.func,
  onSecondary: PropTypes.func
}

Alert.defaultProps = {
  open: false,
  title: '',
  loading: false,
  primaryLabel: '',
  secondaryLabel: '',
  onExited: () => {},
  onClose: () => {},
  onPrimary: () => {},
  onSecondary: () => {}
}

export default Alert
