import React, { useContext, useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import Tour from 'reactour'

import { useQuery } from '@apollo/react-hooks'
import moment from 'moment'
import PropTypes from 'prop-types'

import Paper from '@material-ui/core/Paper'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

import Alert from 'src/components/Alert'
import Dialog from 'src/components/Dialog'
import Main from 'src/components/Main'
import OrderList from 'src/components/OrderList'
import TabPanel from 'src/components/TabPanel'

import OrderPreviewContent from 'src/views/SalesView/OrderPreviewContent'
import UpsertOrderContent from 'src/views/SalesView/UpsertOrderContent'

import { GET_SETTINGS } from 'src/graphql/settings/queries'

import AppBarContext from 'src/contexts/AppBarContext'

import useCompany from 'src/hooks/useCompany'
import useLocalSearch from 'src/hooks/useLocalSearch'
import useMe from 'src/hooks/useMe'
import useOrder from 'src/hooks/useOrder'
import useOrders from 'src/hooks/useOrders'
import useOrderSubscription from 'src/hooks/useOrderSubscription'

import AddPaymentContent from 'src/dialogs/AddPaymentDialog/AddPaymentContent'
import EditTitleOrderContent from 'src/dialogs/EditTitleOrderContent'
import InvoiceContent from 'src/dialogs/InvoiceContent'
import OpenRegisterWarningContent from 'src/dialogs/OpenRegisterWarningContent'
import ProductionRequestsContent from 'src/dialogs/ProductionRequestsContent'
import TransferItemsContent from 'src/dialogs/TransferItemsContent'
import UpsertDeliveryDialog from 'src/dialogs/UpsertDeliveryDialog'
import UpsertDiscountContent from 'src/dialogs/UpsertDiscountContent'
import UpsertFeesContent from 'src/dialogs/UpsertFeesContent'

import { FirebaseEvents, OrderStatus, FinancialFundCategories } from 'src/utils/enums'

import { analytics } from 'src/firebase'

import useStyles from './styles'
const TabStatus = Object.freeze({
  OPEN: '0',
  CLOSED: '1',
  CANCELED: '2'
})

const DialogContents = {
  createOrder: 'createOrder',
  addTitle: 'addTitle',
  registerWarning: 'registerWarning'
}

const INITIAL_DIALOG_STATE = {
  create: false,
  edit: false,
  title: false,
  switch: false,
  registerWarning: false,
  preview: false,
  pay: false,
  addItems: false,
  closeOrder: false,
  editTitle: false,
  invoice: false,
  transferItems: false,
  discount: false,
  productionRequests: false,
  fees: false,
  cancelOrder: false,
  delivery: false
}

const OrdersView = ({ onToggleChange }) => {
  const classes = useStyles()
  const location = useLocation()

  const { state } = location

  const { me } = useMe()

  const {
    getMyCompany: [getMyCompany, { data }]
  } = useCompany()
  const company = data?.myCompany

  const [setItems, searchResult] = useLocalSearch({
    options: {
      keys: ['title', 'shortID', 'customer.firstName', 'customer.lastName']
    }
  })

  const [, setAppBar] = useContext(AppBarContext)
  const [tab, setTab] = useState(TabStatus.OPEN)
  const [openDialog, setOpenDialog] = useState(INITIAL_DIALOG_STATE)
  const [openTour, setOpenTour] = useState(state?.tour)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderData, setOrderData] = useState(null)
  const [orderMerge, setOrderMerge] = useState(null)
  const [openAlert, setOpenAlert] = useState(false)
  // delivery flow
  const [isAddCustomer, setIsAddCustomer] = useState(false)

  const {
    data: { settings }
  } = useQuery(GET_SETTINGS)

  const {
    addItems,
    upsertOrder,
    addPayment,
    closeOrder,
    generateInvoice,
    sendInvoiceEmail,
    cancelOrder,
    loading
  } = useOrder()

  const { order } = useOrderSubscription()
  const { orders: ordersClosed, refetch: refetchClosedOrders } = useOrders({
    first: 0,
    skip: 0,
    start: moment()
      .startOf('day')
      .toISOString(),
    end: moment()
      .endOf('day')
      .toISOString(),
    status: [OrderStatus.closed.type]
  })

  const { orders: ordersCanceled, refetch: refetchCanceledOrders } = useOrders({
    first: 0,
    skip: 0,
    start: moment()
      .startOf('day')
      .toISOString(),
    end: moment()
      .endOf('day')
      .toISOString(),
    status: [OrderStatus.canceled.type]
  })

  const { orders: openOrders, refetch: refetchOpenOrders } = useOrders({
    first: 0,
    skip: 0,
    status: [OrderStatus.open.type, OrderStatus.confirmed.type, OrderStatus.partially_paid.type]
  })

  const salesTypeValue = settings.options.salesType

  useEffect(() => {
    const title = 'Pedidos'
    setAppBar({
      prominent: false,
      overhead: false,
      color: 'white',
      title: title.toLowerCase(),
      salesToggle: true,
      salesTypeValue,
      onToggleChange
    })
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  }, [salesTypeValue])

  useEffect(() => {
    getMyCompany()
  }, [])

  useEffect(() => {
    if (openOrders?.orders) setItems(openOrders.orders)
  }, [openOrders?.orders])

  useEffect(() => {
    const ordersArray = openOrders?.orders

    let hasOrderOpenArray = false
    let hasOrderChangedStatus = false

    if (ordersArray) {
      const found = ordersArray.find((item) => item._id === order._id)
      hasOrderOpenArray = !!found

      if (hasOrderOpenArray) {
        hasOrderChangedStatus = order.status !== 'open'
      }
    }

    if (!hasOrderOpenArray) {
      refetchOpenOrders()
    } else if (hasOrderChangedStatus) {
      refetchClosedOrders()
      refetchCanceledOrders()
      refetchOpenOrders()
    }
  }, [order])

  useEffect(() => {
    if (tab === TabStatus.OPEN) {
      refetchOpenOrders({
        input: {
          filter: {
            first: 0,
            skip: 0,
            status: [
              OrderStatus.open.type,
              OrderStatus.confirmed.type,
              OrderStatus.partially_paid.type
            ]
          }
        }
      })
    } else if (tab === TabStatus.CLOSED) {
      refetchClosedOrders({
        input: {
          filter: {
            first: 0,
            skip: 0,
            start: moment()
              .startOf('day')
              .toISOString(),
            end: moment()
              .endOf('day')
              .toISOString(),
            status: [OrderStatus.closed.type]
          }
        }
      })
    } else if (tab === TabStatus.CANCELED) {
      refetchCanceledOrders({
        input: {
          filter: {
            first: 0,
            skip: 0,
            start: moment()
              .startOf('day')
              .toISOString(),
            end: moment()
              .endOf('day')
              .toISOString(),
            status: [OrderStatus.canceled.type]
          }
        }
      })
    }
  }, [tab])

  const handleOpenDialog = () => {
    /* DISABLE FORCE OPEN REGISTER TEMPORARILY */

    // const registers = company?.financialFunds.filter(
    //   (fund) => fund.category === FinancialFundCategories.REGISTER
    // )

    // let mustOpenRegister = false
    //
    // if (registers) {
    //   for (const register of registers) {
    //     if (!register.hasOpenedRegister) {
    //       mustOpenRegister = true
    //     }
    //   }
    // }

    // if (company.settings.forceOpenRegister && mustOpenRegister) {
    //   setOpenDialog((state) => ({ ...state, registerWarning: true }))
    // } else {
    //   setOpenTour(false)
    //   setOpenDialog((state) => ({ ...state, create: true }))
    // }
    setOpenTour(false)
    setOpenDialog((state) => ({ ...state, create: true }))
  }

  const handleCloseDialog = () => {
    if (openDialog?.delivery) setIsAddCustomer(false)

    setOpenDialog(INITIAL_DIALOG_STATE)
  }

  const handleExitDialog = () => {
    setSelectedOrder(null)
  }

  const handleSubmit = (order) => {
    if (company?.productionLines?.length > 0) {
      setOrderData(order)
      setOpenDialog((state) => ({ ...state, create: false, title: true }))
    } else {
      upsertOrder(order, { onSuccess: handleCloseDialog })
    }
  }

  const handleSubmitWithTitle = (data) => {
    // check if we have open orders with this same title
    const orders = openOrders?.orders || []

    const found = orders.find((order) => order.title?.toLowerCase() === data.title.toLowerCase())

    if (found) {
      setOrderData({ title: data.title, ...orderData })
      setOrderMerge(found)
      setOpenAlert(true)
    } else {
      upsertOrder(
        { ...orderData, title: data.title },
        {
          onSuccess: () => {
            handleCloseDialog()
            setOrderData(null)
          }
        }
      )
    }
  }

  const handleCloseAndSubmit = () => {
    upsertOrder(orderData, {
      onSuccess: () => {
        handleCloseDialog()
        setOrderData(null)
      }
    })
  }

  const handleTabChange = (event, newValue) => {
    if (tab !== newValue) {
      setTab(newValue)
    }
  }

  const handleCloseTour = () => {
    setOpenTour(false)
  }

  const handleCloseAlert = () => {
    setOpenAlert(false)
  }

  const handleAlertMergeSubmit = () => {
    setOpenAlert(false)
    addItems(
      { _id: orderMerge._id },
      { items: orderData.items },
      {
        onSuccess: () => {
          handleCloseDialog()
          setOrderData(null)
        }
      }
    )
  }

  /* CALL BACKS */

  const handleSelectItem = useCallback((order) => {
    setSelectedOrder(order)
    setOpenDialog((state) => ({ ...state, preview: true }))
  }, [])

  const handleEdit = useCallback((order) => {
    setSelectedOrder(order)
    setOpenDialog((state) => ({ ...state, edit: true }))
  }, [])

  const handleAddPayment = useCallback((order) => {
    setSelectedOrder(order)
    setOpenDialog((state) => ({ ...state, pay: true }))
  }, [])

  const handleAddItems = useCallback((order) => {
    setSelectedOrder(order)
    setOpenDialog((state) => ({ ...state, addItems: true }))
  }, [])

  const handleCloseOrder = useCallback((order) => {
    setSelectedOrder(order)
    setOpenDialog((state) => ({ ...state, closeOrder: true }))
  }, [])

  const handleEditTitle = useCallback((order) => {
    setSelectedOrder(order)
    setOpenDialog((state) => ({ ...state, editTitle: true }))
  }, [])

  const handleInvoice = useCallback((order) => {
    setSelectedOrder(order)
    setOpenDialog((state) => ({ ...state, invoice: true }))
  }, [])

  const handleTransferItems = useCallback((order) => {
    setSelectedOrder(order)
    setOpenDialog((state) => ({ ...state, transferItems: true }))
  }, [])

  const handleDiscount = useCallback((order) => {
    setSelectedOrder(order)
    setOpenDialog((state) => ({ ...state, discount: true }))
  }, [])

  const handleProductionRequests = useCallback((order) => {
    setSelectedOrder(order)
    setOpenDialog((state) => ({ ...state, productionRequests: true }))
  }, [])

  const handleFees = useCallback((order) => {
    setSelectedOrder(order)
    setOpenDialog((state) => ({ ...state, fees: true }))
  }, [])

  const handleCancel = useCallback((order) => {
    setSelectedOrder(order)
    setOpenDialog((state) => ({ ...state, cancelOrder: true }))
  }, [])

  const handleAddCustomer = useCallback((order) => {
    setSelectedOrder(order)
    setIsAddCustomer(true)
    setOpenDialog((state) => ({ ...state, delivery: true }))
  }, [])

  const handleDelivery = useCallback((order) => {
    setSelectedOrder(order)
    setIsAddCustomer(false)
    setOpenDialog((state) => ({ ...state, delivery: true }))
  }, [])

  /* SUBMITS */

  const handlePaymentSubmit = (input) => {
    addPayment(selectedOrder, input, { onSuccess: handleCloseDialog })
  }

  const handleUpsertOrder = (order) => {
    upsertOrder(order, { onSuccess: handleCloseDialog })
  }

  const handleCloseOrderSubmit = () => {
    closeOrder(selectedOrder, {
      onSuccess: () => {
        handleCloseDialog()
      }
    })
  }

  const handleEditTitleSubmit = async (data) => {
    await upsertOrder(
      { _id: selectedOrder._id, title: data.title },
      { onSuccess: handleCloseDialog }
    )
  }

  const handleGenerateInvoice = () => {
    generateInvoice(selectedOrder, {
      onSuccess: () => {
        handleCloseDialog()
      }
    })
  }

  const handleSendInvoiceEmail = (order, email) => {
    sendInvoiceEmail(selectedOrder, email, {
      onSuccess: () => {
        handleCloseDialog()
      }
    })
  }

  const handleTransferSubmit = async ({ orderLeft, orderRight }) => {
    await upsertOrder({
      _id: orderLeft._id,
      items: orderLeft.items,
      shouldGenerateProductionRequest: false
    })
    await upsertOrder({
      _id: orderRight._id,
      items: orderRight.items,
      shouldGenerateProductionRequest: false
    })

    handleCloseDialog()
  }

  const handleDiscountSubmit = async (data) => {
    upsertOrder(
      { _id: selectedOrder._id, discount: data.discount },
      { onSuccess: handleCloseDialog }
    )
  }

  const handleFeesSubmit = async (data) => {
    upsertOrder({ _id: selectedOrder._id, fees: data }, { onSuccess: handleCloseDialog })
  }

  const handleCancelOrder = async () => {
    cancelOrder(selectedOrder, null, {
      onSuccess: () => {
        handleCloseDialog()
      }
    })
  }

  const handleAddItemsSubmit = async (input) => {
    // check for existing items
    // const newItems = selectedOrder.items.map((item) => {
    //   const found = input.items.find((i) => i.product === item.product)
    //   if (found) {
    //     item.quantity += found.quantity
    //   }
    //   return item
    // })

    // add new items
    // for (const item of input.items) {
    //   const found = selectedOrder.items.find((i) => i.product === item.product)
    //
    //   // is a new item
    //   if (!found) {
    //     newItems.push(item)
    //   }
    // }

    await addItems(
      { _id: selectedOrder._id },
      { items: input.items },
      { onSuccess: handleCloseDialog }
    )
  }

  const steps = [
    {
      selector: '[id="create-order"]',
      content: 'Clique aqui para criar um pedido'
    }
  ]

  const fab = { id: 'create-order', actions: { onClick: handleOpenDialog } }

  return (
    <Main fab={fab}>
      <Paper className={classes.tabs} square>
        <Tour
          steps={steps}
          isOpen={me?.onboarding.finishedAddOrder ? false : openTour}
          onRequestClose={handleCloseTour}
          rounded={10}
          showButtons={false}
          showNavigation={false}
          showNavigationNumber={false}
        />
        <Tabs
          value={tab}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
          onChange={handleTabChange}
        >
          <Tab value={TabStatus.OPEN} label='Abertos' />
          <Tab value={TabStatus.CLOSED} label='Finalizados' />
          <Tab value={TabStatus.CANCELED} label='Cancelados' />
        </Tabs>
      </Paper>
      <TabPanel value={tab} tab={TabStatus.OPEN}>
        {
          <OrderList
            orders={searchResult.length > 0 ? searchResult : openOrders?.orders}
            onEdit={handleEdit}
            onFees={handleFees}
            onCancel={handleCancel}
            onInvoice={handleInvoice}
            onDelivery={handleDelivery}
            onDiscount={handleDiscount}
            onSelect={handleSelectItem}
            onEditTitle={handleEditTitle}
            onAddPayment={handleAddPayment}
            onAddItems={handleAddItems}
            onCloseOrder={handleCloseOrder}
            onAddCustomer={handleAddCustomer}
            onTransferItems={handleTransferItems}
            onProductionRequests={handleProductionRequests}
          />
        }
      </TabPanel>
      <TabPanel value={tab} tab={TabStatus.CLOSED}>
        {
          <OrderList
            orders={ordersClosed?.orders}
            onSelect={handleSelectItem}
            onInvoice={handleInvoice}
            onCancel={handleCancel}
          />
        }
      </TabPanel>
      <TabPanel value={tab} tab={TabStatus.CANCELED}>
        {
          <OrderList
            orders={ordersCanceled?.orders}
            onSelect={handleSelectItem}
            onInvoice={handleInvoice}
          />
        }
      </TabPanel>
      <Dialog open={openDialog.create} onClose={handleCloseDialog}>
        <UpsertOrderContent
          id={DialogContents.createOrder}
          loading={loading}
          title={'Crie seu pedido'}
          onClose={handleCloseDialog}
          onSubmit={handleSubmit}
        />
      </Dialog>
      <Dialog open={openDialog.registerWarning} onClose={handleCloseDialog}>
        <OpenRegisterWarningContent
          id={DialogContents.registerWarning}
          title={'Abra o caixa!'}
          registers={company?.financialFunds.filter(
            (fund) => fund.category === FinancialFundCategories.REGISTER
          )}
          onClose={handleCloseDialog}
        />
      </Dialog>
      <Dialog open={openDialog.title} onClose={handleCloseAndSubmit}>
        <EditTitleOrderContent
          id={DialogContents.addTitle}
          title='Adicione um título'
          loading={loading}
          onClose={handleCloseAndSubmit}
          onSubmit={handleSubmitWithTitle}
        />
      </Dialog>
      <Dialog open={openDialog.preview} onExited={handleExitDialog} onClose={handleCloseDialog}>
        <OrderPreviewContent
          id={DialogContents.orderPreview}
          title={`Pedido #${selectedOrder?.shortID}`}
          order={selectedOrder}
        />
      </Dialog>
      <Dialog open={openDialog.pay} onExited={handleExitDialog} onClose={handleCloseDialog}>
        <AddPaymentContent
          title={'Adicionar pagamento'}
          initialValues={{
            total: parseFloat((selectedOrder?.total - selectedOrder?.totalPaid).toFixed(2))
          }}
          loading={loading}
          onClose={handleCloseDialog}
          onSubmit={handlePaymentSubmit}
        />
      </Dialog>
      <Dialog open={openDialog.edit} onExited={handleExitDialog} onClose={handleCloseDialog}>
        <UpsertOrderContent
          id='edit'
          loading={loading}
          title={'Altere o pedido'}
          order={selectedOrder}
          onClose={handleCloseDialog}
          onSubmit={handleUpsertOrder}
        />
      </Dialog>
      <Dialog open={openDialog.addItems} onExited={handleExitDialog} onClose={handleCloseDialog}>
        <UpsertOrderContent
          addOnlyMode
          loading={loading}
          title={'Adicione items ao pedido'}
          order={selectedOrder}
          onClose={handleCloseDialog}
          onSubmit={handleAddItemsSubmit}
        />
      </Dialog>
      <Dialog open={openDialog.editTitle} onExited={handleExitDialog} onClose={handleCloseDialog}>
        <EditTitleOrderContent
          title='Editar título'
          order={selectedOrder}
          loading={loading}
          onClose={handleCloseDialog}
          onSubmit={handleEditTitleSubmit}
        />
      </Dialog>
      <Dialog open={openDialog.invoice} onExited={handleExitDialog} onClose={handleCloseDialog}>
        <InvoiceContent
          title='Nota Fiscal'
          loading={loading}
          order={selectedOrder}
          onClose={handleCloseDialog}
          onSubmit={handleGenerateInvoice}
          onSendInvoiceEmail={handleSendInvoiceEmail}
        />
      </Dialog>
      <Dialog
        open={openDialog.transferItems}
        onExited={handleExitDialog}
        onClose={handleCloseDialog}
      >
        <TransferItemsContent
          id='transferItems'
          title='Transferir itens'
          orders={openOrders?.orders || []}
          initialValues={selectedOrder}
          loading={loading}
          onClose={handleCloseDialog}
          onSubmit={handleTransferSubmit}
        />
      </Dialog>
      <Dialog open={openDialog.discount} onExited={handleExitDialog} onClose={handleCloseDialog}>
        <UpsertDiscountContent
          title='Adicionar desconto'
          loading={loading}
          order={selectedOrder}
          onClose={handleCloseDialog}
          onSubmit={handleDiscountSubmit}
        />
      </Dialog>
      <Dialog
        open={openDialog.productionRequests}
        onExited={handleExitDialog}
        onClose={handleCloseDialog}
      >
        <ProductionRequestsContent
          title='Histórico de modificações'
          productionRequests={selectedOrder?.productionRequests}
        />
      </Dialog>
      <Dialog open={openDialog.fees} onExited={handleExitDialog} onClose={handleCloseDialog}>
        <UpsertFeesContent
          title='Taxas'
          loading={loading}
          order={selectedOrder}
          onClose={handleCloseDialog}
          onSubmit={handleFeesSubmit}
        />
      </Dialog>
      {selectedOrder && (
        <UpsertDeliveryDialog
          isAddCustomer={isAddCustomer}
          open={openDialog.delivery}
          order={selectedOrder}
          onExited={handleExitDialog}
          onClose={handleCloseDialog}
        />
      )}

      <Alert
        open={openDialog.cancelOrder}
        loading={loading}
        onExited={handleExitDialog}
        title={'Cancelar pedido?'}
        onPrimary={handleCancelOrder}
        primaryLabel={'Cancelar pedido'}
        onSecondary={handleCloseDialog}
        secondaryLabel='Voltar'
      >
        {'Este pedido será cancelado permanentemente.'}
      </Alert>
      <Alert
        open={openDialog.closeOrder}
        loading={loading}
        onExited={handleExitDialog}
        onClose={handleCloseDialog}
        title={'Finalizar pedido?'}
        onPrimary={handleCloseOrderSubmit}
        primaryLabel={'Finalizar pedido'}
        onSecondary={handleCloseDialog}
        secondaryLabel='Cancelar'
      >
        {'Este pedido será finalizado permanentemente.'}
      </Alert>
      <Alert
        open={openAlert}
        loading={loading}
        onClose={handleCloseAlert}
        title={'Pedido já existe'}
        onPrimary={handleAlertMergeSubmit}
        primaryLabel={'Adicionar items'}
        onSecondary={handleCloseAlert}
        secondaryLabel='Cancelar'
      >
        {
          'Já existe um pedido em aberto com esse mesmo título. Deseja adicionar os items nesse pedido?'
        }
      </Alert>
    </Main>
  )
}

OrdersView.propTypes = {
  onToggleChange: PropTypes.func
}

OrdersView.defaultProps = {}

export default OrdersView
