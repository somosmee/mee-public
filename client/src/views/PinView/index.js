import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { useMutation } from '@apollo/react-hooks'
import classNames from 'classnames'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import EmailIcon from '@material-ui/icons/EmailOutlined'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'

import Mee from 'src/icons/mee'

import Link from 'src/components/Link'

import { GET_APP, UPDATE_APP } from 'src/graphql/app/queries'
import { OPEN_NOTIFICATION } from 'src/graphql/notification/queries'
import { GET_ME, SIGN_IN } from 'src/graphql/user/queries'

import PinForm from 'src/forms/PinForm'

import { TOKEN_KEY } from 'src/utils/constants'
import { FirebaseEvents, Paths } from 'src/utils/enums'
import { save } from 'src/utils/localStorage'
import { getSearch } from 'src/utils/url'

import facebookPixel from 'src/services/facebookPixel'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const PinView = () => {
  const classes = useStyles()

  const history = useHistory()

  const location = useLocation()
  const { referral } = getSearch(location)

  const options = {
    refetchQueries: [{ query: GET_APP }, { query: GET_ME }],
    awaitRefetchQueries: true
  }
  const [signin, { loading }] = useMutation(SIGN_IN)
  const [openNotification] = useMutation(OPEN_NOTIFICATION)
  const [updateApp] = useMutation(UPDATE_APP, options)

  useEffect(() => {
    const title = 'Pin'
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
    facebookPixel.pageView()
  }, [])

  const { state } = location

  const handleSubmit = async ({ pin }) => {
    if (!state?.email) {
      return openNotification({
        variables: { input: { variant: 'error', message: 'Volte e preencha o e-mail' } }
      })
    }

    if (pin) {
      const { email } = state
      const input = { referral, email, pin }

      try {
        const {
          data: {
            signin: { token, signup }
          }
        } = await signin({ variables: { input } })
        save(TOKEN_KEY, token)

        // send login / signup event
        if (signup) {
          analytics.logEvent(FirebaseEvents.SIGNUP, { method: 'email' })
          // Google Ads
          // window.gtag('event', 'conversion', {
          //   send_to: 'AW-601768707/ku3SCPyGx-IBEIOG-Z4C'
          // })
          // Facebook Ads
          // https://developers.facebook.com/docs/facebook-pixel/reference#standard-events
          facebookPixel.track('Lead', { content_category: 'email' })
        } else {
          analytics.logEvent(FirebaseEvents.LOGIN, { method: 'email' })
        }

        // check if already has payment method
        // if (company?.subscription) {
        //   save(PAYMENT_METHOD_KEY, true)
        // }

        await updateApp({ variables: { input: { logged: true, signup } } })
      } catch ({ message }) {
        openNotification({ variables: { input: { variant: 'error', message } } })
      }
    }
  }

  const handleBack = () => {
    history.push(Paths.emailSignin.path)
  }

  return (
    <main className={classes.root}>
      <div className={classes.container}>
        <Grid container alignItems='flex-start' spacing={3}>
          <Grid className={classes.marginTop} container item xs={12} md={6}>
            <Grid item xs={12}>
              <a href='https://www.somosmee.com/'>
                <Mee />
              </a>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classNames(classes.hello, classes.white)} variant='h6'>
                <b>Olá!</b> Entra, fica à vontade.
              </Typography>
              <Typography className={classNames(classes.mee, classes.white)} variant='h6'>
                Somos Mee: a solução mais simples para o seu ponto de venda.
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} component={Card}>
            <Grid
              classes={{ root: classes.card }}
              container
              item
              component={CardContent}
              justify='center'
              spacing={10}
            >
              <Grid className={classes.gridItem} item xs={12}>
                <Link startIcon={<KeyboardArrowLeft />} onClick={handleBack}>
                  Voltar
                </Link>
                <Typography className={classes.purple} variant='h4'>
                  <b>Insira seu PIN</b>
                </Typography>
                <Grid item container justify='center'>
                  <EmailIcon className={classes.icon} />
                </Grid>
                <Typography variant='body1'>
                  Enviamos para o seu <b>email</b> um código de 4 dígitos!
                </Typography>
                <Grid className={classes.email} item container justify='center'>
                  <Typography variant='body1'>
                    <b>{state?.email}</b>
                  </Typography>
                </Grid>
              </Grid>
              <Grid container item spacing={2} justify='center'>
                <PinForm onSubmit={handleSubmit} />
                <Grid item>{loading && <CircularProgress />}</Grid>
              </Grid>
              <Grid className={classes.gridItem} item xs={12}>
                <Typography variant='caption'>
                  Ao continuar, você concorda com os Termos de Serviço e com a Política de
                  Privacidade da Mee
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </main>
  )
}

export default PinView
