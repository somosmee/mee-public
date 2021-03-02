import React from 'react'

import { useQuery, useMutation } from '@apollo/react-hooks'

import Page from 'src/components/Page'

import CheckoutView from 'src/views/CheckoutView'
import OrdersView from 'src/views/OrdersView'

import { SETTINGS_OPTIONS_KEY } from 'src/graphql/settings/constants'
import { GET_SETTINGS, SET_SETTINGS } from 'src/graphql/settings/queries'

import { SalesTypes } from 'src/utils/enums'
import { save } from 'src/utils/localStorage'

import useStyles from './styles'

const SalesView = () => {
  const classes = useStyles()

  const {
    data: { settings }
  } = useQuery(GET_SETTINGS)
  const [setSettings] = useMutation(SET_SETTINGS)

  const handleToggleChange = async (event, salesType) => {
    if (!salesType) return

    const {
      data: {
        setSettings: { options }
      }
    } = await setSettings({ variables: { option: 'salesType', value: salesType } })

    save(SETTINGS_OPTIONS_KEY, options)
  }

  let currentView = <></>

  if (settings.options.salesType === SalesTypes.checkout) {
    currentView = <CheckoutView onToggleChange={handleToggleChange} />
  } else if (settings.options.salesType === SalesTypes.orders) {
    currentView = <OrdersView onToggleChange={handleToggleChange} />
  }

  return <Page className={classes.root}>{currentView}</Page>
}

SalesView.propTypes = {}

SalesView.defaultProps = {}

export default SalesView
