import React, { useState, forwardRef, useImperativeHandle } from 'react'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputBase from '@material-ui/core/InputBase'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import ArrowBack from '@material-ui/icons/ArrowBack'
import SearchIcon from '@material-ui/icons/Search'

import useStyles from './styles'

const Dialog = forwardRef(({ title, action, onCancel, search, fullScreen, children }, ref) => {
  const classes = useStyles()

  const [value, setValue] = useState('')

  useImperativeHandle(ref, () => ({
    clear() {
      setValue('')
    }
  }))

  const handleCancel = () => {
    onCancel()
  }

  const handleInputChange = (event) => {
    const { value } = event.target
    setValue(value)

    const { onChange } = search
    onChange(value)
  }

  const handleAction = () => {
    const { onAction } = action
    onAction()
  }

  const hasAction = action && (action.title || action.onAction)
  const hasSearch = search && search.onChange

  return (
    <>
      {fullScreen && (
        <AppBar className={classes.appBar} color='default'>
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={handleCancel} aria-label='voltar'>
              <ArrowBack />
            </IconButton>
            {!hasSearch && (
              <Typography variant='h6' className={classes.title}>
                {title}
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
                autoFocus
              />
            )}
            {hasAction && (
              <Button
                className={classes.button}
                color='primary'
                disabled={action.disabled}
                onClick={handleAction}
              >
                {action.title}
              </Button>
            )}
          </Toolbar>
        </AppBar>
      )}
      {children}
    </>
  )
})

Dialog.displayName = 'Dialog'

export default Dialog
