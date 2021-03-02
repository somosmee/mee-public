import React, { useContext, useEffect } from 'react'
import { Redirect } from 'react-router-dom'

import { useMutation } from '@apollo/react-hooks'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Add from '@material-ui/icons/Add'

import Button from 'src/components/Button'
import Main from 'src/components/Main'
import Page from 'src/components/Page'

import IfoodSetupHeader from 'src/views/IfoodSetupView/IfoodSetupHeader'

import { CREATE_SETUP_SESSION } from 'src/graphql/billing/gqls'
import { TOGGLE_OPEN_STATUS, UPDATE_IFOOD_CREDENTIALS } from 'src/graphql/ifood/queries'
import { OPEN_NOTIFICATION } from 'src/graphql/notification/queries'

import AppBarContext from 'src/contexts/AppBarContext'

import IfoodCredentialsForm from 'src/forms/IfoodCredentialsForm'

import useCompany from 'src/hooks/useCompany'
import useUserAddress from 'src/hooks/useUserAddress'

import { FirebaseEvents, Paths } from 'src/utils/enums'

import helpscout from 'src/services/helpscout'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const IfoodSetupView = () => {
  const stripe = window.Stripe(process.env.REACT_APP_STRIPE_API_KEY)

  /* STYLES */
  const classes = useStyles()
  const theme = useTheme()
  const upSmall = useMediaQuery(theme.breakpoints.up('sm'))

  const {
    getMyCompany: [getMyCompany, { data }]
  } = useCompany()
  const company = data?.myCompany

  const { UpsertAddressForm, addressProps } = useUserAddress(company?.address)
  const [, setAppBar] = useContext(AppBarContext)
  const [toggleOpenStatus] = useMutation(TOGGLE_OPEN_STATUS)
  const [updateIfoodCredentials, { loading }] = useMutation(UPDATE_IFOOD_CREDENTIALS)
  const [openNotification] = useMutation(OPEN_NOTIFICATION)
  const [createSetupSession, { loading: loadingSession, data: dataSession }] = useMutation(
    CREATE_SETUP_SESSION
  )

  /* REACT STATE */

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
    const title = 'Delivery - iFood Integração'
    setAppBar({
      overhead: false,
      color: '#E6532A',
      prominent: <IfoodSetupHeader />,
      title: title.toLowerCase()
    })
    document.title = 'iFood | Mee'
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  useEffect(() => {
    helpscout.showBeacon()
  }, [])

  useEffect(() => {
    getMyCompany()
  }, [])

  const handleSetupPaymentMethod = () => {
    createSetupSession({ variables: { input: { screen: 'ifood' } } })
    analytics.logEvent(FirebaseEvents.BEGIN_SETUP_PAYMENT_METHOD)
  }

  const handleToggleSync = async (input) => {
    try {
      await toggleOpenStatus({ variables: { input } })
      analytics.logEvent(FirebaseEvents.SET_SYNC_IFOOD, { value: input.open })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleSubmit = async (input) => {
    try {
      await updateIfoodCredentials({ variables: { input } })
      analytics.logEvent(FirebaseEvents.SET_IFOOD_CREDENTIALS)
      openNotification({
        variables: {
          input: { variant: 'success', message: 'Salvo com sucesso!' }
        }
      })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const hasAddress = company?.address?.number
  const hasCard = company?.card
  const ifood = company?.ifood

  if (hasCard && hasAddress && ifood?.username && ifood?.password) {
    return <Redirect to={Paths.ifood.path} />
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
            <Card className={classes.cardCredentials}>
              <CardHeader title={'2 - Endereço do estabelecimento'} />
              <CardContent>
                <UpsertAddressForm {...addressProps} />
              </CardContent>
            </Card>
            <div className={classes.line}></div>
            <Card className={classes.cardCredentials}>
              <CardHeader title={'3 - Credenciais do iFood'} />
              <CardContent>
                <IfoodCredentialsForm
                  ifood={company?.ifood}
                  onOpenToggle={handleToggleSync}
                  disabled={!hasCard}
                  actions={(submitting, pristine, invalid) => (
                    <Paper elevation={0}>
                      <CardActions>
                        <Button
                          type='submit'
                          variant='contained'
                          color='primary'
                          loading={loading}
                          fullWidth={!upSmall}
                          disabled={!hasAddress || !hasCard || submitting || pristine || invalid}
                        >
                          Salvar
                        </Button>
                      </CardActions>
                    </Paper>
                  )}
                  onSubmit={handleSubmit}
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

IfoodSetupView.propTypes = {}

IfoodSetupView.defaultProps = {}

export default IfoodSetupView
