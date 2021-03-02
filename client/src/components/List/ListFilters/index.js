import React, { useState } from 'react'

import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import moment from 'moment'
import PropTypes from 'prop-types'

import Badge from '@material-ui/core/Badge'
import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import FilterListIcon from '@material-ui/icons/FilterList'
import GetAppIcon from '@material-ui/icons/GetApp'
import HelpOutline from '@material-ui/icons/HelpOutline'

import Alert from 'src/components/Alert'
import Button from 'src/components/Button'

import useOrder from 'src/hooks/useOrder'

import useStyles from './styles'

const mapFilterStatusToDict = (status) => {
  if (!status || status?.length === 0) {
    return {
      open: false,
      closed: false,
      canceled: false
    }
  }
  return {
    open: status.includes('open'),
    closed: status.includes('closed'),
    canceled: status.includes('canceled')
  }
}

const mapFilterPaymentToDict = (payments) => {
  if (!payments || payments?.length === 0) {
    return {
      cash: false,
      credit: false,
      debt: false,
      voucher: false
    }
  }
  return {
    cash: payments.includes('cash'),
    debt: payments.includes('debt'),
    credit: payments.includes('credit'),
    voucher: payments.includes('voucher')
  }
}

const mapFilterOriginToDict = (origins) => {
  if (!origins || origins?.length === 0) {
    return {
      mee: false,
      ifood: false,
      shopfront: false
    }
  }
  return {
    mee: origins.includes('mee'),
    ifood: origins.includes('ifood'),
    shopfront: origins.includes('shopfront')
  }
}

