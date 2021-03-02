import React, { Suspense } from 'react'
import { Route, Redirect } from 'react-router-dom'

import flat from 'flat'
import PropTypes from 'prop-types'

import AppBar from 'src/components/AppBar'
import BottomNavigation from 'src/components/BottomNavigation'
import Drawer from 'src/components/Drawer'
import Error from 'src/components/Error'
import Loading from 'src/components/Loading'

import { AppBarProvider } from 'src/contexts/AppBarContext'

import useApp from 'src/hooks/useApp'
import useMe from 'src/hooks/useMe'

import { Paths, Roles } from 'src/utils/enums'

import { analytics } from 'src/firebase'

const PrivateRoute = ({ component: Component, noNavigation, ...props }) => {
  const { loading: appLoading, app } = useApp()
  const { loading: meLoading, error: meError, me } = useMe()

  if (!app.logged || (app.logged && meError)) return <Redirect to={Paths.home.path} />

  if (appLoading || meLoading) return null
  if (meError) return <Error message='Ops... Alguma coisa deu errado' />

  let hasPermission = false

  analytics.setUserId(me._id)
  analytics.setUserProperties({ ...flat(me), appVersion: process.env.REACT_APP_VERSION })

  /* PERMISSIONS REDIRECT */
  hasPermission =
    me.role === Roles.admin.type ||
    me.role === Roles.employer.type ||
    me.role === Roles.accountant.type ||
    (me.role === Roles.employee.type && me.employer)

  if (!hasPermission) {
    if (me.role === Roles.employee.type && !me.employer) {
      return <Redirect to={Paths.waitForEmployer.path} />
    } else {
      if (me.role === Roles.employer.type) {
        return <Redirect to={Paths.reports.path} />
      }

      if (me.role === Roles.employee.type) {
        return <Redirect to={Paths.sales.path} />
      }
    }
  }

  return (
    <Route {...props}>
      <AppBarProvider>
        {noNavigation && <AppBar hasDrawer={false} />}
        {!noNavigation && (
          <>
            <AppBar />
            <Drawer />
            <BottomNavigation />
          </>
        )}
        <Suspense fallback={<Loading />}>
          <Component />
        </Suspense>
      </AppBarProvider>
    </Route>
  )
}

PrivateRoute.propTypes = {
  component: PropTypes.func,
  noNavigation: PropTypes.bool
}

export default PrivateRoute
