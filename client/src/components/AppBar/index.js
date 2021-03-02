import React, { useContext, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import classNames from 'classnames'
import debounce from 'lodash.debounce'
import PropTypes from 'prop-types'
import client from 'src/apollo'
import { ReactComponent as Mee } from 'src/assets/icons/mee-imagotype1.svg'

import AppBarMaterial from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputBase from '@material-ui/core/InputBase'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { useTheme } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import AccountCircle from '@material-ui/icons/AccountCircle'
import ReceiptIcon from '@material-ui/icons/Receipt'
import SearchIcon from '@material-ui/icons/Search'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket'

import Dialog from 'src/components/Dialog'

import AppBarContext from 'src/contexts/AppBarContext'

import useApp from 'src/hooks/useApp'
import useGlobalSearch from 'src/hooks/useGlobalSearch'
import useMe from 'src/hooks/useMe'
import useUser from 'src/hooks/useUser'

import UpsertProfileContent from 'src/dialogs/UpsertProfileContent'

import { DEBOUNCE_MS } from 'src/utils/constants'
import { FirebaseEvents } from 'src/utils/enums'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const AppBar = ({ hasDrawer }) => {
  const classes = useStyles()
  const theme = useTheme()
  const { pathname } = useLocation()
  const upSmall = useMediaQuery(theme.breakpoints.up('sm'))

  const { me } = useMe()
  const {
    updateMe: [updateMe]
  } = useUser()

  const { app } = useApp()

  const [updateSearch, updateSearchResult] = useGlobalSearch()
  const [appBar] = useContext(AppBarContext)

  const [openDialog, setOpenDialog] = useState(false)

  const [anchorEl, setAnchorEl] = useState(null)
  const isMenuOpen = Boolean(anchorEl)

  const [term, setTerm] = useState()
  const updateSearchDebounced = useRef(debounce(updateSearch, DEBOUNCE_MS))

  const handleSearch = (event) => {
    const term = event.target.value
    setTerm(term)
    updateSearchDebounced.current(term)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleOpenDialog = () => {
    handleMenuClose()
    setOpenDialog(true)
  }

  const handleSignOut = () => {
    setAnchorEl(null)
    client.resetStore()
    analytics.logEvent(FirebaseEvents.LOGOUT)
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleOpenDialog}>Meu Perfil</MenuItem>
      <MenuItem onClick={handleSignOut}>Sair</MenuItem>
    </Menu>
  )

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleSubmit = async (data) => {
    await updateMe({ name: data.name })
  }

  return (
    <>
      <AppBarMaterial
        position='static'
        className={classNames(classes.root, {
          [classes.rootOpen]: hasDrawer ? app.openDrawer : false,
          [classes.rootClose]: hasDrawer ? !app.openDrawer : false
        })}
        style={{
          backgroundColor: appBar.prominent ? appBar.color : theme.palette.primary.main
        }}
      >
        <Toolbar>
          {!hasDrawer && <Mee height={28} />}
          {(upSmall || pathname !== '/sales') && (
            <Typography className={classes.title} variant='h6' noWrap>
              {appBar.title}
            </Typography>
          )}
          {pathname === '/sales' && (
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder='Busca…'
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                value={term}
                onChange={handleSearch}
                inputProps={{
                  'aria-label': 'search'
                }}
                endAdornment={
                  <InputAdornment className={classes.inputLoading} position='end'>
                    <Box width={20}>
                      {updateSearchResult.loading && <CircularProgress color='inherit' size={20} />}
                    </Box>
                  </InputAdornment>
                }
              />
            </div>
          )}

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {appBar.salesToggle && (
              <ToggleButtonGroup
                className={classes.toggle}
                size='small'
                value={appBar.salesTypeValue}
                exclusive
                onChange={appBar.onToggleChange}
                aria-label='selecione modo de venda'
              >
                <ToggleButton value='checkout' aria-label='left aligned'>
                  <ShoppingBasketIcon fontSize='small' />
                </ToggleButton>
                <ToggleButton value='orders' aria-label='centered'>
                  <ReceiptIcon fontSize='small' />
                </ToggleButton>
              </ToggleButtonGroup>
            )}
            <IconButton
              edge='end'
              aria-label='account of current user'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={handleProfileMenuOpen}
              color='inherit'
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              edge='end'
              aria-label='account of current user'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={handleProfileMenuOpen}
              color='inherit'
            >
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBarMaterial>
      {renderMenu}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <UpsertProfileContent
          title='Meu Perfil'
          initialValues={me}
          loading={false}
          onClose={handleCloseDialog}
          onSubmit={handleSubmit}
        />
      </Dialog>
    </>
  )
}

AppBar.propTypes = {
  hasDrawer: PropTypes.bool
}

AppBar.defaultProps = {
  hasDrawer: true
}

export default AppBar
