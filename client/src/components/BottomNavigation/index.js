import React from 'react'
import { useLocation, useHistory } from 'react-router-dom'

import { useMutation } from '@apollo/react-hooks'
import classNames from 'classnames'

import BottomNavigationBase from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import BarChart from '@material-ui/icons/BarChart'
import MoreHoriz from '@material-ui/icons/MoreHoriz'
import Receipt from '@material-ui/icons/Receipt'
import ShoppingBasket from '@material-ui/icons/ShoppingBasket'

import { UPDATE_APP } from 'src/graphql/app/queries'

import useApp from 'src/hooks/useApp'
import useMe from 'src/hooks/useMe'

import { Paths, CompanyRoles } from 'src/utils/enums'

import useStyles from './styles'

const BottomNavigation = () => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md'))

  const { me } = useMe()

  const { pathname } = useLocation()
  const history = useHistory()
  const { app } = useApp()
  const [updateApp] = useMutation(UPDATE_APP)

  const handleChange = (event, newValue) => {
    if (newValue === 'more') {
      updateApp({ variables: { input: { openDrawerMobile: !app.openDrawerMobile } } })
    } else if (newValue !== pathname) {
      history.push(newValue)
    }
  }

  const isAttendant = me.role === CompanyRoles.ATTENDANT

  if (upMedium) return null

  return (
    <BottomNavigationBase
      className={classNames(classes.root, {
        [classes.rootOpen]: app.openDrawer,
        [classes.rootClose]: !app.openDrawer
      })}
      value={pathname}
      onChange={handleChange}
      showLabels
    >
      <BottomNavigationAction
        label={Paths.sales.label}
        value={Paths.sales.path}
        icon={<Receipt />}
      />
      <BottomNavigationAction
        label={Paths.products.label}
        value={Paths.products.path}
        icon={<ShoppingBasket />}
      />
      {!isAttendant && (
        <BottomNavigationAction
          label={Paths.reports.label}
          value={Paths.reports.path}
          icon={<BarChart />}
        />
      )}

      <BottomNavigationAction label='Mais' value='more' icon={<MoreHoriz />} />
    </BottomNavigationBase>
  )
}

BottomNavigation.propTypes = {}

export default BottomNavigation
