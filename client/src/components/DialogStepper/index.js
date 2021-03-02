import React from 'react'

import PropTypes from 'prop-types'

import AppBar from '@material-ui/core/AppBar'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import ChevronLeft from '@material-ui/icons/ChevronLeft'

import useStyles from './styles'

const DialogStepper = ({
  fullScreen,
  fullWidth,
  maxWidth,
  open,
  activeStep,
  children,
  onBack,
  onClose
}) => {
  const classes = useStyles()

  const isArray = Array.isArray(children)
  const currentStep = isArray ? children.find((child) => child.props.id === activeStep) : children

  const handleBack = (event) => {
    onBack()
  }

  return (
    <Dialog
      className={classes.root}
      classes={{ paper: classes.paper }}
      fullScreen={fullScreen}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={onClose}
    >
      <AppBar className={classes.appBar} elevation={0}>
        <Toolbar className={classes.toolbar}>
          <IconButton edge='start' color='inherit' onClick={handleBack}>
            <ChevronLeft fontSize='large' />
          </IconButton>
          <Typography variant='h5' align='center'>
            {currentStep.props.title}
          </Typography>
        </Toolbar>
      </AppBar>
      {currentStep}
    </Dialog>
  )
}

DialogStepper.propTypes = {
  fullScreen: PropTypes.bool,
  fullWidth: PropTypes.bool,
  maxWidth: PropTypes.string,
  open: PropTypes.bool,
  activeStep: PropTypes.string,
  children: PropTypes.any,
  onBack: PropTypes.func,
  onClose: PropTypes.func
}

DialogStepper.defaultProps = {
  fullScreen: false,
  fullWidth: true,
  maxWidth: 'sm',
  open: false,
  onBack: () => {},
  onClose: () => {}
}

export default DialogStepper
