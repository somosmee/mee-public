import React from 'react'

import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'

const TabPanel = ({ children, value, tab, component, ...props }) => {
  const Component = component ?? 'div'

  return (
    <Component role='tabpanel' hidden={value !== tab} {...props}>
      {value === tab && <Box mt={2}>{children}</Box>}
    </Component>
  )
}

TabPanel.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  value: PropTypes.string,
  tab: PropTypes.string,
  component: PropTypes.element
}

TabPanel.defaultProps = {}

export default TabPanel
