import React, { useState, useContext, cloneElement } from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import Badge from '@material-ui/core/Badge'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Fab from '@material-ui/core/Fab'
import Zoom from '@material-ui/core/Zoom'

import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'

import Add from '@material-ui/icons/Add'

import Loading from 'src/components/Loading'
import Snackbar from 'src/components/Snackbar'

import AppBarContext from 'src/contexts/AppBarContext'

import useStyles from './styles'

const Main = ({
  className,
  children,
  actions,
  fab,
  header,
  toolbar,
  loading,
  placeholder,
  snackbar,
  bottomNavigation
}) => {
  const classes = useStyles()

  const [open, setOpen] = useState(false)
  const [appBar] = useContext(AppBarContext)

  const handleClick = () => {
    setOpen(!open)
  }

  const handleActionClick = (action) => (event) => {
    setOpen(false)
    action.onClick()
  }

  const renderAction = (action, index) => (
    <SpeedDialAction
      key={index}
      icon={action.icon}
      tooltipTitle={action.label}
      tooltipOpen
      onClick={handleActionClick(action)}
    />
  )

  const isFab = !Array.isArray(fab?.actions)
  const hasPlaceholder = placeholder

  return (
    <Container
      className={classNames(classes.root, className, { [classes.background]: !appBar.prominent })}
      component='main'
    >
      {loading && <Loading className={classes.loading} />}
      {!loading && children}
      {!loading && hasPlaceholder && placeholder}
      {fab && isFab && (
        <Box display='block' displayPrint='none'>
          <Zoom in={isFab} unmountOnExit>
            <Badge
              className={classNames(classes.fab, { [classes.bottomNavigation]: bottomNavigation })}
              badgeContent={fab.actions.badge}
              color='error'
            >
              <Fab
                id={fab.id}
                disabled={fab.disabled}
                variant={fab.actions.variant}
                color='primary'
                onClick={fab.actions.onClick}
              >
                {fab.actions.icon ? (
                  cloneElement(fab.actions.icon, { className: classes.icon })
                ) : (
                  <Add className={classNames({ [classes.icon]: !!fab.actions.label })} />
                )}
                {fab.actions.variant === 'extended' && fab.actions.label}
              </Fab>
            </Badge>
          </Zoom>
        </Box>
      )}
      {fab && !isFab && (
        <Box display='block' displayPrint='none'>
          <Zoom in={!isFab} unmountOnExit>
            <Badge
              className={classNames(classes.fab, { [classes.bottomNavigation]: bottomNavigation })}
              badgeContent={fab.actions.badge}
              overlap='circle'
              color='error'
            >
              <SpeedDial
                id={fab.id}
                open={open}
                ariaLabel='Ações'
                icon={<SpeedDialIcon />}
                onClick={handleClick}
              >
                {fab.actions.map(renderAction)}
              </SpeedDial>
            </Badge>
          </Zoom>
        </Box>
      )}
      {snackbar && (
        <Snackbar
          className={classNames(classes.snackbar, { [classes.bottom]: fab && bottomNavigation })}
        />
      )}
    </Container>
  )
}

Main.propTypes = {
  className: PropTypes.string,
  toolbar: PropTypes.bool,
  loading: PropTypes.bool,
  actions: PropTypes.arrayOf(PropTypes.object),
  fab: PropTypes.shape({
    id: PropTypes.string,
    disabled: PropTypes.bool,
    icon: PropTypes.object,
    variant: PropTypes.string,
    actions: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)])
  }),
  header: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  placeholder: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  snackbar: PropTypes.bool,
  bottomNavigation: PropTypes.bool
}

Main.defaultProps = {
  header: true,
  toolbar: false,
  loading: false,
  snackbar: true,
  bottomNavigation: true
}

export default Main
