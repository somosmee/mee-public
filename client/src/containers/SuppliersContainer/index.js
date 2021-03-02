import React from 'react'

import PropTypes from 'prop-types'

import SuppliersView from 'src/views/SuppliersView'

const SuppliersContainer = () => {
  return <SuppliersView />
}

SuppliersContainer.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object
}

SuppliersContainer.defaultProps = {}

export default SuppliersContainer
