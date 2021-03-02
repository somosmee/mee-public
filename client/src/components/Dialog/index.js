import React, { useState, forwardRef, useImperativeHandle } from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import AppBar from '@material-ui/core/AppBar'
import Collapse from '@material-ui/core/Collapse'
import DialogMaterial from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputBase from '@material-ui/core/InputBase'
import { useTheme } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Alert from '@material-ui/lab/Alert'

import Back from '@material-ui/icons/ArrowBackIos'
import Close from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'

import useStyles from './styles'

const Dialog = forwardRef(
  (
    {
      open,
      title,
      alert,
      activeContent,
      onBack,
      onClose,
      onExited,
      search,
      fullScreen,
      maxWidth,
      position,
      TransitionComponent,
      children
    },
    ref
  ) => {
    const classes = useStyles()
    const theme = useTheme()
    const upSmall = useMediaQuery(theme.breakpoints.up('sm'))

    const [value, setValue] = useState('')
    const [openAlert, setOpenAlert] = useState(true)

    const isArray = Array.isArray(children)
    const currentContentIndex =
      isArray && activeContent
        ? children.findIndex((child) => child.props.id === activeContent)
        : null
    const currentContent =
      currentContentIndex !== null && currentContentIndex > -1
        ? children[currentContentIndex]
        : children
    const firstContent = currentContentIndex === 0

    useImperativeHandle(ref, () => ({
      clear() {
        setValue('')
      }
    }))

    const handleOpenAlert = () => {
      setOpenAlert(false)
    }

    const handleInputChange = (event) => {
      const { value } = event.target
      setValue(value)

      const { onChange } = search
      onChange(value)
    }

    const hasSearch = search?.onChange

    return (
      <DialogMaterial
        className={classes.root}
        classes={{ paper: classNames({ [classes[position]]: !upSmall }) }}
        open={open}
        fullScreen={fullScreen ?? (!upSmall && position !== 'bottom')}
        maxWidth={maxWidth ?? 'sm'}
        fullWidth
        TransitionComponent={TransitionComponent}
        onClose={onClose}
        onExited={onExited}
      >
        {(currentContent?.props?.title ?? title ?? hasSearch) && (
          <AppBar id='dialog-appbar' className={classes.appBar} elevation={1}>
            <Toolbar className={classes.toolbar}>
              <IconButton
                edge='start'
                color='inherit'
                onClick={isArray && !firstContent ? onBack : onClose}
                aria-label={isArray && !firstContent ? 'voltar' : 'fechar'}
              >
                {isArray && !firstContent ? <Back /> : <Close />}
              </IconButton>
              {!hasSearch && (
                <Typography variant='h5' align='center'>
                  {currentContent?.props?.title ?? title}
                </Typography>
              )}
              {hasSearch && (
                <InputBase
                  className={classes.search}
                  type='text'
                  placeholder={search.placeholder || ''}
                  startAdornment={
                    search.startAdornment && (
                      <InputAdornment position='start'>
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }
                  inputProps={{ 'aria-label': search.placeholder || '' }}
                  value={value}
                  onChange={handleInputChange}
                />
              )}
            </Toolbar>
          </AppBar>
        )}
        {currentContent?.props?.alert && (
          <Collapse in={openAlert}>
            <Alert
              severity='warning'
              action={
                <IconButton
                  aria-label='close'
                  color='inherit'
                  size='small'
                  onClick={handleOpenAlert}
                >
                  <Close fontSize='inherit' />
                </IconButton>
              }
            >
              {currentContent?.props.alert}
            </Alert>
          </Collapse>
        )}
        {currentContent}
      </DialogMaterial>
    )
  }
)

Dialog.displayName = 'Dialog'

Dialog.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  open: PropTypes.bool,
  title: PropTypes.string,
  alert: PropTypes.string,
  activeContent: PropTypes.string,
  onBack: PropTypes.func,
  onClose: PropTypes.func,
  onExited: PropTypes.func,
  search: PropTypes.object,
  fullScreen: PropTypes.bool,
  maxWidth: PropTypes.string,
  position: PropTypes.string,
  TransitionComponent: PropTypes.func
}

Dialog.defaultProps = {
  open: false,
  onBack: () => {},
  onClose: () => {},
  onExited: () => {}
}

export default Dialog
