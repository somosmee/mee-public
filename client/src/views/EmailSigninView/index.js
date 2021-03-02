import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { useMutation } from '@apollo/react-hooks'
import classNames from 'classnames'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Mee from 'src/icons/mee'

import { SEND_PIN } from 'src/graphql/user/queries'
import { OPEN_NOTIFICATION } from 'src/graphql/notification/queries'

import EmailSigninForm from 'src/forms/EmailSigninForm'

import { FirebaseEvents, Paths } from 'src/utils/enums'

import facebookPixel from 'src/services/facebookPixel'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const EmailSigninView = () => {
  const classes = useStyles()

  const history = useHistory()

  const [sendPin, { loading }] = useMutation(SEND_PIN)
  const [openNotification] = useMutation(OPEN_NOTIFICATION)

  useEffect(() => {
    const title = 'Login Email'
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
    facebookPixel.pageView()
  }, [])

  const handleSendPin = async (input) => {
    try {
      await sendPin({ variables: { input } })
      analytics.logEvent(FirebaseEvents.SEND_PIN)
      history.push({ pathname: Paths.pin.path, state: { email: input.email } })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleSubmit = (values) => {
    handleSendPin(values)
  }

  const handleRedirectGoogleSignin = () => {
    history.push(Paths.googleSignin.path)
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
              <Grid item xs={12}>
                <Typography className={classes.purple} variant='h4'>
                  <b>Entrar</b>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <EmailSigninForm loading={loading} onSubmit={handleSubmit} />
                <div className={classes.link}>
                  <Button color='primary' onClick={handleRedirectGoogleSignin}>
                    Entrar com o google
                  </Button>
                </div>
              </Grid>
              <Grid item xs={12}>
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

export default EmailSigninView
