import React, { useContext, useEffect, useState } from 'react'
import { Chart } from 'react-google-charts'
import { useHistory } from 'react-router-dom'

import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import moment from 'moment'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Link from '@material-ui/core/Link'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import { useTheme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import AssessmentIcon from '@material-ui/icons/Assessment'
import FilterListIcon from '@material-ui/icons/FilterList'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit'

import CheckIcon from 'src/icons/check.svg'
import UncheckIcon from 'src/icons/uncheck.svg'

import Alert from 'src/components/Alert'
import Dialog from 'src/components/Dialog'
import Main from 'src/components/Main'
import Page from 'src/components/Page'
import StatsDisplay from 'src/components/StatsDisplay'

import AppBarContext from 'src/contexts/AppBarContext'

import useMe from 'src/hooks/useMe'
import useReport from 'src/hooks/useReport'

import CashFlowContent from 'src/dialogs/CashFlowContent'
import PaymentMethodsContent from 'src/dialogs/PaymentMethodsContent'
import RetentionContent from 'src/dialogs/RetentionContent'
import TopSellingProductsContent from 'src/dialogs/TopSellingProductsContent'

import { FirebaseEvents, Paths } from 'src/utils/enums'

import helpscout from 'src/services/helpscout'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const cashFlowLegend = [
  {
    label: 'Despesa',
    class: 'expenses'
  },
  {
    label: 'Receita',
    class: 'revenue'
  },
  {
    label: 'Lucro',
    class: 'profit'
  }
]

const salesLegend = [
  {
    label: 'Crédito',
    class: 'credit'
  },
  {
    label: 'Debito',
    class: 'debit'
  },
  {
    label: 'Dinheiro',
    class: 'money'
  },
  {
    label: 'Voucher',
    class: 'voucher'
  },
  {
    label: 'PIX',
    class: 'pix'
  }
]

const ReportsView = () => {
  const classes = useStyles()
  const theme = useTheme()

  const upMedium = useMediaQuery(theme.breakpoints.up('md'))
  const history = useHistory()
  const { me } = useMe()

  const [, setAppBar] = useContext(AppBarContext)
  const [startDate, setStartDate] = useState(moment().startOf('month'))
  const [endDate, setEndDate] = useState(moment().endOf('month'))
  const [groupBy, setGroupBy] = useState('month')
  const [openAlert, setOpenAlert] = useState(false)
  const [openRetentionDetails, setOpenRetentionDetails] = useState(false)
  const [openTopSellingDetails, setOpenTopSellingDetails] = useState(false)
  const [openPaymentMethodDetails, setOpenPaymentMethodDetails] = useState(false)
  const [openCashFlowDetails, setOpenCashFlowDetails] = useState(false)
  const [cashFlowDesktopSize, setCashFlowDesktopSize] = useState(6)
  const [paymentMethodDesktopSize, setPaymentMethodDesktopSize] = useState(6)

  const {
    getReports: [getReports, { data, loading }]
  } = useReport()

  useEffect(() => {
    getReports({ startDate, endDate, groupBy })
  }, [])

  useEffect(() => {
    getReports({ startDate, endDate, groupBy })
  }, [startDate, endDate, groupBy])

  const hasData = data && data.reports

  useEffect(() => {
    const title = 'Relatórios'
    setAppBar({
      prominent: false,
      overhead: false,
      color: theme.palette.secondary.main,
      title: title.toLowerCase()
    })
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar, theme])

  useEffect(() => {
    helpscout.showBeacon()

    window.Beacon('identify', {
      email: me.email
    })

    if (!me?.onboarding?.finishedAddProduct) {
      window.Beacon('show-message', 'a9e637db-fdbb-4fde-9909-598b8aae1e2b')
    }
  })

  useEffect(() => {
    if (hasData) {
      setAppBar((prevState) => ({ ...prevState, prominent: true, overhead: true }))
    }
  }, [hasData, setAppBar])

  const handleOpenAlert = () => {
    setOpenAlert(true)
  }

  const handleCloseAlert = () => {
    setOpenAlert(false)
  }

  // https://github.com/rakannimer/react-google-charts/issues/209
  const renderBarChart = (salesReport, { title, subtitle, colors }) => {
    let data = []

    if (!salesReport) {
      return (
        <Box justify='center' alignItems='center' height={300} width='98%'>
          <CircularProgress />
        </Box>
      )
    }

    data.push(salesReport.header)
    data = data.concat(
      salesReport.data.map((val) => [val.label].concat(val.values.map((val) => val)))
    )

    return (
      <Chart
        width={'100%'}
        height={300}
        chartType='Bar'
        loader={<div>Carregando...</div>}
        data={data}
        options={{
          // Material design options
          chart: {
            title,
            subtitle
          },
          colors,
          legend: !upMedium && {
            position: 'none'
          }
        }}
      />
    )
  }

  const handleSelectStartDateSalesType = (date) => {
    setStartDate(date.startOf('day'))
  }

  const handleSelectEndDateSalesType = (date) => {
    setEndDate(date.endOf('day'))
  }

  const handleSelectGroupBy = (event) => {
    setGroupBy(event.target.value)
  }

  const handleAddProductStep = (event) => {
    event.preventDefault()
    analytics.logEvent(FirebaseEvents.ONBOARDING_ADD_PRODUCT_STEP)
    history.push({ pathname: Paths.products.path, state: { tour: true } })
  }

  const handleAddOrderStep = (event) => {
    event.preventDefault()
    analytics.logEvent(FirebaseEvents.ONBOARDING_ADD_ORDER_STEP)
    history.push({ pathname: Paths.sales.path, state: { tour: true, showAddOrderTour: true } })
  }

  const handleCloseOrderStep = (event) => {
    event.preventDefault()
    analytics.logEvent(FirebaseEvents.ONBOARDING_CLOSE_ORDER_STEP)
    history.push({ pathname: Paths.sales.path, state: { tour: true, showCloseOrderTour: true } })
  }

  const handleOpenRetentionDetails = () => {
    setOpenRetentionDetails(true)
  }

  const handleCloseRetentionDetails = () => {
    setOpenRetentionDetails(false)
  }

  const handleOpenTopSellingDetails = () => {
    setOpenTopSellingDetails(true)
  }

  const handleCloseTopSellingDetails = () => {
    setOpenTopSellingDetails(false)
  }
  const handleCloseCashFlowDetails = () => {
    setOpenCashFlowDetails(false)
  }

  const handleOpenCashFlowDetails = () => {
    setOpenCashFlowDetails(true)
  }

  const handleClosePaymentMethodDetails = () => {
    setOpenPaymentMethodDetails(false)
  }

  const handleOpenPaymentMethodDetails = () => {
    setOpenPaymentMethodDetails(true)
  }

  const handleExpandCashFlowClick = () => {
    setCashFlowDesktopSize(cashFlowDesktopSize === 6 ? 12 : 6)
  }

  const handleExpandPaymentMethodClick = () => {
    setPaymentMethodDesktopSize(paymentMethodDesktopSize === 6 ? 12 : 6)
  }

  const placeholder = data && !data.reports.hasSales && (
    <Grid container spacing={3}>
      <Grid item container justify='center' xs={12}>
        <Grid item>
          <Card className={classes.placeholder}>
            <CardMedia
              className={classes.media}
              image={'https://www.somosmee.com/Frame-3.png'}
              title='Primeiros passos'
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography gutterBottom variant='h5' component='h2'>
                    Primeiros passos
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2' color='textSecondary' component='p'>
                    Aprenda a registar sua primeira venda e fuja da confusão do papel {'📝🙅🏻‍♂️'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  {me?.onboarding?.finishedAddProduct ? (
                    <img alt='check' src={CheckIcon} />
                  ) : (
                    <img alt='check' src={UncheckIcon} />
                  )}{' '}
                  <Link href='#' onClick={handleAddProductStep}>
                    <Typography variant='body1' display='inline'>
                      Cadastre um produto {'🧺'}
                    </Typography>
                  </Link>
                </Grid>
                <Grid item xs={12}>
                  {me?.onboarding?.finishedAddOrder ? (
                    <img alt='check' src={CheckIcon} />
                  ) : (
                    <img alt='check' src={UncheckIcon} />
                  )}{' '}
                  <Link href='#' onClick={handleAddOrderStep}>
                    <Typography variant='body1' display='inline'>
                      Crie um pedido {'🧾'}
                    </Typography>
                  </Link>
                </Grid>
                <Grid item xs={12}>
                  {me?.onboarding?.finishedCloseOrder ? (
                    <img alt='check' src={CheckIcon} />
                  ) : (
                    <img alt='check' src={UncheckIcon} />
                  )}{' '}
                  <Link href='#' onClick={handleCloseOrderStep}>
                    <Typography variant='body1' display='inline'>
                      Conclua a venda {'📈'}
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )

  const renderFilters = () => (
    <>
      {!upMedium && (
        <Grid item container justify='center' alignItems='center' xs>
          <Button variant='outlined' onClick={handleOpenAlert} startIcon={<FilterListIcon />}>
            Filtros
          </Button>
        </Grid>
      )}
      {upMedium && (
        <Grid container item spacing={3} justify='center' alignItems='center' xs={12}>
          <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={'pt-br'}>
            <Grid item>
              <KeyboardDatePicker
                disableToolbar
                variant='inline'
                format='DD/MM/yyyy'
                margin='normal'
                label='Data inicio'
                value={startDate}
                onChange={handleSelectStartDateSalesType}
                KeyboardButtonProps={{
                  'aria-label': 'alterar data'
                }}
              />
            </Grid>
            <Grid item>
              <KeyboardDatePicker
                disableToolbar
                variant='inline'
                format='DD/MM/yyyy'
                margin='normal'
                label='Data fim'
                value={endDate}
                onChange={handleSelectEndDateSalesType}
                KeyboardButtonProps={{
                  'aria-label': 'alterar data'
                }}
              />
            </Grid>
            <Grid item>
              <TextField select label='Agrupar' value={groupBy} onChange={handleSelectGroupBy}>
                <MenuItem value={'day'}>Dia</MenuItem>
                <MenuItem value={'week'}>Semana</MenuItem>
                <MenuItem value={'month'}>Mês</MenuItem>
              </TextField>
            </Grid>
          </MuiPickersUtilsProvider>
        </Grid>
      )}
    </>
  )

  const renderMobileLegend = (legends) => (
    <Grid item container justify='center' alignItems='center'>
      {legends.map((legend, index) => (
        <Typography
          key={index}
          display='inline'
          className={classes[legend.class]}
          variant='subtitle2'
          gutterBottom
        >
          &bull; {legend.label}
        </Typography>
      ))}
    </Grid>
  )

  const salesStatisticsReport = data?.reports.salesStatisticsReport
  const retentionReport = data?.reports.retentionReport

  const cashFlowReport = data?.reports.cashFlowReport
  const hasCashFlowReport = cashFlowReport?.data?.length

  const salesReport = data?.reports.salesReport
  const hasSalesReport = salesReport?.data?.length

  return (
    <Page className={classes.root}>
      <Main placeholder={placeholder} loading={loading}>
        {hasData && data.reports.hasSales && (
          <Grid container spacing={3}>
            {renderFilters()}
            <Grid container item justify='center' alignItems='center' xs={12}>
              <Typography variant='caption' gutterBottom display='inline'>
                Comparado com: {moment(retentionReport.previous.beginAt).format('DD/MM/YYYY')} -{' '}
                {moment(retentionReport.previous.endAt).format('DD/MM/YYYY')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Grid container direction='column'>
                    <Grid item xs>
                      <Typography display='block' variant='body1' gutterBottom>
                        Total vendas
                      </Typography>
                    </Grid>
                    <StatsDisplay
                      primaryLabel={salesStatisticsReport?.total}
                      primaryFontSize='medium'
                      secondaryFontSize='medium'
                      secondaryNumber={salesStatisticsReport?.totalPercentageDiff}
                      secondaryLabel={`${(salesStatisticsReport?.totalPercentageDiff * 100).toFixed(
                        2
                      )}%`}
                    />
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Grid container direction='column'>
                    <Grid item xs>
                      <Typography display='block' variant='body1' gutterBottom>
                        Ticket médio
                      </Typography>
                      <StatsDisplay
                        primaryLabel={salesStatisticsReport?.averageTicket.toFixed(2)}
                        primaryFontSize='medium'
                        secondaryFontSize='medium'
                        secondaryNumber={salesStatisticsReport?.averageTicketPercentageDiff}
                        secondaryLabel={`${(
                          salesStatisticsReport?.averageTicketPercentageDiff * 100
                        ).toFixed(2)}%`}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={cashFlowDesktopSize}>
              <Card>
                <CardContent>
                  <Grid container>
                    {hasCashFlowReport &&
                      renderBarChart(cashFlowReport, {
                        title: 'Previsão de Fluxo de caixa',
                        subtitle: 'Lançamentos futuros de receitas e despesas',
                        colors: ['#e53935', '#1976d2', '#4caf50']
                      })}
                    {!hasCashFlowReport &&
                      renderBarChart(null, {
                        title: 'Previsão de Fluxo de caixa',
                        subtitle: 'Lançamentos futuros de receitas e despesas',
                        colors: ['#e53935', '#1976d2', '#4caf50']
                      })}
                    {!upMedium && renderMobileLegend(cashFlowLegend)}
                  </Grid>
                  {upMedium && (
                    <Grid container direction='row' justify='space-between' alignItems='center'>
                      <IconButton
                        color='primary'
                        aria-label='payment methods deatil'
                        onClick={handleOpenCashFlowDetails}
                      >
                        <AssessmentIcon />
                      </IconButton>
                      <IconButton onClick={handleExpandCashFlowClick} aria-label='expand'>
                        {cashFlowDesktopSize === 6 ? (
                          <Tooltip title='Expandir'>
                            <FullscreenIcon />
                          </Tooltip>
                        ) : (
                          <Tooltip title='Encolher'>
                            <FullscreenExitIcon />
                          </Tooltip>
                        )}
                      </IconButton>
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={paymentMethodDesktopSize}>
              <Card>
                <CardContent>
                  <Grid container>
                    {hasSalesReport &&
                      renderBarChart(salesReport, {
                        title: 'Métodos de Pagamento',
                        subtitle: 'Vendas por método de pagamento'
                      })}
                    {!hasSalesReport &&
                      renderBarChart(null, {
                        title: 'Métodos de Pagamento',
                        subtitle: 'Vendas por método de pagamento'
                      })}
                    {!upMedium && renderMobileLegend(salesLegend)}
                  </Grid>
                  {upMedium && (
                    <Grid container direction='row' justify='space-between' alignItems='center'>
                      <IconButton
                        color='primary'
                        aria-label='payment methods deatil'
                        onClick={handleOpenPaymentMethodDetails}
                      >
                        <AssessmentIcon />
                      </IconButton>
                      <IconButton onClick={handleExpandPaymentMethodClick} aria-label='expand'>
                        {paymentMethodDesktopSize === 6 ? (
                          <Tooltip title='Expandir'>
                            <FullscreenIcon />
                          </Tooltip>
                        ) : (
                          <Tooltip title='Encolher'>
                            <FullscreenExitIcon />
                          </Tooltip>
                        )}
                      </IconButton>
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Grid container direction='column'>
                    <Grid item xs>
                      <Typography display='block' variant='body1' gutterBottom>
                        Taxa de fidelização
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      <Typography
                        display='block'
                        variant='body2'
                        color='textSecondary'
                        gutterBottom
                      >
                        Porcentagem de clientes que retornaram a comprar
                      </Typography>
                    </Grid>
                    <StatsDisplay
                      primaryLabel={`${(retentionReport.retentionRate * 100).toFixed(2)}%`}
                      primaryFontSize='large'
                      secondaryFontSize='large'
                      secondaryNumber={retentionReport.percentageDiff}
                      secondaryLabel={`${(retentionReport.percentageDiff * 100).toFixed(2)}%`}
                    />
                  </Grid>
                </CardContent>
                <CardActions>
                  <IconButton
                    color='primary'
                    aria-label='retention details'
                    onClick={handleOpenRetentionDetails}
                  >
                    <AssessmentIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Grid container direction='column'>
                    <Grid item xs>
                      <Typography display='block' variant='body1' gutterBottom>
                        Vendas
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      <Typography
                        display='block'
                        variant='body2'
                        color='textSecondary'
                        gutterBottom
                      >
                        Produtos mais vendidos
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      {salesStatisticsReport && (
                        <TableContainer component={Paper}>
                          <Table className={classes.table} size='small' aria-label='simple table'>
                            <TableHead>
                              <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell align='right'>Unidades vendidas</TableCell>
                                <TableCell align='right'>Receita</TableCell>
                                <TableCell align='right'>Receita total (%)</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {salesStatisticsReport.topSellingProducts.slice(0, 5).map((row) => (
                                <TableRow key={row.name}>
                                  <TableCell component='th' scope='row'>
                                    {row.name}
                                  </TableCell>
                                  <TableCell align='right'>{row.total}</TableCell>
                                  <TableCell align='right'>{`R$ ${row.revenue.toFixed(
                                    2
                                  )}`}</TableCell>
                                  <TableCell align='right'>
                                    {(row.subtotalRevenuePercentage * 100).toFixed(2)}%
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <IconButton
                    color='primary'
                    aria-label='retention details'
                    onClick={handleOpenTopSellingDetails}
                  >
                    <AssessmentIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Grid container direction='column'>
                    <Grid item xs>
                      <Typography display='block' variant='body1' gutterBottom>
                        Taxas
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      <Typography
                        display='block'
                        variant='body2'
                        color='textSecondary'
                        gutterBottom
                      >
                        Total de taxas por tipo
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      {salesStatisticsReport && (
                        <TableContainer component={Paper}>
                          <Table className={classes.table} size='small' aria-label='simple table'>
                            <TableHead>
                              <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell align='right'>Total</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {salesStatisticsReport.totalFees.map((row) => (
                                <TableRow key={row.name}>
                                  <TableCell component='th' scope='row'>
                                    {row.name}
                                  </TableCell>
                                  <TableCell align='right'>{`R$ ${row.total.toFixed(
                                    2
                                  )}`}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        <Alert
          open={openAlert}
          loading={false}
          onClose={handleCloseAlert}
          title={'Filtros'}
          onPrimary={handleCloseAlert}
          primaryLabel={'Fechar'}
        >
          <Grid container item spacing={3} justify='center' alignItems='center' xs={12}>
            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={'pt-br'}>
              <Grid item>
                <KeyboardDatePicker
                  disableToolbar
                  autoOk
                  variant='inline'
                  format='DD/MM/yyyy'
                  margin='normal'
                  label='Data inicio'
                  value={startDate}
                  onChange={handleSelectStartDateSalesType}
                  KeyboardButtonProps={{
                    'aria-label': 'alterar data'
                  }}
                />
              </Grid>
              <Grid item>
                <KeyboardDatePicker
                  disableToolbar
                  autoOk
                  variant='inline'
                  format='DD/MM/yyyy'
                  margin='normal'
                  label='Data fim'
                  value={endDate}
                  onChange={handleSelectEndDateSalesType}
                  KeyboardButtonProps={{
                    'aria-label': 'alterar data'
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  select
                  label='Agrupar'
                  value={groupBy}
                  onChange={handleSelectGroupBy}
                >
                  <MenuItem value={'day'}>Dia</MenuItem>
                  <MenuItem value={'week'}>Semana</MenuItem>
                  <MenuItem value={'month'}>Mês</MenuItem>
                </TextField>
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>
        </Alert>
        <Dialog open={openRetentionDetails} onClose={handleCloseRetentionDetails}>
          <RetentionContent
            title='Taxa de Fidelização'
            retentionReport={retentionReport}
            onClose={handleCloseRetentionDetails}
          />
        </Dialog>
        <Dialog open={openTopSellingDetails} onClose={handleCloseTopSellingDetails}>
          <TopSellingProductsContent
            title='Produtos mais vendidos'
            topSellingProducts={salesStatisticsReport?.topSellingProducts}
            onClose={handleCloseTopSellingDetails}
          />
        </Dialog>
        <Dialog
          maxWidth={'md'}
          open={openPaymentMethodDetails}
          onClose={handleClosePaymentMethodDetails}
        >
          <PaymentMethodsContent
            title='Métodos de Pagamento'
            data={salesReport?.data}
            onClose={handleClosePaymentMethodDetails}
          />
        </Dialog>
        <Dialog open={openCashFlowDetails} onClose={handleCloseCashFlowDetails}>
          <CashFlowContent
            title='Previsão de Fluxo de Caixa'
            data={cashFlowReport?.data}
            onClose={handleCloseCashFlowDetails}
          />
        </Dialog>
      </Main>
    </Page>
  )
}

export default ReportsView
