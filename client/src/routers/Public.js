import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import PropTypes from 'prop-types'

import Snackbar from 'src/components/Snackbar'

import useApp from 'src/hooks/useApp'
import useMe from 'src/hooks/useMe'

import { Paths } from 'src/utils/enums'
const PublicRoute = ({ component: Component, ...props }) => {
  const { app } = useApp()
  const { me } = useMe()

  if (app.logged && me) {
    return <Redirect to={Paths.myCompanies.path} />
  }

  return (
    <Route {...props}>
      <Component />
      <Snackbar />
    </Route>
  )
}

PublicRoute.propTypes = {
  component: PropTypes.func
}

export default PublicRoute
