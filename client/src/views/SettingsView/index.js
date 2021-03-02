import React, { Fragment, useState, useContext, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

import { useQuery, useMutation } from '@apollo/react-hooks'
import classNames from 'classnames'

import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Chip from '@material-ui/core/Chip'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Paper from '@material-ui/core/Paper'
import { useTheme } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import AccountBalanceWallet from '@material-ui/icons/AccountBalanceWallet'
import AddCircleOutline from '@material-ui/icons/AddCircleOutline'
import ArrowForward from '@material-ui/icons/ArrowForward'
import Brightness from '@material-ui/icons/Brightness4'
import Delete from '@material-ui/icons/Delete'
import EditOutlined from '@material-ui/icons/EditOutlined'
import Facebook from '@material-ui/icons/Facebook'
import HelpOutline from '@material-ui/icons/HelpOutline'
import OfflineBolt from '@material-ui/icons/OfflineBolt'

import Button from 'src/components/Button'
import Dialog from 'src/components/Dialog'
import Main from 'src/components/Main'
import Page from 'src/components/Page'
import Spacer from 'src/components/Spacer'
import TabPanel from 'src/components/TabPanel'

import { TOGGLE_OPEN_STATUS, UPDATE_IFOOD_CREDENTIALS } from 'src/graphql/ifood/queries'
import { UPDATE_LOGGI_CREDENTIALS } from 'src/graphql/loggi/queries'
import { OPEN_NOTIFICATION } from 'src/graphql/notification/queries'
import { SETTINGS_OPTIONS_KEY } from 'src/graphql/settings/constants'
import {
  GET_SETTINGS,
  SET_SETTINGS,
  CREATE_PRICE_RULE,
  UPDATE_PRICE_RULE,
  DELETE_PRICE_RULE
} from 'src/graphql/settings/queries'

import AppBarContext from 'src/contexts/AppBarContext'

import DeliveryFeesForm from 'src/forms/DeliveryFeesForm'
import FeesForm from 'src/forms/FeesForm'
import PriceRuleForm from 'src/forms/PriceRuleForm'

import useCompany from 'src/hooks/useCompany'

import IfoodCredentialsContent from 'src/dialogs/IfoodCredentialsContent'
import LoggiCredentialsContent from 'src/dialogs/LoggiCredentialsContent'

import { FirebaseEvents, OperationTypes, Origins } from 'src/utils/enums'
import { save } from 'src/utils/localStorage'

import helpscout from 'src/services/helpscout'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const DialogContents = {
  ifoodCredentials: 'ifoodCredentials',
  loggiCredentials: 'loggiCredentials'
}

const SettingsView = () => {
  const classes = useStyles()
  const theme = useTheme()
  const upSmall = useMediaQuery(theme.breakpoints.up('sm'))

  const {
    getMyCompany: [getMyCompany, { data }],
    updateMyCompany: [updateMyCompany, { loading }]
  } = useCompany()
  const [, setAppBar] = useContext(AppBarContext)

  const history = useHistory()
  const { hash } = useLocation()
  const [openDialog, setOpenDialog] = useState(false)
  const [activeContent, setActiveContent] = useState(null)
  const [tab, setTab] = useState(hash !== '' ? hash : '#general')
  const [addRule, setAddRule] = useState(false)
  const [selectedRule, setSelectedRule] = useState(null)

  const {
    data: { settings }
  } = useQuery(GET_SETTINGS)
  const [setSettings] = useMutation(SET_SETTINGS)
  const [createPriceRule] = useMutation(CREATE_PRICE_RULE, {})
  const [updatePriceRule] = useMutation(UPDATE_PRICE_RULE, {})
  const [deletePriceRule] = useMutation(DELETE_PRICE_RULE, {})
  const [toggleOpenStatus] = useMutation(TOGGLE_OPEN_STATUS)
  const [updateIfoodCredentials, { loading: loadingIfoodUpdateCredentials }] = useMutation(
    UPDATE_IFOOD_CREDENTIALS
  )
  const [updateLoggiCredentials, { loading: loadingLoggiUpdateCredentials }] = useMutation(
    UPDATE_LOGGI_CREDENTIALS
  )
  const [openNotification] = useMutation(OPEN_NOTIFICATION)

  useEffect(() => {
    const title = 'Configurações'
    setAppBar({ prominent: false, overhead: false, color: 'white', title: title.toLowerCase() })
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  useEffect(() => {
    getMyCompany()
  }, [])

  useEffect(() => {
    if (!hash) {
      const selectedTab = '#general'
      setTab(selectedTab)
      history.replace(`/settings${selectedTab}`)
    } else {
      setTab(hash)
    }
  }, [hash, history])

  useEffect(() => {
    helpscout.showBeacon()
  })

  const myCompany = data?.myCompany

  const handleTabChange = (event, newValue) => {
    if (tab !== newValue) {
      setTab(newValue)
      history.push(`/settings${newValue}`)
    }
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
  }

  const handleIfoodIntegration = () => {
    setActiveContent(DialogContents.ifoodCredentials)
    setOpenDialog(true)
  }

  const handleLoggiIntegration = () => {
    setActiveContent(DialogContents.loggiCredentials)
    setOpenDialog(true)
  }

  const handleToggle = (option) => async (event) => {
    try {
      const {
        data: {
          setSettings: { options }
        }
      } = await setSettings({ variables: { option, value: event.target.checked } })
      save(SETTINGS_OPTIONS_KEY, options)
      analytics.logEvent(FirebaseEvents.UPDATE_LOCAL_SETTINGS, { ...options })
    } catch ({ message }) {}
  }

  const handleAddRule = (event) => {
    setAddRule(true)
  }

  const handleActiveChange = ({ _id: id, ...rule }) => (event) => {
    handleSubmit({ id, ...rule, active: event.target.checked })
  }

  const handleSubmit = async ({ _id: id, ...rule }) => {
    try {
      if (id) {
        await updatePriceRule({ variables: { input: { id, ...rule } } })
        openNotification({
          variables: { input: { variant: 'success', message: 'Regra de preço atualizada' } }
        })
        analytics.logEvent(FirebaseEvents.PRICE_RULE_UPDATE, { id, ...rule })
      } else {
        await createPriceRule({ variables: { input: { rules: [rule] } } })
        openNotification({
          variables: { input: { variant: 'success', message: 'Regra de preço criada' } }
        })
        analytics.logEvent(FirebaseEvents.PRICE_RULE_CREATE, { id, ...rule })
      }
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    } finally {
      setAddRule(false)
      setSelectedRule(null)
    }
  }

  const handleDeliveryFeesSubmit = async (data) => {
    await updateMyCompany({ delivery: data }, { message: 'Regras atualizadas!' })
  }

  const handleFeesSubmit = async (data) => {
    await updateMyCompany({ fees: data }, { message: 'Taxas atualizadas!' })
  }

  const handleForceOpenRegisterSubmit = async () => {
    await updateMyCompany(
      { forceOpenRegister: !myCompany.settings?.forceOpenRegister },
      { message: 'Regras atualizadas!' }
    )
  }

  const handleCancelRule = (event) => {
    setSelectedRule(null)
    setAddRule(false)
  }

  const handleEditRule = (rule) => (event) => {
    setSelectedRule({ ...rule, channels: rule.channels.map((channel) => Origins[channel]) })
    setAddRule(true)
  }

  const handleDeleteRule = (rule) => async (event) => {
    try {
      await deletePriceRule({ variables: { input: { id: rule._id } } })
      openNotification({
        variables: { input: { variant: 'success', message: 'Regra de preço apagada' } }
      })
      analytics.logEvent(FirebaseEvents.PRICE_RULE_DELETE, { id: rule._id })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleIfoodOpenToggle = async (input) => {
    try {
      await toggleOpenStatus({ variables: { input } })
      analytics.logEvent(FirebaseEvents.SET_SYNC_IFOOD, { value: input.open })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleIfoodCredentialsSubmit = async (input) => {
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

  const handleLoggiCredentialsSubmit = async (input) => {
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

  const renderRule = () => {
    const hasRules = !!myCompany?.settings?.priceRules?.length

    return (
      <>
        {(addRule || selectedRule) && (
          <>
            <PriceRuleForm
              rule={selectedRule}
              onCancel={handleCancelRule}
              onSubmit={handleSubmit}
            />
            <Divider className={classes.divider} variant='middle' component='li' />
          </>
        )}
        {hasRules ? (
          myCompany.settings.priceRules.map((rule, index) => (
            <Fragment key={index}>
              <ListItem disableGutters>
                <ListItemText
                  className={classes.listItemText}
                  primary={<Typography>{rule.name}</Typography>}
                  secondary={
                    <>
                      <Typography color='textSecondary' gutterBottom>
                        {`${rule.amount > 0 ? 'Adição' : 'Desconto'} de ${rule.amount}${
                          OperationTypes[rule.operationType].label
                        }`}
                      </Typography>
                      <div className={classes.chips}>
                        {rule.channels.map((channel) => (
                          <Chip key={channel} size='small' label={Origins[channel].label} />
                        ))}
                      </div>
                    </>
                  }
                  disableTypography
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={handleDeleteRule(rule)}>
                    <Delete />
                  </IconButton>
                  <IconButton onClick={handleEditRule(rule)}>
                    <EditOutlined />
                  </IconButton>
                  <Switch
                    checked={rule.active}
                    color='primary'
                    onChange={handleActiveChange(rule)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant='inset' component='li' />
            </Fragment>
          ))
        ) : (
          <Box display='flex' justifyContent='center'>
            <Typography variant='body2' color='textSecondary' align='center'>
              Você não tem regras de preços
            </Typography>
          </Box>
        )}
      </>
    )
  }

  const {
    options: { dark = false, performace = false }
  } = settings

  return (
    <Page className={classes.root}>
      <Main>
        <div className={classes.tabs}>
          <Tabs value={tab} indicatorColor='primary' textColor='primary' onChange={handleTabChange}>
            <Tab value='#general' label='Geral' />
            <Tab value='#price' label='Preço' />
            <Tab value='#integrations' label='Integrações' />
          </Tabs>
        </div>
        <TabPanel component={Container} maxWidth='sm' disableGutters value={tab} tab={'#general'}>
          <List subheader={<ListSubheader>Aplicação</ListSubheader>} disablePadding>
            <Paper>
              <ListItem>
                <ListItemIcon>
                  <Brightness />
                </ListItemIcon>
                <ListItemText primary='Modo escuro' />
                <ListItemSecondaryAction>
                  <Switch checked={dark} color='primary' onChange={handleToggle('dark')} />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <OfflineBolt />
                </ListItemIcon>
                <ListItemText primary='Performace' />
                <ListItemSecondaryAction>
                  <Switch
                    checked={performace}
                    color='primary'
                    onChange={handleToggle('performace')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          </List>
          {myCompany && (
            <List subheader={<ListSubheader>Caixa</ListSubheader>} disablePadding>
              <Paper>
                <ListItem>
                  <ListItemIcon>
                    <AccountBalanceWallet />
                  </ListItemIcon>
                  <ListItemText primary='Forçar abertura de caixa' />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={myCompany?.settings?.forceOpenRegister}
                      color='primary'
                      onChange={handleForceOpenRegisterSubmit}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </Paper>
            </List>
          )}
        </TabPanel>
        <TabPanel component={Container} maxWidth='sm' disableGutters value={tab} tab={'#price'}>
          {!myCompany && <CircularProgress />}
          {myCompany && (
            <>
              <List
                subheader={
                  <ListSubheader>
                    <Box display='flex' alignItems='center'>
                      Taxas
                      <Tooltip
                        title={'Defina taxas que serão aplicadas automaticamente as suas vendas'}
                      >
                        <HelpOutline className={classes.icon} />
                      </Tooltip>
                    </Box>
                  </ListSubheader>
                }
                disablePadding
              >
                <Card>
                  <FeesForm
                    initialValues={myCompany?.settings?.fees}
                    loading={loading}
                    onSubmit={handleFeesSubmit}
                    actions={(loading, onSubmit, isEmpty) => (
                      <CardActions>
                        {!isEmpty && (
                          <Button color='primary' onClick={onSubmit} loading={loading}>
                            SALVAR
                          </Button>
                        )}
                      </CardActions>
                    )}
                  />
                </Card>
              </List>
              <List
                subheader={
                  <ListSubheader>
                    <Box display='flex' alignItems='center'>
                      Entrega
                      <Tooltip
                        title={'Defina as regras de taxas e distâncias para a suas entregas'}
                      >
                        <HelpOutline className={classes.icon} />
                      </Tooltip>
                    </Box>
                  </ListSubheader>
                }
                disablePadding
              >
                <Card>
                  <DeliveryFeesForm
                    initialValues={myCompany?.settings?.delivery}
                    loading={loading}
                    onSubmit={handleDeliveryFeesSubmit}
                    actions={(loading, onSubmit, isEmpty) => (
                      <CardActions>
                        {!isEmpty && (
                          <Button color='primary' onClick={onSubmit} loading={loading}>
                            SALVAR
                          </Button>
                        )}
                      </CardActions>
                    )}
                  />
                </Card>
              </List>
              <List
                subheader={
                  <ListSubheader>
                    <Box display='flex' alignItems='center'>
                      Regras
                      <Tooltip
                        title={`Você pode aumentar ou diminuir automaticamente o valor dos seus produtos de uma vez.
                      Use para criar regras de preço específico por canal. Ex.: criar desconto de 10%
                      para black friday ou incluir taxa de comissão para um parceiro`}
                      >
                        <HelpOutline className={classes.icon} />
                      </Tooltip>
                    </Box>
                  </ListSubheader>
                }
                disablePadding
              >
                <Card>
                  <CardHeader
                    action={
                      !addRule && (
                        <Button
                          variant='contained'
                          color='primary'
                          size='small'
                          startIcon={<AddCircleOutline />}
                          onClick={handleAddRule}
                        >
                          Adicionar regra
                        </Button>
                      )
                    }
                  />
                  <CardContent>{renderRule()}</CardContent>
                </Card>
              </List>
            </>
          )}
        </TabPanel>
        <TabPanel
          component={Container}
          maxWidth='md'
          disableGutters
          value={tab}
          tab={'#integrations'}
        >
          <Grid container spacing={2} justify={upSmall ? 'flex-start' : 'center'}>
            <Grid item xs={12} sm='auto'>
              <Card className={classNames(classes.card, { [classes.fullWidth]: !upSmall })}>
                <CardHeader
                  avatar={<Facebook fontSize='large' />}
                  title={<Typography>iFood</Typography>}
                />
                <CardContent>
                  <Typography color='textSecondary'>Receber pedidos através do iFood</Typography>
                </CardContent>
                <CardActions>
                  <Spacer />
                  <Button
                    size='small'
                    color='primary'
                    endIcon={<ArrowForward />}
                    onClick={handleIfoodIntegration}
                  >
                    Integrar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm='auto'>
              <Card className={classNames(classes.card, { [classes.fullWidth]: !upSmall })}>
                <CardHeader
                  avatar={<Facebook fontSize='large' />}
                  title={<Typography>Loggi</Typography>}
                />
                <CardContent>
                  <Typography color='textSecondary'>Gerenciar entregas através da Loggi</Typography>
                </CardContent>
                <CardActions>
                  <Spacer />
                  <Button
                    size='small'
                    color='primary'
                    endIcon={<ArrowForward />}
                    onClick={handleLoggiIntegration}
                  >
                    Integrar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm='auto'>
              <Card className={classNames(classes.card, { [classes.fullWidth]: !upSmall })}>
                <CardHeader
                  avatar={<Facebook fontSize='large' />}
                  title={<Typography>iFood Mercados</Typography>}
                />
                <CardContent>
                  <Typography color='textSecondary'>Em breve integração com parceiro</Typography>
                </CardContent>
                <CardActions>
                  <Spacer />
                  <Button size='small' color='primary' endIcon={<ArrowForward />} disabled>
                    Integrar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm='auto'>
              <Card className={classNames(classes.card, { [classes.fullWidth]: !upSmall })}>
                <CardHeader
                  avatar={<Facebook fontSize='large' />}
                  title={<Typography>Uber Eats</Typography>}
                />
                <CardContent>
                  <Typography color='textSecondary'>Em breve integração com parceiro</Typography>
                </CardContent>
                <CardActions>
                  <Spacer />
                  <Button size='small' color='primary' endIcon={<ArrowForward />} disabled>
                    Integrar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        <Dialog
          className={classes.dialog}
          open={openDialog}
          activeContent={activeContent}
          onClose={handleDialogClose}
        >
          <IfoodCredentialsContent
            id={DialogContents.ifoodCredentials}
            title='Credenciais do iFood'
            ifood={myCompany?.ifood}
            disabled={!myCompany?.card}
            loading={loadingIfoodUpdateCredentials}
            onOpenToggle={handleIfoodOpenToggle}
            onSubmit={handleIfoodCredentialsSubmit}
          />
          <LoggiCredentialsContent
            id={DialogContents.loggiCredentials}
            title='Credenciais da Loggi'
            loggi={myCompany?.loggi}
            disabled={!myCompany?.card}
            loading={loadingLoggiUpdateCredentials}
            onSubmit={handleLoggiCredentialsSubmit}
          />
        </Dialog>
      </Main>
    </Page>
  )
}

SettingsView.propTypes = {}

SettingsView.defaultProps = {}

export default SettingsView
