import React, { useContext, useEffect, useState } from 'react'

import { useQuery, useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Chip from '@material-ui/core/Chip'
import Collapse from '@material-ui/core/Collapse'
import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Add from '@material-ui/icons/Add'
import Payment from '@material-ui/icons/Payment'

import MasterCard from 'src/icons/mastercard-icon'
import Visa from 'src/icons/visa-icon'

import Button from 'src/components/Button'
import List from 'src/components/List'
import Main from 'src/components/Main'
import Page from 'src/components/Page'
import Placeholder from 'src/components/Placeholder'

import { CREATE_SETUP_SESSION, RETRY_BILL_PAYMENT } from 'src/graphql/billing/gqls'
import { OPEN_NOTIFICATION } from 'src/graphql/notification/queries'
import { GET_ME } from 'src/graphql/user/queries'

import AppBarContext from 'src/contexts/AppBarContext'

import { PAYMENT_METHOD_KEY } from 'src/utils/constants'
import { FirebaseEvents, ChargeStatus } from 'src/utils/enums'
import { load, save } from 'src/utils/localStorage'
import numeral from 'src/utils/numeral'

import facebookPixel from 'src/services/facebookPixel'
import helpscout from 'src/services/helpscout'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const BillingView = () => {
  const stripe = window.Stripe(process.env.REACT_APP_STRIPE_API_KEY)
  const [, setAppBar] = useContext(AppBarContext)

  const hasPaymentMethod = load(PAYMENT_METHOD_KEY)

  /* STYLES */
  const theme = useTheme()
  const classes = useStyles()
  const upMedium = useMediaQuery(theme.breakpoints.up('md'))

  const xs = upMedium ? 6 : 12

  const [selectedBill, setSelectedBill] = useState(null)

  const [openNotification] = useMutation(OPEN_NOTIFICATION)
  const { data: dataMe } = useQuery(GET_ME, { fetchPolicy: 'network-only', pollInterval: 5000 })
  const [createSetupSession, { loading: loadingSession, data: dataSession }] = useMutation(
    CREATE_SETUP_SESSION
  )
  const [retryBillPayment, { loading: loadingRetryPayment }] = useMutation(RETRY_BILL_PAYMENT)

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
    const title = 'Cobranças'
    setAppBar({ prominent: false, overhead: false, color: 'white', title: title.toLowerCase() })
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  useEffect(() => {
    helpscout.showBeacon()
  })

  const hasCard = dataMe?.me?.card
  const card = hasCard && dataMe.me.card

  const billingHistory = dataMe?.me?.billingHistory

  if (hasCard && !hasPaymentMethod) {
    analytics.logEvent(FirebaseEvents.SETUP_PAYMENT_METHOD)
    facebookPixel.track('AddPaymentInfo')
    save(PAYMENT_METHOD_KEY, true)
  }

  const handleSetupPaymentMethod = () => {
    createSetupSession()
    analytics.logEvent(FirebaseEvents.BEGIN_SETUP_PAYMENT_METHOD)
  }

  const handleRetryPayment = async (bill) => {
    setSelectedBill(bill._id)
    try {
      await retryBillPayment({ variables: { userBillId: bill._id } })
      analytics.logEvent(FirebaseEvents.RETRY_PAYMENT)
      openNotification({
        variables: { input: { variant: 'success', message: 'Pagamento realizado com sucesso!' } }
      })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleAction = (action, bill) => () => {
    switch (action) {
      case 'retryPayment':
        handleRetryPayment(bill)
        break
      default:
        break
    }
  }

  const actions = [
    {
      startIcon: <Add />,
      label: 'Configurar forma de pagamento',
      onClick: handleSetupPaymentMethod,
      variant: 'outlined',
      color: 'primary',
      target: '_blank'
    }
  ]

  const placeholder = (
    <Placeholder
      icon={<Payment />}
      message={'Você ainda não tem uma forma de pagamento configurada'}
      symbol={'👋'}
      actions={actions}
    />
  )

  return (
    <Page className={classes.root}>
      <Main placeholder={loadingSession || hasCard ? null : placeholder}>
        <Grid container spacing={3}>
          {hasCard && (
            <Grid item xs={xs}>
              <Card>
                <CardHeader title='Forma de pagamento' />
                <CardContent>
                  <div>
                    {card.brand === 'mastercard' && <MasterCard width={80} height={80} />}
                    {card.brand === 'visa' && <Visa width={80} height={80} />}
                  </div>
                  <div>
                    <Typography variant='h6'>•••• •••• •••• {card.last4}</Typography>
                    <Typography variant='body2' color='textSecondary' component='p'>
                      Expira em {card.expMonth}/{card.expYear && card.expYear.slice(2, 4)}
                    </Typography>
                  </div>
                </CardContent>
                <CardActions>
                  <Button onClick={handleSetupPaymentMethod} size='big' color='primary'>
                    Editar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )}
          {billingHistory && billingHistory.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardHeader title='Histórico de cobrança' />
                <CardContent>
                  <List
                    labels={[
                      {
                        key: ['createdAt'],
                        name: 'Data',
                        type: 'date',
                        format: 'DD-MM-YYYY'
                      },
                      {
                        key: ['status'],
                        name: 'Status',
                        // eslint-disable-next-line
                        render: (value) => (
                          <Chip
                            key={value}
                            className={classes[value]}
                            size='small'
                            variant='outlined'
                            label={ChargeStatus[value].label}
                          />
                        )
                      },
                      {
                        key: ['total'],
                        name: 'Total',
                        type: 'currency'
                      }
                    ]}
                    items={billingHistory}
                    getItemTitle={(item) => item.createdAt.toDate()}
                    getItemAdornmentTitle={(item) => ChargeStatus[item.status].label}
                    getItemSubtitle={(item) => numeral(item.total).format('$ 0.00')}
                    getItemDisabled={(item) => item.status === ChargeStatus.success.type}
                    renderActions={(item, index, disabled) => (
                      <Button
                        disabled={disabled}
                        loading={loadingRetryPayment && selectedBill === item._id}
                        onClick={handleAction('retryPayment', item)}
                        size='small'
                        type='contained'
                        color='primary'
                      >
                        PAGAR
                      </Button>
                    )}
                    renderCollapse={(item, index, disabled, open) => (
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                          <Collapse in={open} timeout='auto' unmountOnExit>
                            <Box margin={1}>
                              <Typography variant='h6' gutterBottom component='div'>
                                Detalhe da cobrança
                              </Typography>
                              <Table size='small' aria-label='purchases'>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>ID Pedido</TableCell>
                                    <TableCell>Total Pedido</TableCell>
                                    <TableCell align='right'>Taxa</TableCell>
                                    <TableCell align='right'>Total Taxa (R$)</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {item?.items.map((historyRow) => (
                                    <TableRow key={historyRow.order._id}>
                                      <TableCell component='th' scope='row'>
                                        {historyRow.order._id}
                                      </TableCell>
                                      <TableCell>
                                        {numeral(historyRow.totalOrder).format('$ 0.00')}
                                      </TableCell>
                                      <TableCell align='right'>
                                        {numeral(historyRow.fee).format('0 %')}
                                      </TableCell>
                                      <TableCell align='right'>
                                        {numeral(historyRow.totalFee).format('$ 0.00')}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  />
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Main>
    </Page>
  )
}

BillingView.propTypes = {
  location: PropTypes.any,
  user: PropTypes.any
}

export default BillingView
