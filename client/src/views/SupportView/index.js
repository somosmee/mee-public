import React, { useContext, useEffect } from 'react'

import { useQuery, useMutation } from '@apollo/react-hooks'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Main from 'src/components/Main'
import Page from 'src/components/Page'

import { CREATE_SUPPORT_CHECKOUT_SESSION } from 'src/graphql/billing/gqls'
import { GET_MY_COMPANY } from 'src/graphql/company/queries'

import AppBarContext from 'src/contexts/AppBarContext'

import { FirebaseEvents } from 'src/utils/enums'

import helpscout from 'src/services/helpscout'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const SupportView = () => {
  const stripe = window.Stripe(process.env.REACT_APP_STRIPE_API_KEY)
  const [, setAppBar] = useContext(AppBarContext)

  /* STYLES */
  const classes = useStyles()

  const { data: dataCompany } = useQuery(GET_MY_COMPANY, {
    fetchPolicy: 'network-only',
    pollInterval: 5000
  })
  const [createSession, { data: dataSession }] = useMutation(CREATE_SUPPORT_CHECKOUT_SESSION)

  if (dataSession) {
    stripe
      .redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: dataSession.createSupportCheckoutSession.session
      })
      .then(function(result) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
      })
  }

  useEffect(() => {
    const title = 'Assistência e Suporte'
    setAppBar({ prominent: false, overhead: false, color: 'white', title: title.toLowerCase() })
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  useEffect(() => {
    helpscout.showBeacon()
  })

  const handleSetupStandardPlan = () => {
    createSession({ variables: { input: { planType: 'standard' } } })
  }

  const handleSetupPremiumPlan = () => {
    createSession({ variables: { input: { planType: 'premium' } } })
  }

  const hasSubscribedToStandard =
    dataCompany?.myCompany?.subscription?.plan?.id === process.env.REACT_APP_STRIPE_STANDARD_PLAN
  const hasSubscribedToPremium =
    dataCompany?.myCompany?.subscription?.plan?.id === process.env.REACT_APP_STRIPE_PREMIUM_PLAN
  const hasSubscription = hasSubscribedToStandard || hasSubscribedToPremium

  return (
    <Page className={classes.root}>
      <Main>
        <Grid container spacing={3} justify='center' alignItems='baseline'>
          <Grid item>
            <Card className={classes.card}>
              <CardHeader title='Iniciante' subheader='Grátis' />
              <CardContent>
                <Typography variant='overline' display='block' gutterBottom>
                  Financeiro
                </Typography>
                <Divider />
                <ul>
                  <Typography variant='body2' color='secondaryColor' component='li'>
                    Relatório simples de vendas
                  </Typography>
                </ul>
                <Typography variant='overline' display='block' gutterBottom>
                  Vendas
                </Typography>
                <Divider />
                <ul>
                  <Typography variant='body2' component='li'>
                    Gerenciamento de pedidos e vendas
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Emissão de Nota Fiscal
                  </Typography>
                </ul>
                <Typography variant='overline' display='block' gutterBottom>
                  Clientes
                </Typography>
                <Divider />
                <ul>
                  <Typography variant='body2' component='li'>
                    Gerenciamento cadastro de clientes
                  </Typography>
                </ul>
                <Typography variant='overline' display='block' gutterBottom>
                  Estoque
                </Typography>
                <Divider />
                <ul>
                  <Typography variant='body2' component='li'>
                    Gerenciamento de produtos e estoque
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Entrada de estoque automática com cupom fiscal da compra
                  </Typography>
                </ul>
                <Typography variant='overline' display='block' gutterBottom>
                  Integrações
                </Typography>
                <Divider />
                <ul>
                  <Typography variant='body2' component='li'>
                    Integração Vitrine Digital
                  </Typography>
                </ul>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card className={classes.card} elevation={6}>
              <CardHeader title='Profissional 🚀' subheader='R$ 149,90 por mês (mais vendido)' />
              <CardContent>
                <Typography variant='overline' display='block' gutterBottom>
                  Financeiro
                </Typography>
                <Divider />
                <ul>
                  <Typography variant='body2' component='li'>
                    Relatório completo de <b>fluxo de caixa</b>
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Controle de <b>despesas</b>
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Controle de <b>faturamento</b>
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Importação automática de despesas com cupom fiscal
                  </Typography>
                </ul>
                <Typography variant='overline' display='block' gutterBottom>
                  Vendas
                </Typography>
                <Divider />
                <ul>
                  <Typography variant='body2' component='li'>
                    Gerenciamento de pedidos e vendas
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Emissão de Nota Fiscal
                  </Typography>
                  <Typography variant='body2' color='secondaryColor' component='li'>
                    Relatório ticket médio
                  </Typography>
                </ul>
                <Typography variant='overline' display='block' gutterBottom>
                  Clientes
                </Typography>
                <Divider />
                <ul>
                  <Typography variant='body2' component='li'>
                    Gerenciamento de clientes
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Histórico de vendas por cliente
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Gerenciamento de fidelização (em breve)
                  </Typography>
                </ul>
                <Typography variant='overline' display='block' gutterBottom>
                  Estoque
                </Typography>
                <Divider />
                <ul>
                  <Typography variant='body2' component='li'>
                    {' '}
                    Gerenciamento de produtos e estoque
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Alerta de estoque mínimo
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Entrada de estoque automática com cupom fiscal da compra
                  </Typography>
                </ul>
                <Typography variant='overline' display='block' gutterBottom>
                  Integrações
                </Typography>
                <Divider />
                <ul>
                  <Typography variant='body2' component='li'>
                    Integração com iFood
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Integração com Loggi
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Integração Vitrine Digital
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Integração com iFood mercado (em breve)
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Integração com UberEats (em breve)
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Integração com Rappi (em breve)
                  </Typography>
                </ul>
              </CardContent>
              <CardActions>
                {hasSubscribedToStandard && (
                  <Button
                    onClick={handleSetupStandardPlan}
                    size='large'
                    variant='outlined'
                    color='primary'
                    disabled
                  >
                    {'VOCÊ ASSINOU PLANO PROFISSIONAL ✅'}
                  </Button>
                )}
                {!hasSubscription && (
                  <Button
                    onClick={handleSetupStandardPlan}
                    size='large'
                    variant='outlined'
                    color='primary'
                  >
                    ASSINAR PLANO PROFISSIONAL
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
          <Grid item>
            <Card className={classes.card}>
              <CardHeader title='Premium ✨🔮' subheader='R$ 499,90 por mês' />
              <CardContent>
                <Typography variant='overline' display='block' gutterBottom>
                  Organização
                </Typography>
                <Divider />
                <ul>
                  <Typography variant='body2' component='li'>
                    Gerenciamento de múltiplos <b>perfis</b> e <b>permissões</b> na plataforma
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Gerenciamento multi lojas
                  </Typography>
                </ul>
                <Typography variant='overline' display='block' gutterBottom>
                  Financeiro
                </Typography>
                <Divider />
                <ul>
                  <Typography variant='body2' component='li'>
                    Relatório completo de <b>fluxo de caixa</b>
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Controle de <b>despesas</b>
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Controle de <b>faturamento</b>
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Importação automática de despesas com cupom fiscal
                  </Typography>
                </ul>
                <Typography variant='overline' display='block' gutterBottom>
                  Vendas
                </Typography>
                <Divider />
                <ul>
                  <Typography variant='body2' component='li'>
                    Gerenciamento de pedidos e vendas
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Emissão de Nota Fiscal
                  </Typography>
                  <Typography variant='body2' color='secondaryColor' component='li'>
                    Relatório ticket médio
                  </Typography>
                </ul>
                <Typography variant='overline' display='block' gutterBottom>
                  Clientes
                </Typography>
                <Divider />
                <ul>
                  <Typography variant='body2' component='li'>
                    Gerenciamento de clientes
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Histórico de vendas por cliente
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Gerenciamento de fidelização (em breve)
                  </Typography>
                </ul>
                <Typography variant='overline' display='block' gutterBottom>
                  Estoque
                </Typography>
                <Divider />
                <ul>
                  <Typography variant='body2' component='li'>
                    {' '}
                    Gerenciamento de produtos e estoque
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Alerta de estoque mínimo
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Entrada de estoque automática com cupom fiscal da compra
                  </Typography>
                </ul>
                <Typography variant='overline' display='block' gutterBottom>
                  Integrações
                </Typography>
                <Divider />
                <ul>
                  <Typography variant='body2' component='li'>
                    Integração com iFood
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Integração com Loggi
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Integração Vitrine Digital
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Integração com iFood mercado (em breve)
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Integração com UberEats (em breve)
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Integração com Rappi (em breve)
                  </Typography>
                </ul>
                <Typography variant='overline' display='block' gutterBottom>
                  VIP
                </Typography>
                <Divider />
                <ul>
                  <Typography variant='body2' component='li'>
                    <b>Conteúdo exclusivo</b> sobre negócio e finanças
                  </Typography>
                  <Typography variant='body2' component='li'>
                    Atendimento por <b>vídeo chamada</b>
                  </Typography>
                  <Typography variant='body2' component='li'>
                    <b>Treinamentos</b> para toda equipe
                  </Typography>
                  <Typography variant='body2' component='li'>
                    <b>Prorização no atendimento</b> e solução de problema
                  </Typography>
                  <Typography variant='body2' component='li'>
                    <b>Consultoria de negócio</b> e acompanhamento dos indicadores do seu negócio
                  </Typography>
                </ul>
              </CardContent>
              <CardActions>
                {hasSubscribedToPremium && (
                  <Button
                    onClick={handleSetupPremiumPlan}
                    size='large'
                    variant='outlined'
                    color='primary'
                    disabled
                  >
                    {'VOCÊ ASSINOU PLANO PREMIUM ✅'}
                  </Button>
                )}
                {!hasSubscription && (
                  <Button
                    onClick={handleSetupPremiumPlan}
                    size='large'
                    variant='outlined'
                    color='primary'
                  >
                    ASSINAR PLANO PREMIUM
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Main>
    </Page>
  )
}

SupportView.propTypes = {}

export default SupportView
