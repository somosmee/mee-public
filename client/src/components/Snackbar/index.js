import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import IconButton from '@material-ui/core/IconButton'
import SnackbarMaterial from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import Close from '@material-ui/icons/Close'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import WarningIcon from '@material-ui/icons/Warning'

import useSnackbar from 'src/hooks/useSnackbar'

import { SnackbarVariants } from 'src/utils/enums'

import useStyles from './styles'

const variantIcon = {
  [SnackbarVariants.success]: CheckCircleIcon,
  [SnackbarVariants.warning]: WarningIcon,
  [SnackbarVariants.error]: ErrorIcon,
  [SnackbarVariants.info]: InfoIcon
}

const Snackbar = ({ className }) => {
  const classes = useStyles()
  const theme = useTheme()
  const upSmall = useMediaQuery(theme.breakpoints.up('sm'))

  const { snackbar, closeSnackbar, clearSnackbar } = useSnackbar()

  const handleClose = () => {
    closeSnackbar()
  }

  const handleExited = () => {
    clearSnackbar()
  }

  const Icon = variantIcon[snackbar.variant]

  return (
    <SnackbarMaterial
      className={classNames(classes.root, className)}
      anchorOrigin={{ vertical: 'bottom', horizontal: upSmall ? 'left' : 'right' }}
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={handleClose}
      onExited={handleExited}
      ContentProps={{ 'aria-describedby': 'message-id' }}
    >
      <SnackbarContent
        className={classNames(classes.content, classes[snackbar.variant])}
        id='snackbar-content'
        aria-describedby='snackbar-message'
        message={
          <span className={classes.message} id='snackbar-message'>
            {snackbar.variant && <Icon className={classes.iconVariant} fontSize='small' />}
            {snackbar.message}
          </span>
        }
        action={
          <IconButton key='close' aria-label='Close' color='inherit' onClick={handleClose}>
            <Close fontSize='small' />
          </IconButton>
        }
      />
    </SnackbarMaterial>
  )
}

Snackbar.propTypes = {
  className: PropTypes.string
}

export default Snackbar
