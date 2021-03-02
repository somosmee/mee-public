import React, { Fragment, useState, useEffect } from 'react'

import classNames from 'classnames'
import moment from 'moment'
import { ReactComponent as Mee } from 'src/assets/icons/mee-imagotype1.svg'
import NotificationSound from 'src/assets/sounds/notification.mp3'

import Badge from '@material-ui/core/Badge'
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider'
import DrawerMaterial from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import Assignment from '@material-ui/icons/Assignment'
import BarChart from '@material-ui/icons/BarChart'
import CardMembershipIcon from '@material-ui/icons/CardMembership'
import Category from '@material-ui/icons/Category'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Description from '@material-ui/icons/Description'
import Exit from '@material-ui/icons/ExitToApp'
import ExpandLess from '@material-ui/icons/ExpandLess'
import Group from '@material-ui/icons/Group'
import ListAlt from '@material-ui/icons/ListAlt'
import LocalShipping from '@material-ui/icons/LocalShipping'
import Motorcycle from '@material-ui/icons/Motorcycle'
import Payment from '@material-ui/icons/Payment'
import Receipt from '@material-ui/icons/Receipt'
import SettingsIcon from '@material-ui/icons/Settings'
import ShoppingBasket from '@material-ui/icons/ShoppingBasket'
import ShoppingCart from '@material-ui/icons/ShoppingCart'
import Store from '@material-ui/icons/Store'
import StoreFront from '@material-ui/icons/Storefront'

import NavLink from 'src/components/NavLink'
import Spacer from 'src/components/Spacer'

import useApp from 'src/hooks/useApp'
import useMe from 'src/hooks/useMe'
import useOrders from 'src/hooks/useOrders'
import useOrderSubscription from 'src/hooks/useOrderSubscription'

import SignoutDialog from 'src/dialogs/SignoutDialog'

import { OrderStatus, Paths, CompanyRoles } from 'src/utils/enums'
import useInterval from 'src/utils/useInterval'

import useStyles from './styles'
const audio = new Audio(NotificationSound)

const items = ({ loggi, ifood, address, card, role }) => {
  const isAttendant = role === CompanyRoles.ATTENDANT
  const isAccountant = role === CompanyRoles.ACCOUNTANT

  const myStore = {
    title: 'Loja',
    subitems: []
  }

  myStore.subitems.push({
    link: Paths.profile.path,
    icon: <Store fontSize='small' />,
    title: Paths.profile.label
  })

  // This should be the same "PlansView" its making people confused
  // if (permissions.billing) {
  //   myStore.subitems.push({
  //     link: Paths.billing.path,
  //     icon: <PaymentIcon fontSize='small' />,
  //     title: Paths.billing.label
  //   })
  // }

  myStore.subitems.push({
    link: Paths.support.path,
    icon: <CardMembershipIcon fontSize='small' />,
    title: Paths.support.label
  })

  const finance = {
    title: 'Financeiro',
    subitems: []
  }

  finance.subitems.push({
    link: Paths.reports.path,
    icon: <BarChart fontSize='small' />,
    title: Paths.reports.label
  })

  finance.subitems.push({
    link: Paths.financialStatementCategories.path,
    icon: <Category fontSize='small' />,
    title: Paths.financialStatementCategories.label
  })

  finance.subitems.push({
    link: Paths.paymentMethods.path,
    icon: <Payment fontSize='small' />,
    title: Paths.paymentMethods.label
  })

  finance.subitems.push({
    link: Paths.financialStatements.path,
    icon: <ListAlt fontSize='small' />,
    title: Paths.financialStatements.label
  })

  finance.subitems.push({
    link: Paths.registerOperations.path,
    icon: <Assignment fontSize='small' />,
    title: Paths.registerOperations.label
  })

  const orders = {
    title: 'Vendas',
    subitems: []
  }

  if (!isAccountant) {
    orders.subitems.push({
      link: Paths.sales.path,
      icon: <ShoppingCart fontSize='small' />,
      title: Paths.sales.label
    })
  }

  orders.subitems.push({
    link: Paths.orders.path,
    icon: <Receipt fontSize='small' />,
    title: Paths.orders.label
  })

  if (!isAccountant) {
    orders.subitems.push({
      link: Paths.products.path,
      icon: <ShoppingBasket fontSize='small' />,
      title: Paths.products.label
    })
  }

  // todo fix
  if (!isAccountant) {
    orders.subitems.push({
      link: Paths.customers.path,
      icon: <Group fontSize='small' />,
      title: Paths.customers.label
    })
  }

  const inventory = {
    title: 'Estoque',
    subitems: []
  }

  inventory.subitems.push({
    link: Paths.purchases.path,
    icon: <Description fontSize='small' />,
    title: Paths.purchases.label
  })

  inventory.subitems.push({
    link: Paths.suppliers.path,
    icon: <LocalShipping fontSize='small' />,
    title: Paths.suppliers.label
  })

  const integrations = {
    title: 'Integrações',
    subitems: []
  }

  integrations.subitems.push({
    link: Paths.shopfront.path,
    icon: <StoreFront fontSize='small' />,
    title: Paths.shopfront.label
  })

  const hasAddress = address?.number

  if (card && hasAddress && ifood?.username && ifood?.password) {
    integrations.subitems.push({
      link: Paths.ifood.path,
      icon: <Motorcycle fontSize='small' />,
      title: Paths.ifood.label
    })
  } else {
    integrations.subitems.push({
      link: Paths.ifoodSetup.path,
      icon: <Motorcycle fontSize='small' />,
      title: Paths.ifoodSetup.label
    })
  }

  if (loggi && loggi.username && loggi.password) {
    integrations.subitems.push({
      link: Paths.loggi.path,
      icon: <Motorcycle fontSize='small' />,
      title: Paths.loggi.label
    })
  } else {
    integrations.subitems.push({
      link: Paths.loggiSetup.path,
      icon: <Motorcycle fontSize='small' />,
      title: Paths.loggiSetup.label
    })
  }

  const accountant = {
    title: 'Tributário',
    subitems: []
  }

  accountant.subitems.push({
    link: Paths.nfe.path,
    icon: <AccountBalanceIcon fontSize='small' />,
    title: Paths.nfe.label
  })

  const menu = {}

  if (!isAttendant && !isAccountant) menu.myStore = myStore
  if (!isAttendant && !isAccountant) menu.finance = finance

  menu.orders = orders
  if (!isAttendant && !isAccountant) menu.inventory = inventory
  if (!isAttendant && !isAccountant) menu.integrations = integrations
  if (!isAttendant) menu.accountant = accountant

  return menu
}

