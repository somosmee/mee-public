import React, { useContext, cloneElement } from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import AppBarContext from 'src/contexts/AppBarContext'

import useApp from 'src/hooks/useApp'

import useStyles from './styles'
const Page = ({ children, toolbar }) => {
  const classes = useStyles()

  const [appBar] = useContext(AppBarContext)
  const { app } = useApp()

  return (
    <div
      className={classNames(classes.root, {
        [classes.rootOpen]: app.openDrawer,
        [classes.rootClose]: !app.openDrawer
      })}
    >
      {cloneElement(children, {
        className: classNames({ [classes.children]: appBar.overhead })
      })}
    </div>
  )
}

Page.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  toolbar: PropTypes.bool
}

Page.defaultProps = {
  toolbar: true
}

export default Page
