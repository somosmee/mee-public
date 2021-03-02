import React, { useContext, useEffect } from 'react'
import { Redirect } from 'react-router-dom'

import { useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import { useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Add from '@material-ui/icons/Add'

import Button from 'src/components/Button'
import Main from 'src/components/Main'
import Page from 'src/components/Page'

import LoggiSetupHeader from 'src/views/LoggiSetupView/LoggiSetupHeader'

import { CREATE_SETUP_SESSION } from 'src/graphql/billing/gqls'
import { UPDATE_LOGGI_CREDENTIALS } from 'src/graphql/loggi/queries'
import { OPEN_NOTIFICATION } from 'src/graphql/notification/queries'

import AppBarContext from 'src/contexts/AppBarContext'

import LoggiCredentialsForm from 'src/forms/LoggiCredentialsForm'

import useCompany from 'src/hooks/useCompany'

import { FirebaseEvents, Paths } from 'src/utils/enums'

import helpscout from 'src/services/helpscout'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const LoggiSetupView = () => {
  const stripe = window.Stripe(process.env.REACT_APP_STRIPE_API_KEY)

  /* STYLES */
  const classes = useStyles()
  const theme = useTheme()
  const upSmall = useMediaQuery(theme.breakpoints.up('sm'))

  const {
    getMyCompany: [getMyCompany, { data }]
  } = useCompany()
  const company = data?.myCompany

  const [, setAppBar] = useContext(AppBarContext)

  const [updateLoggiCredentials, { loading: loadingUpdateCredentials }] = useMutation(
    UPDATE_LOGGI_CREDENTIALS
  )
  const [openNotification] = useMutation(OPEN_NOTIFICATION)
  const [createSetupSession, { loading: loadingSession, data: dataSession }] = useMutation(
    CREATE_SETUP_SESSION
  )

  if (dataSession) {
    stripe
      .redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: dataSession.createSetupSession.session
      })
      .then(function(result) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
      })
  }

  useEffect(() => {
    const title = 'Delivery - Loggi Integração'
    setAppBar({
      overhead: false,
      color: '#6028C4',
      prominent: <LoggiSetupHeader />,
      title: title.toLowerCase()
    })
    document.title = 'Loggi | Mee'
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  useEffect(() => {
    helpscout.showBeacon()
  }, [])

  useEffect(() => {
    getMyCompany()
  }, [])

  const handleSetupPaymentMethod = () => {
    createSetupSession({ variables: { input: { screen: 'loggi' } } })
    analytics.logEvent(FirebaseEvents.BEGIN_SETUP_PAYMENT_METHOD)
  }

  const handleSubmit = async (input) => {
    try {
      await updateLoggiCredentials({ variables: { input } })
      analytics.logEvent(FirebaseEvents.SET_LOGGI_CREDENTIALS)
      openNotification({
        variables: {
          input: { variant: 'success', message: 'Salvo com sucesso!' }
        }
      })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const hasCard = company?.card

  if (hasCard && company?.loggi?.username && company?.loggi?.password) {
    return <Redirect to={Paths.loggi.path} />
  }

  return (
    <Page className={classes.root}>
      <Main header={false}>
        <Grid container spacing={3}>
          <Grid container item direction={'column'} alignItems={'center'} xs={12}>
            <Typography variant='h5' gutterBottom>
              Como funciona
            </Typography>
            <div className={classes.line}></div>
            <Card className={classes.root} variant='outlined'>
              <CardContent>
                <Button
                  startIcon={<Add />}
                  loading={loadingSession}
                  onClick={handleSetupPaymentMethod}
                  disabled={hasCard}
                >
                  {hasCard ? 'Forma de pagamento configurada ✅' : 'Configurar forma de pagamento'}
                </Button>
              </CardContent>
            </Card>
            <div className={classes.line}></div>
            <Card>
              <CardHeader
                title='Credenciais da Loggi'
                subheader={
                  <>
                    Adicione o login e senha da sua conta empresarial Loggi.{' '}
                    <Link
                      href='https://medium.com/@somosmee/plano-de-indica%C3%A7%C3%A3o-como-ganhar-dinheiro-sem-sair-de-casa-8286c6ee795c'
                      target='_blank'
                      rel='noreferrer'
                    >
                      Saiba mais aqui!
                    </Link>
                  </>
                }
              />
              <CardContent>
                <LoggiCredentialsForm
                  loggi={company?.loggi}
                  disabled={!hasCard}
                  onSubmit={handleSubmit}
                  actions={(submitting, pristine, invalid) => (
                    <Paper elevation={0}>
                      <CardActions>
                        <Button
                          type='submit'
                          variant='contained'
                          color='primary'
                          loading={loadingUpdateCredentials}
                          fullWidth={!upSmall}
                          disabled={!hasCard || submitting || pristine || invalid}
                        >
                          Salvar
                        </Button>
                      </CardActions>
                    </Paper>
                  )}
                />
              </CardContent>
            </Card>
            <div className={classes.line}></div>
            <Typography variant='h5' gutterBottom>
              Tudo pronto {'🚀'}
            </Typography>
          </Grid>
        </Grid>
      </Main>
    </Page>
  )
}

LoggiSetupView.propTypes = {
  user: PropTypes.object.isRequired
}

LoggiSetupView.defaultProps = {}

export default LoggiSetupView