const Drawer = () => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md'))

  const {
    app,
    updateApp: [updateApp]
  } = useApp()

  const { me } = useMe()
  const [delay, setDelay] = useState(null)

  useOrderSubscription({
    start: moment()
      .startOf('day')
      .toISOString()
  })
  useOrders({
    first: 0,
    skip: 0,
    start: moment()
      .startOf('day')
      .toISOString(),
    end: moment()
      .endOf('day')
      .toISOString(),
    status: [OrderStatus.open.type]
  })

  useEffect(() => {
    if (app.notification.newOrder) {
      setDelay(5000)
    } else {
      setDelay(null)
    }
  }, [app])

  useInterval(() => {
    if (delay) {
      audio.play()
    } else {
      audio.pause()
    }
  }, delay)

  const handleOpenItem = (key) => (event) => {
    updateApp({ drawer: { ...app.drawer, [key]: !app.drawer[key] } })
  }

  const handleOpenDialog = (key) => async () => {
    switch (key) {
      case 'openSignout':
        updateApp({ openSignout: true })
        break
      default:
        break
    }
  }

  const handleToggleDrawer = (event) => {
    const variables = { input: {} }

    if (upMedium) {
      variables.input.openDrawer = !app.openDrawer
    } else {
      variables.input.openDrawerMobile = !app.openDrawerMobile
    }

    updateApp(variables.input)
  }

  const renderList = (key) => {
    const item = items(me)[key]

    return (
      <Fragment key={key}>
        <Collapse
          in={upMedium ? app.openDrawer : app.openDrawerMobile}
          timeout='auto'
          unmountOnExit
        >
          <ListItem className={classes.listItem} button onClick={handleOpenItem(key)}>
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{ className: classes.listItemText }}
              secondary={
                app.drawer[key] ? '' : item.subitems?.map((subitem) => subitem.title).join(', ')
              }
              secondaryTypographyProps={{
                className: classes.listItemTextSecondary,
                variant: 'caption',
                noWrap: true
              }}
            />
            <ExpandLess
              style={{ transform: app.drawer[key] ? 'rotate(0)' : 'rotate(-180deg)' }}
              color='inherit'
            />
          </ListItem>
        </Collapse>
        <Collapse
          in={upMedium ? (app.openDrawer ? app.drawer[key] : true) : app.drawer[key]}
          timeout='auto'
          unmountOnExit
        >
          <List component='nav' disablePadding dense>
            {item.subitems?.map(renderItem)}
          </List>
        </Collapse>
        <Divider classes={{ root: classes.divider }} />
      </Fragment>
    )
  }

  const renderItem = (subitem) => {
    const { link, icon, title } = subitem

    let primary

    if (link === Paths.sales.path) {
      primary = (
        <Badge variant='dot' color='secondary' invisible={!app.notification.newOrder}>
          {title}
        </Badge>
      )
    } else {
      primary = title
    }

    return (
      <ListItem
        className={classes.listItem}
        key={title}
        button
        component={NavLink}
        to={link}
        onClick={upMedium ? null : handleToggleDrawer}
      >
        <ListItemIcon classes={{ root: classes.listItemIconRoot }}>{icon}</ListItemIcon>
        <ListItemText
          primary={primary}
          primaryTypographyProps={{ className: classes.listItemTextPrimary }}
        />
      </ListItem>
    )
  }

  const isAttendant = me.role === CompanyRoles.ATTENDANT

  return (
    <>
      <DrawerMaterial
        className={classNames(classes.root, {
          [classes.drawerOpen]: app.openDrawer,
          [classes.drawerClose]: !app.openDrawer
        })}
        classes={{
          paper: classNames(classes.paper, {
            [classes.drawerOpen]: app.openDrawer,
            [classes.drawerClose]: !app.openDrawer
          })
        }}
        variant={upMedium ? 'permanent' : 'temporary'}
        open={upMedium ? app.openDrawer : app.openDrawerMobile}
        onClose={handleToggleDrawer}
      >
        <List className={classes.list} component='nav' disablePadding>
          <ListItem button disableRipple component={NavLink} to='/myCompanies'>
            <ListItemIcon>
              <Mee height={28} />
            </ListItemIcon>
          </ListItem>
        </List>
        <Divider classes={{ root: classes.divider }} />
        {me && <div role='presentation'>{Object.keys(items(me))?.map(renderList)}</div>}
        <Spacer />
        <Divider classes={{ root: classes.divider }} />
        <List component='nav' dense>
          {!isAttendant && (
            <ListItem
              className={classes.listItem}
              button
              component={NavLink}
              to='/settings'
              onClick={upMedium ? null : handleToggleDrawer}
            >
              <ListItemIcon className={classes.listItemIcon}>
                <SettingsIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText
                primary='Configurações'
                primaryTypographyProps={{ className: classes.listItemTextPrimary }}
              />
            </ListItem>
          )}

          <ListItem className={classes.listItem} button onClick={handleOpenDialog('openSignout')}>
            <ListItemIcon className={classes.listItemIcon}>
              <Exit fontSize='small' />
            </ListItemIcon>
            <ListItemText
              primary='Sair'
              primaryTypographyProps={{ className: classes.listItemTextPrimary }}
            />
          </ListItem>
        </List>
        <Divider classes={{ root: classes.divider }} />
        <List component='nav' disablePadding>
          <ListItem className={classes.listItem}>
            <Typography variant='caption' color='inherit'>
              {process.env.REACT_APP_VERSION}
            </Typography>
            <Spacer />
            <IconButton size='small' color='inherit' onClick={handleToggleDrawer}>
              {theme.direction === 'rtl' ? (
                <ChevronLeftIcon
                  style={{
                    transform: upMedium
                      ? app.openDrawer
                        ? 'rotate(-180deg)'
                        : 'rotate(0)'
                      : app.openDrawerMobile
                      ? 'rotate(-180deg)'
                      : 'rotate(0)'
                  }}
                />
              ) : (
                <ChevronRightIcon
                  style={{
                    transform: upMedium
                      ? app.openDrawer
                        ? 'rotate(-180deg)'
                        : 'rotate(0)'
                      : app.openDrawerMobile
                      ? 'rotate(-180deg)'
                      : 'rotate(0)'
                  }}
                />
              )}
            </IconButton>
          </ListItem>
        </List>
      </DrawerMaterial>
      <SignoutDialog />
    </>
  )
}

Drawer.propTypes = {}

export default Drawer
