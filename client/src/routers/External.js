import React, { Suspense } from 'react'
import { Route } from 'react-router-dom'

import PropTypes from 'prop-types'

import Loading from 'src/components/Loading'
import Snackbar from 'src/components/Snackbar'

const ExternalPublicRoute = ({ component: Component, snackbar, ...props }) => {
  return (
    <Route {...props}>
      <Suspense fallback={<Loading drawer={false} />}>
        <Component />
      </Suspense>
      {snackbar && <Snackbar />}
    </Route>
  )
}

ExternalPublicRoute.propTypes = {
  component: PropTypes.func,
  snackbar: PropTypes.bool
}

ExternalPublicRoute.defaultProps = {
  snackbar: true
}

export default ExternalPublicRoute