const ListFilters = ({ initialValues, onFilterChange }) => {
  const classes = useStyles()

  const { downloadInvoices, loading } = useOrder()

  const hasFilter =
    initialValues?.start ||
    initialValues?.end ||
    initialValues?.status?.length > 0 ||
    initialValues?.payments?.length > 0 ||
    initialValues?.origin?.length > 0

  const [openAlert, setOpenAlert] = useState(false)
  const [openDownloadAlert, setOpenDownloadAlert] = useState(false)
  const [uri, setURI] = useState(null)
  const [filters, setFilters] = useState({
    ...initialValues,
    status: mapFilterStatusToDict(initialValues.status),
    payments: mapFilterPaymentToDict(initialValues.payments),
    origin: mapFilterOriginToDict(initialValues.origin)
  })

  const handleStartDateChange = (value) => {
    setFilters({ ...filters, start: value ? value.startOf('day').toISOString() : null })
  }

  const handleEndDateChange = (value) => {
    setFilters({ ...filters, end: value ? value.endOf('day').toISOString() : null })
  }

  const handleChangeStatus = (event) => {
    setFilters({
      ...filters,
      status: { ...filters.status, [event.target.name]: event.target.checked }
    })
  }

  const handleChangePayments = (event) => {
    setFilters({
      ...filters,
      payments: { ...filters.payments, [event.target.name]: event.target.checked }
    })
  }

  const handleChangeOrigins = (event) => {
    setFilters({
      ...filters,
      origin: { ...filters.origin, [event.target.name]: event.target.checked }
    })
  }

  const handleOpenAlert = () => {
    setOpenAlert(true)
  }

  const mapFiltersFromState = () => {
    const status = []
    for (const key in filters.status) {
      if (filters.status[key]) status.push(key)
    }

    const payments = []
    for (const key in filters.payments) {
      if (filters.payments[key]) payments.push(key)
    }

    const origin = []
    for (const key in filters.origin) {
      if (filters.origin[key]) origin.push(key)
    }

    return { start: filters.start, end: filters.end, status, payments, origin }
  }

  const handleDownloadInvoicesClick = async () => {
    const queryFilter = mapFiltersFromState(filters)
    const uri = await downloadInvoices({ filter: queryFilter })

    setURI(uri)
    setOpenDownloadAlert(true)
  }

  const handleCloseDownloadAlert = () => {
    setOpenDownloadAlert(false)
  }

  const handleCloseAlert = () => {
    setOpenAlert(false)
  }

  const handleSubmit = () => {
    const changes = mapFiltersFromState(filters)

    onFilterChange(changes)
    setOpenAlert(false)
  }

  const handleClean = () => {
    setFilters({ start: null, end: null, status: [], payments: [], origin: [] })
  }

  const {
    status: { open, closed, canceled },
    payments: { cash, credit, debt, voucher },
    origin: { mee, ifood, shopfront }
  } = filters

  return (
    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
      <Grid container spacing={2} justify='flex-end'>
        <Button onClick={handleDownloadInvoicesClick} loading={loading} startIcon={<GetAppIcon />}>
          Baixar Notas Fiscais
        </Button>
        <Badge color='secondary' overlap='circle' variant='dot' invisible={!hasFilter}>
          <Button onClick={handleOpenAlert} startIcon={<FilterListIcon />}>
            Filtros
          </Button>
        </Badge>
        <Alert
          open={openAlert}
          loading={false}
          onExited={() => {}}
          onClose={handleCloseAlert}
          title={'Filtros'}
          onPrimary={handleSubmit}
          primaryLabel={'Atualizar'}
          onSecondary={handleCloseAlert}
          secondaryLabel='Cancelar'
        >
          <Grid container spacing={2}>
            <Grid>
              <Button onClick={handleClean} color='primary' justify='flex-end'>
                Limpar
              </Button>
            </Grid>
            <Grid className={classes.section} item xs={12}>
              <Box display='flex' alignItems='center'>
                <Typography variant='overline' align='center'>
                  Data de criação
                </Typography>
                <Tooltip title='Escolha um intervalo para filtrar pela data de criação dos pedidos.'>
                  <HelpOutline className={classes.helpIcon} />
                </Tooltip>
              </Box>
            </Grid>
            <Grid item xs>
              <KeyboardDatePicker
                format='DD/MM/YY'
                placeholder='Início'
                value={filters?.start}
                maxDate={new Date()}
                onChange={handleStartDateChange}
                KeyboardButtonProps={{ 'aria-label': 'Data de início' }}
                autoOk
              />
            </Grid>
            <Grid item xs>
              <KeyboardDatePicker
                format='DD/MM/YY'
                placeholder='Fim'
                value={filters?.end}
                maxDate={new Date()}
                onChange={handleEndDateChange}
                KeyboardButtonProps={{ 'aria-label': 'Data de fim' }}
                autoOk
              />
            </Grid>
            <Grid className={classes.section} item xs={12}>
              <Box display='flex' alignItems='center'>
                <Typography variant='overline' align='center'>
                  Status
                </Typography>
                <Tooltip title='Filtre por um ou mais status dos pedidos.'>
                  <HelpOutline className={classes.helpIcon} />
                </Tooltip>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormControl component='fieldset' className={classes.formControl}>
                <FormGroup>
                  <Grid container spacing={1} justify='center' alignItems='center'>
                    <Grid item xs={6} sm={4}>
                      <FormControlLabel
                        control={
                          <Checkbox checked={open} onChange={handleChangeStatus} name='open' />
                        }
                        label='Aberto'
                      />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <FormControlLabel
                        control={
                          <Checkbox checked={closed} onChange={handleChangeStatus} name='closed' />
                        }
                        label='Fechado'
                      />
                    </Grid>
                    <Grid xs={6} sm={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={canceled}
                            onChange={handleChangeStatus}
                            name='canceled'
                          />
                        }
                        label='Cancelado'
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid className={classes.section} item xs={12}>
              <Box display='flex' alignItems='center'>
                <Typography variant='overline' align='center'>
                  Tipos de pagamento
                </Typography>
                <Tooltip title='Filtre por pedidos que foram pagos com um determinado tipo de pagamento.'>
                  <HelpOutline className={classes.helpIcon} />
                </Tooltip>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormControl component='fieldset' className={classes.formControl}>
                <FormGroup>
                  <Grid container spacing={1} justify='center' alignItems='center'>
                    <Grid item xs={6} sm={3}>
                      <FormControlLabel
                        control={
                          <Checkbox checked={cash} onChange={handleChangePayments} name='cash' />
                        }
                        label='Dinheiro'
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={credit}
                            onChange={handleChangePayments}
                            name='credit'
                          />
                        }
                        label='Crédito'
                      />
                    </Grid>
                    <Grid xs={6} sm={3}>
                      <FormControlLabel
                        control={
                          <Checkbox checked={debt} onChange={handleChangePayments} name='debt' />
                        }
                        label='Débito'
                      />
                    </Grid>
                    <Grid xs={6} sm={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={voucher}
                            onChange={handleChangePayments}
                            name='voucher'
                          />
                        }
                        label='Voucher'
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid className={classes.section} item xs={12}>
              <Box display='flex' alignItems='center'>
                <Typography variant='overline' align='center'>
                  Origem do pedido
                </Typography>
                <Tooltip title='Filtre pela origem da criação do pedido.'>
                  <HelpOutline className={classes.helpIcon} />
                </Tooltip>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormControl component='fieldset' className={classes.formControl}>
                <FormGroup>
                  <Grid container spacing={1} justify='center' alignItems='center'>
                    <Grid item xs={4} sm={4}>
                      <FormControlLabel
                        control={
                          <Checkbox checked={mee} onChange={handleChangeOrigins} name='mee' />
                        }
                        label='Mee'
                      />
                    </Grid>
                    <Grid xs={4} sm={4}>
                      <FormControlLabel
                        control={
                          <Checkbox checked={ifood} onChange={handleChangeOrigins} name='ifood' />
                        }
                        label='iFood'
                      />
                    </Grid>
                    <Grid xs={4} sm={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={shopfront}
                            onChange={handleChangeOrigins}
                            name='shopfront'
                          />
                        }
                        label='Vitrine Digital'
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Alert>
        <Alert
          open={openDownloadAlert}
          loading={false}
          onExited={() => {}}
          onClose={handleCloseDownloadAlert}
          title={'Download'}
          onPrimary={handleCloseDownloadAlert}
          primaryLabel={'Fechar'}
        >
          <Button
            color='primary'
            size='small'
            target='_blank'
            rel={'noopener noreferrer'}
            href={uri}
            component={Link}
            className={classes.button}
            startIcon={<GetAppIcon />}
          >
            Clique aqui para baixar a pasta compactada com os XMLs.
          </Button>
        </Alert>
      </Grid>
    </MuiPickersUtilsProvider>
  )
}

ListFilters.propTypes = {
  initialValues: PropTypes.shape({
    start: PropTypes.object,
    end: PropTypes.object,
    status: PropTypes.array,
    payments: PropTypes.array,
    origin: PropTypes.array
  }),
  onFilterChange: PropTypes.func
}

ListFilters.defaultProps = {
  onFilterChange: () => {}
}

export default ListFilters
