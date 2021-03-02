import React from 'react'

import PropTypes from 'prop-types'

import SupportView from 'src/views/SupportView'

const SupportContainer = () => {
  return <SupportView />
}

SupportContainer.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object
}

SupportContainer.defaultProps = {}

export default SupportContainer
