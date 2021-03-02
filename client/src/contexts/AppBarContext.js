import React, { createContext, useState } from 'react'

import PropTypes from 'prop-types'

import { SECONDARY_MAIN } from 'src/utils/constants'

const INITIAL_STATE = {
  prominent: false,
  overhead: false,
  color: SECONDARY_MAIN,
  title: ''
}

const AppBarContext = createContext([{}, () => {}])

const AppBarProvider = ({ children }) => {
  const [state, setState] = useState(INITIAL_STATE)

  return <AppBarContext.Provider value={[state, setState]}>{children}</AppBarContext.Provider>
}

AppBarProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
}

export { AppBarContext as default, AppBarProvider }
