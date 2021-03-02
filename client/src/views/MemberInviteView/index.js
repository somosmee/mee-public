import React, { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

import { useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'

import { GET_APP, UPDATE_APP } from 'src/graphql/app/queries'
import { GET_ME } from 'src/graphql/user/queries'

import useCompany from 'src/hooks/useCompany'

import { TOKEN_KEY, PAYMENT_METHOD_KEY } from 'src/utils/constants'
import { Paths, FirebaseEvents } from 'src/utils/enums'
import { save } from 'src/utils/localStorage'
import { getSearch } from 'src/utils/url'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const MemberInviteView = () => {
  const classes = useStyles()

  const location = useLocation()
  const history = useHistory()

  const {
    acceptInvite: [acceptInvite]
  } = useCompany()

  const options = {
    refetchQueries: [{ query: GET_APP }, { query: GET_ME }],
    awaitRefetchQueries: true
  }

  const [updateApp] = useMutation(UPDATE_APP, options)

  useEffect(() => {
    const title = 'Convite'
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [])

  useEffect(() => {
    const { inviteToken, company, user } = getSearch(location)

    const input = {
      inviteToken,
      company,
      user
    }

    async function validateInvite() {
      try {
        const { token, signup, company } = await acceptInvite(input)
        save(TOKEN_KEY, token)

        // check if already has payment method
        if (company.subscription) {
          save(PAYMENT_METHOD_KEY, true)
        }

        await updateApp({ variables: { input: { logged: true, signup } } })

        history.push(Paths.profile.path)
      } catch ({ message }) {
        console.log('ERROR:', message)
      }
    }

    validateInvite()
  }, [])

  return (
    <main className={classes.root}>
      <Grid container spacing={2} direction='column' justify='center' alignItems='center'>
        <Grid item>
          <CircularProgress />
        </Grid>
        <Grid item>Validando o seu convite...</Grid>
      </Grid>
    </main>
  )
}

MemberInviteView.propTypes = {
  location: PropTypes.object
}

export default MemberInviteView
