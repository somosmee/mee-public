import React, { useContext, useEffect, useState } from 'react'

import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks'
import cep from 'cep-promise'

import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { useTheme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import AddIcon from '@material-ui/icons/AddOutlined'
import HelpOutline from '@material-ui/icons/HelpOutline'
import RefreshIcon from '@material-ui/icons/RefreshOutlined'

import UpsertSelectOneStep from 'src/components/AddPurchaseSteps/UpsertSelectOneStep'
import CustomerSearchStep from 'src/components/DeliverySteps/CustomerSearchStep'
import PaymentSelectionStep from 'src/components/DeliverySteps/PaymentSelectionStep'
import ShippingSelectionStep from 'src/components/DeliverySteps/ShippingSelectionStep'
import UpsertAddressStep from 'src/components/DeliverySteps/UpsertAddressStep'
import UpsertCustomerStep from 'src/components/DeliverySteps/UpsertCustomerStep'
import DialogStepper from 'src/components/DialogStepper'
import Loading from 'src/components/Loading'
import CreateOrderReviewStep from 'src/components/LoggiSteps/CreateOrderReviewStep'
import DimensionsStep from 'src/components/LoggiSteps/DimensionsStep'
import PickupSelectionStep from 'src/components/LoggiSteps/PickupSelectionStep'
import Main from 'src/components/Main'
import Page from 'src/components/Page'

import {
  CREATE_CUSTOMER,
  CREATE_CUSTOMER_ADDRESS,
  UPDATE_CUSTOMER_ADDRESS,
  DELETE_CUSTOMER_ADDRESS
} from 'src/graphql/customer/queries'
import { UPDATE_ME } from 'src/graphql/user/queries'
import { GET_ALL_PACKAGES, GET_ALL_SHOPS, CREATE_ORDER } from 'src/graphql/loggi/queries'
import { OPEN_NOTIFICATION } from 'src/graphql/notification/queries'
import { UPDATE_ORDER, ORDERS, SEARCH_ORDERS } from 'src/graphql/order/queries'

import AppBarContext from 'src/contexts/AppBarContext'

import useMe from 'src/hooks/useMe'

import addressUtils from 'src/utils/address'
import { FirebaseEvents, CreateOrderLoggiSteps, PaymentsLoggi } from 'src/utils/enums'

import loggi from 'src/services/loggi'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const LoggiView = () => {
  const theme = useTheme()
  const classes = useStyles()
  const upMedium = useMediaQuery(theme.breakpoints.up('md')) || true

  const { me } = useMe()
  const [checked, setChecked] = useState([])
  const [change, setChange] = useState(null)
  const [address, setAddress] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedCharge, setSelectedCharge] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [pickupAddress, setPickupAddress] = useState(me.address)
  const [selectedDimensions, setSelectedDimensions] = useState(null)
  const [activeStep, setActiveStep] = useState(CreateOrderLoggiSteps.selectOrder)

  const [, setAppBar] = useContext(AppBarContext)

  const { data } = useQuery(GET_ALL_SHOPS)
  const [updateMe] = useMutation(UPDATE_ME)
  const [updateOrder] = useMutation(UPDATE_ORDER)
  const [createCustomer] = useMutation(CREATE_CUSTOMER)
  const [openNotification] = useMutation(OPEN_NOTIFICATION)
  const [createCustomerAddress] = useMutation(CREATE_CUSTOMER_ADDRESS)
  const [updateCustomerAddress] = useMutation(UPDATE_CUSTOMER_ADDRESS)
  const [deleteCustomerAddress] = useMutation(DELETE_CUSTOMER_ADDRESS)

  const shops = data?.allShopsLoggi?.edges

  const [getPackages, { loading: loadingShops, data: dataPackages }] = useLazyQuery(
    GET_ALL_PACKAGES,
    {
      variables: {
        input: { shopIds: checked }
      }
    }
  )

  const options = {
    refetchQueries: [
      {
        query: GET_ALL_PACKAGES,
        variables: {
          input: { shopIds: checked }
        }
      }
    ],
    awaitRefetchQueries: true
  }

  const [createOrder, { loading: loadingCreateOrder }] = useMutation(CREATE_ORDER, options)

  useEffect(() => {
    const title = 'Delivery - Loggi'
    setAppBar({ prominent: false, overhead: false, color: 'white', title: title.toLowerCase() })
    document.title = 'Loggi | Mee'
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [setAppBar])

  useEffect(() => {
    if (checked) {
      getPackages()
    }
  }, [checked, getPackages])

  useEffect(() => {
    window.Beacon('destroy')
  })

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const handleRefreshPackages = () => {
    getPackages()
  }

  /* DIALOG STEPPER */
  const handleBack = () => {
    switch (activeStep) {
      case CreateOrderLoggiSteps.selectOrder:
        setOpenDialog(false)
        setActiveStep(CreateOrderLoggiSteps.selectOrder)
        break
      case CreateOrderLoggiSteps.selectCustomer:
        setActiveStep(CreateOrderLoggiSteps.selectOrder)
        break
      case CreateOrderLoggiSteps.address:
        setActiveStep(CreateOrderLoggiSteps.selectCustomer)
        break
      case CreateOrderLoggiSteps.dimensions:
        setActiveStep(CreateOrderLoggiSteps.address)
        break
      case CreateOrderLoggiSteps.charge:
        setActiveStep(CreateOrderLoggiSteps.dimensions)
        break
      case CreateOrderLoggiSteps.pickup:
        setActiveStep(CreateOrderLoggiSteps.charge)
        break
      case CreateOrderLoggiSteps.newPickupAddress:
        setActiveStep(CreateOrderLoggiSteps.pickup)
        break
      case CreateOrderLoggiSteps.review:
        setActiveStep(CreateOrderLoggiSteps.pickup)
        break
      default:
        break
    }
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
  }

  const handleSelectOrder = async (order) => {
    setSelectedOrder(order)

    try {
      setActiveStep(CreateOrderLoggiSteps.selectCustomer)
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleAddNewCustomer = () => {
    setActiveStep(CreateOrderLoggiSteps.newCustomer)
  }

  const handleNewCustomerSubmit = async (input) => {
    try {
      const {
        data: { createCustomer: customer }
      } = await createCustomer({ variables: { input } })
      await updateOrder({ variables: { id: selectedOrder._id, input: { customer: customer._id } } })
      setSelectedCustomer(customer)
      setActiveStep(CreateOrderLoggiSteps.address)
      openNotification({
        variables: { input: { variant: 'success', message: 'Cliente criado com sucesso!' } }
      })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleSelectCustomer = async (customer) => {
    setSelectedCustomer(customer)

    try {
      setActiveStep(CreateOrderLoggiSteps.address)
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleChangeAddress = (address) => {
    setSelectedAddressId(address._id)
  }

  const handleEditNewAddress = (address) => {
    setAddress(address)
    setActiveStep(CreateOrderLoggiSteps.newAddress)
  }

  const handleAddNewAddress = () => {
    setActiveStep(CreateOrderLoggiSteps.newAddress)
  }

  const handleShippingSelectionSubmit = async (update) => {
    try {
      setAddress(update.delivery.address)
      setActiveStep(CreateOrderLoggiSteps.dimensions)
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleDeleteAddress = async (id) => {
    try {
      await deleteCustomerAddress({ variables: { id: selectedCustomer?._id, address: id } })
      if (selectedAddressId === id) setSelectedAddressId(null)
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleDimensionsSubmit = async (dimensions) => {
    try {
      setSelectedDimensions(dimensions)
      setActiveStep(CreateOrderLoggiSteps.charge)
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleChargeSelect = async (data) => {
    try {
      setSelectedCharge(data.delivery.paymentType)
      setChange(data.delivery.change)
      setActiveStep(CreateOrderLoggiSteps.pickup)
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleAddNewPickupAddres = async (charge) => {
    try {
      setActiveStep(CreateOrderLoggiSteps.newPickupAddress)
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleEditNewPickupAddress = (address) => {
    setPickupAddress(address)
    setActiveStep(CreateOrderLoggiSteps.newPickupAddress)
  }

  const handlePostalCodeBlur = async (value) => {
    try {
      const { state, city, street, neighborhood } = await cep(value)
      setAddress({ postalCode: value, state, city, street, district: neighborhood })
    } catch (error) {
      setAddress({ postalCode: value })
    }
  }

  const handleCreateCustomerAddress = async (input) => {
    try {
      const {
        data: {
          createCustomerAddress: { addresses }
        }
      } = await createCustomerAddress({ variables: { id: selectedCustomer._id, input } })
      await updateOrder({
        variables: {
          id: selectedOrder._id,
          input: { delivery: { address: addresses[addresses.length - 1] } }
        }
      })
      setAddress(input)
      setSelectedAddressId(addresses[addresses.length - 1]._id)
      setActiveStep(CreateOrderLoggiSteps.dimensions)
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleUpdateCustomerAddress = async ({ _id, ...input }) => {
    try {
      await updateCustomerAddress({ variables: { id: selectedCustomer._id, address: _id, input } })
      await updateOrder({
        variables: { id: selectedOrder._id, input: { delivery: { address: { _id, ...input } } } }
      })
      setAddress(input)
      setSelectedAddressId(_id)
      setActiveStep(CreateOrderLoggiSteps.dimensions)
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleCustomerAddressSubmit = (input) => {
    input._id ? handleUpdateCustomerAddress(input) : handleCreateCustomerAddress(input)
  }

  const handlePickupPostalCode = async (value) => {
    try {
      const { state, city, street, neighborhood } = await cep(value)
      setPickupAddress({ postalCode: value, state, city, street, district: neighborhood })
    } catch (error) {
      setPickupAddress({ postalCode: value })
    }
  }

  const handleUpsertPickupAddressSubmit = async (input) => {
    const { _id, ...data } = input
    await updateMe({ variables: { input: { address: data } } })
    setActiveStep(CreateOrderLoggiSteps.review)
  }

  const handlePickupSubmit = async (address) => {
    setPickupAddress(address)
    setActiveStep(CreateOrderLoggiSteps.review)
  }

  const handleEditCustomer = async () => {
    setActiveStep(CreateOrderLoggiSteps.selectCustomer)
  }

  const handleEditOrder = async () => {
    setActiveStep(CreateOrderLoggiSteps.selectOrder)
  }

  const handleEditDimensions = async () => {
    setActiveStep(CreateOrderLoggiSteps.dimensions)
  }

  const handleEditDeliveryAddress = async () => {
    setActiveStep(CreateOrderLoggiSteps.address)
  }

  const handleEditPickupAddress = async () => {
    setActiveStep(CreateOrderLoggiSteps.pickup)
  }

  const handleEditCharge = async () => {
    setActiveStep(CreateOrderLoggiSteps.charge)
  }

  const resetOrderData = async () => {
    setSelectedOrder(null)
    setSelectedCustomer(null)
    setSelectedCharge(null)
    setChange(null)
    setAddress(null)
    setPickupAddress(null)
    setSelectedDimensions(null)
  }

  const handleConfirmCreateOrder = async () => {
    const geoDataDelivery = await addressUtils.geocodeAddress(address)
    const geoDataPickup = await addressUtils.geocodeAddress(pickupAddress)

    if (!geoDataDelivery && !geoDataPickup) {
      return openNotification({
        variables: {
          input: { variant: 'error', message: 'Erro ao tentar pegar geo localização do endereço.' }
        }
      })
    }

    try {
      if (shops && shops.length > 0) {
        const shop = shops[0].node
        const input = loggi.buildOrderInput({
          shop,
          geoDataPickup,
          pickupAddress,
          geoDataDelivery,
          address,
          customer: selectedCustomer,
          dimensions: selectedDimensions,
          charge: selectedCharge,
          change,
          order: selectedOrder
        })

        await createOrder({
          variables: {
            input
          }
        })

        setOpenDialog(false)
        resetOrderData()
        openNotification({
          variables: { input: { variant: 'success', message: 'Pedido criado com sucesso!' } }
        })

        analytics.logEvent(FirebaseEvents.CREATE_LOGGI_ORDER, { shop: shop.pk })
      } else {
        openNotification({
          variables: { input: { variant: 'error', message: 'Nenhuma loja da loggi cadastrada!' } }
        })
      }
    } catch (e) {
      openNotification({ variables: { input: { variant: 'error', message: e.message } } })
    }
  }

  const fab = {
    actions: [
      {
        icon: <AddIcon />,
        label: 'Enviar pedido',
        onClick: () => {
          setOpenDialog(true)
        }
      }
    ]
  }

  const fullScreen = !upMedium
  const packages = dataPackages?.allPackagesLoggi?.edges

  return (
    <Page className={classes.root}>
      <Main fab={fab}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card className={classes.root}>
              <CardContent>
                <Typography className={classes.title} color='textSecondary' gutterBottom>
                  Suas lojas
                  <Tooltip
                    title={
                      'Lista das suas lojas cadastradas na Loggi. Seleciona a loja a qual você deseja ver os pacotes'
                    }
                  >
                    <HelpOutline className={classes.icon} />
                  </Tooltip>
                </Typography>
                {loadingShops && !shops && <Loading />}
                {shops && (
                  <List className={classes.root}>
                    {shops.map(({ node }) => {
                      const labelId = `checkbox-list-label-${node.pk}`

                      return (
                        <ListItem
                          key={node.pk}
                          role={undefined}
                          dense
                          button
                          onClick={handleToggle(node.pk)}
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge='start'
                              checked={checked.indexOf(node.pk) !== -1}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          </ListItemIcon>
                          <ListItemText id={labelId} primary={node.name} />
                        </ListItem>
                      )
                    })}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box
                  display='flex'
                  flexDirection='row'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Box>
                    <Typography className={classes.title} color='textSecondary' gutterBottom>
                      Seus pacotes
                      <Tooltip
                        title={
                          'Lista dos pacotes em andamento das lojas selecionadas. Se nada for selecionado nós mostramos todos os pacotes.'
                        }
                      >
                        <HelpOutline className={classes.icon} />
                      </Tooltip>
                    </Typography>
                  </Box>
                  <IconButton
                    className={classes.refreshButton}
                    onClick={handleRefreshPackages}
                    aria-label='atualizar pacotes'
                  >
                    <RefreshIcon />
                  </IconButton>
                </Box>
                {loadingCreateOrder && !packages && <Loading />}
                {packages && packages.length === 0 && (
                  <Typography
                    className={classes.noPackagesText}
                    display='block'
                    align='center'
                    variant='body1'
                  >
                    Você ainda não tem nenhum pacote. <br /> Clique em {'"+"'} para enviar um pedido
                    pela Loggi.
                  </Typography>
                )}
                {packages && packages.length > 0 && (
                  <Table className={classes.table} size='small' aria-label='a dense table'>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID Pacote</TableCell>
                        <TableCell align='right'>Status Pacote</TableCell>
                        <TableCell align='right'>ID Pedido</TableCell>
                        <TableCell align='right'>Status Pedido</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {packages.map(({ node }) => (
                        <TableRow key={node.pk}>
                          <TableCell component='th' scope='row'>
                            {node.pk}
                          </TableCell>
                          <TableCell align='right'>{node.status}</TableCell>
                          <TableCell align='right'>{node.orderId}</TableCell>
                          <TableCell align='right'>{node.orderStatus}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <DialogStepper
          fullScreen={fullScreen}
          fullWidth
          open={openDialog}
          activeStep={activeStep}
          onBack={handleBack}
          onClose={handleDialogClose}
        >
          <UpsertSelectOneStep
            id={CreateOrderLoggiSteps.selectOrder}
            title='Selecione o pedido'
            onSelect={handleSelectOrder}
            getQuery={ORDERS}
            getQueryName={'orders'}
            searchQuery={SEARCH_ORDERS}
            searchQueryName={'searchOrders'}
            entity={'orders'}
            entitiyLabel={'pedidos'}
            noDataText={'Nenhum pedido encontrado'}
            primaryTextAttributes={'shortID'}
            secondaryTextAttributes={'title'}
          />
          <CustomerSearchStep
            id={CreateOrderLoggiSteps.selectCustomer}
            title='Qual o telefone do cliente?'
            onSelect={handleSelectCustomer}
            onAddNew={handleAddNewCustomer}
          />
          <UpsertCustomerStep
            id={CreateOrderLoggiSteps.newCustomer}
            title='Adicione um cliente'
            onSubmit={handleNewCustomerSubmit}
          />
          <ShippingSelectionStep
            id={CreateOrderLoggiSteps.address}
            title='Qual o endereço da entrega?'
            addresses={selectedCustomer?.addresses}
            value={selectedAddressId}
            onChange={handleChangeAddress}
            onEdit={handleEditNewAddress}
            onDelete={handleDeleteAddress}
            onAddNew={handleAddNewAddress}
            onSubmit={handleShippingSelectionSubmit}
          />
          <UpsertAddressStep
            id={CreateOrderLoggiSteps.newAddress}
            title='Adicione um endereço'
            initialValues={address}
            onPostalCodeBlur={handlePostalCodeBlur}
            onSubmit={handleCustomerAddressSubmit}
          />
          <DimensionsStep
            id={CreateOrderLoggiSteps.dimensions}
            title={'Quais são as dimensões do pacote ?'}
            dimensions={selectedDimensions}
            onSubmit={handleDimensionsSubmit}
          />
          <PaymentSelectionStep
            id={CreateOrderLoggiSteps.charge}
            title='Qual será a forma de pagamento ?'
            source='loggi'
            paymentMethods={PaymentsLoggi}
            onSelect={handleChargeSelect}
          />
          <PickupSelectionStep
            id={CreateOrderLoggiSteps.pickup}
            title='Qual o endereço de retirada do pacote?'
            addresses={me.address ? [me.address] : null}
            onChange={() => {}}
            onEdit={handleEditNewPickupAddress}
            onDelete={() => {}}
            onAddNew={handleAddNewPickupAddres}
            onSubmit={handlePickupSubmit}
          />
          <UpsertAddressStep
            id={CreateOrderLoggiSteps.newPickupAddress}
            title='Adicione um endereço de retirada do pacote'
            initialValues={pickupAddress}
            onPostalCode={handlePickupPostalCode}
            onSubmit={handleUpsertPickupAddressSubmit}
          />
          <CreateOrderReviewStep
            id={CreateOrderLoggiSteps.review}
            title='Confirme os dados'
            loading={loadingCreateOrder}
            data={{
              customer: selectedCustomer,
              order: selectedOrder,
              dimensions: selectedDimensions,
              deliveryAddress: address,
              pickupAddress: pickupAddress,
              charge: selectedCharge
            }}
            onEditCustomer={handleEditCustomer}
            onEditOrder={handleEditOrder}
            onEditDimensions={handleEditDimensions}
            onEditDeliveryAddress={handleEditDeliveryAddress}
            onEditPickupAddress={handleEditPickupAddress}
            onEditCharge={handleEditCharge}
            onConfirm={handleConfirmCreateOrder}
          />
        </DialogStepper>
      </Main>
    </Page>
  )
}

LoggiView.propTypes = {}

LoggiView.defaultProps = {}

export default LoggiView
