import React from 'react'
import { render } from 'react-dom'

import 'src/services/facebookPixel'

import { ApolloProvider } from '@apollo/react-hooks'
import client from 'src/apollo'
import * as serviceWorker from 'src/serviceWorker'

import AppRouter from 'src/routers/AppRouter'

import { TOKEN_KEY, PAYMENT_METHOD_KEY } from 'src/utils/constants'
import { load, save } from 'src/utils/localStorage'

import 'src/utils/moment'
import 'typeface-roboto'
import 'src/sentry'
import 'src/firebase'

// check if it's a first time user and set purchase to FALSE
if (!load(TOKEN_KEY)) {
  save(PAYMENT_METHOD_KEY, false)
}

const App = (
  <ApolloProvider client={client}>
    <AppRouter />
  </ApolloProvider>
)

render(App, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register()
