import React, { useRef, useState, useEffect } from 'react'
import { useReactToPrint } from 'react-to-print'

import PropTypes from 'prop-types'

import Add from '@material-ui/icons/Add'
import Cancel from '@material-ui/icons/CancelOutlined'
import Edit from '@material-ui/icons/EditOutlined'
import Payment from '@material-ui/icons/Payment'
import Print from '@material-ui/icons/PrintOutlined'
import Receipt from '@material-ui/icons/Receipt'

import Dialog from 'src/components/Dialog'
import List from 'src/components/List'
import ListItemAction from 'src/components/ListItemAction'
import Main from 'src/components/Main'
import OrderReceipt from 'src/components/OrderReceipt'
import Page from 'src/components/Page'
import Placeholder from 'src/components/Placeholder'

import CancelOrderContent from 'src/views/SalesView/CancelOrderContent'
import OrderPreviewContent from 'src/views/SalesView/OrderPreviewContent'
import UpsertOrderContent from 'src/views/SalesView/UpsertOrderContent'

import useOrder from 'src/hooks/useOrder'

import AddPaymentContent from 'src/dialogs/AddPaymentDialog/AddPaymentContent'
import InvoiceContent from 'src/dialogs/InvoiceContent'

import { FirebaseEvents, LabelTypes, Origins, OrderStatus } from 'src/utils/enums'

import helpscout from 'src/services/helpscout'

import { analytics } from 'src/firebase'

import useStyles from './styles'

const labels = [
  {
    key: ['shortID'],
    name: 'ID'
  },
  {
    key: ['origin'],
    name: 'Origem'
  },
  {
    key: ['customerName'],
    name: 'Cliente'
  },
  {
    key: ['status'],
    name: 'Status'
  },
  {
    key: ['total'],
    name: 'Total',
    type: 'currency'
  },
  {
    key: ['createdAt'],
    type: LabelTypes.date,
    name: 'Criado em',
    format: 'DD/MM/YYYY HH:mm:ss'
  }
]

const DialogContents = {
  orderPreview: 'orderPreview',
  upsertOrder: 'upsertOrder',
  cancelOrder: 'cancelOrder',
  payment: 'payment',
  invoice: 'invoice'
}

const OrdersHistoryView = ({
  orders,
  term,
  filters,
  loading,
  openDialog,
  searchResults,
  onUpsertOrder,
  onCancelOrder,
  onFilterChange,
  onSearchChange,
  onSetOpenDialog,
  onPageChange,
  onRowsPerPageChange
}) => {
  const classes = useStyles()

  const orderReceiptRef = useRef()
  const handlePrint = useReactToPrint({ content: () => orderReceiptRef.current })
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [activeContent, setActiveContent] = useState(DialogContents.salesTypeSetup)

  const { addPayment, generateInvoice, sendInvoiceEmail, loading: loadingAddPayment } = useOrder()

  /**
   * USE EFFECT
   */

  useEffect(() => {
    const title = 'Histórico de pedidos'
    document.title = `${title} | Mee`
    analytics.logEvent(FirebaseEvents.SCREEN_VIEW, { screen_name: title })
  })

  useEffect(() => {
    helpscout.hideBeacon()
  }, [])

  /**
   * CONTROLLERS
   */

  const handlePageChange = (currentPage) => {
    onPageChange(currentPage)
  }

  const handleRowsPerPageChange = (rows) => {
    onRowsPerPageChange(rows)
  }

  const handleCreateOrderOpen = () => {
    onSetOpenDialog(true)
    setActiveContent(DialogContents.upsertOrder)
  }

  const handleCancelOrderOpen = (order) => async () => {
    setSelectedOrder(order)
    onSetOpenDialog(true)
    setActiveContent(DialogContents.cancelOrder)
  }

  const handlePrintClick = (order) => async () => {
    await setSelectedOrder(order)
    handlePrint()
  }

  const handleUpdateOrderOpen = (order) => async () => {
    setSelectedOrder(order)
    onSetOpenDialog(true)
    setActiveContent(DialogContents.upsertOrder)
  }

  const handleCloseDialog = () => {
    onSetOpenDialog(false)
  }

  const handleUpsertOrder = (cart) => {
    onUpsertOrder(cart)
    setSelectedOrder(null)
  }

  const handleCancelOrder = (values) => {
    onCancelOrder(selectedOrder, values)
    setSelectedOrder(null)
  }

  const handleClick = (order) => {
    setSelectedOrder(order)
    onSetOpenDialog(true)
    setActiveContent(DialogContents.orderPreview)
  }

  const handleAddPayment = (order) => (input) => {
    onSetOpenDialog(true)
    setSelectedOrder(order)
    setActiveContent(DialogContents.payment)
  }

  const handleInvoice = (order) => (input) => {
    onSetOpenDialog(true)
    setSelectedOrder(order)
    setActiveContent(DialogContents.invoice)
  }

  const handleGenerateInvoice = (order) => {
    generateInvoice(order, {
      onSuccess: () => {
        handleCloseDialog()
      }
    })
  }

  const handleSendInvoiceEmail = (order, email) => {
    sendInvoiceEmail(order, email, {
      onSuccess: () => {
        handleCloseDialog()
      }
    })
  }

  const handlePaymentSubmit = async (input) => {
    await addPayment(selectedOrder, input)
    setSelectedOrder(null)
    handleCloseDialog()
  }

  const hasFilter =
    filters.start ||
    filters.end ||
    term ||
    filters?.status?.length > 0 ||
    filters?.payments?.length > 0 ||
    filters?.origin?.length > 0
  const hasOrders = orders?.pagination?.totalItems !== 0
  const pagination = orders?.pagination

  /**
   * FAB & ACTIONS
   */

  const actions = [
    {
      startIcon: <Add />,
      label: 'Criar pedido',
      variant: 'outlined',
      color: 'primary',
      onClick: handleCreateOrderOpen
    }
  ]
  const fab = { actions: { onClick: handleCreateOrderOpen } }
  const placeholder = !hasOrders && !hasFilter && (
    <Placeholder
      icon={<Receipt />}
      message={'Ainda não há pedidos'}
      symbol={'👋'}
      actions={actions}
    />
  )

  return (
    <Page className={classes.root}>
      <Main fab={fab} placeholder={placeholder}>
        <List
          loading={loading}
          filters={filters}
          labels={labels}
          items={orders?.orders}
          search={{
            loading: searchResults.loading,
            placeholder: 'Pesquisar pedidos',
            items: searchResults.data,
            value: term,
            onChange: onSearchChange
          }}
          getItemTitle={(item) => item.shortID}
          getItemAdornmentTitle={(item) => OrderStatus[item.status].label}
          getItemSubtitle={(item) => Origins[item.origin].label}
          getItemDescription={(item) => item.createdAt.toDate()}
          onClick={handleClick}
          pagination={pagination}
          onPageChange={handlePageChange}
          onFilterChange={onFilterChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          renderActions={(item, index, disabled) => (
            <>
              {item._id === selectedOrder?._id && (
                <OrderReceipt ref={orderReceiptRef} order={item} />
              )}
              <ListItemAction title='Imprimir' onClick={handlePrintClick(item)}>
                <Print />
              </ListItemAction>
              <ListItemAction
                disabled={item.status !== OrderStatus.open.type}
                title='Editar'
                onClick={handleUpdateOrderOpen(item)}
              >
                <Edit />
              </ListItemAction>
              <ListItemAction
                disabled={
                  item.status !== OrderStatus.open.type &&
                  item.status !== OrderStatus.partially_paid.type
                }
                title='Adicionar pagamento'
                onClick={handleAddPayment(item)}
              >
                <Payment />
              </ListItemAction>
              <ListItemAction
                disabled={item.status !== OrderStatus.closed.type}
                title='Nota Fiscal'
                onClick={handleInvoice(item)}
              >
                <Receipt />
              </ListItemAction>
              <ListItemAction
                title='Cancelar'
                disabled={item.status === OrderStatus.canceled.type}
                onClick={handleCancelOrderOpen(item)}
              >
                <Cancel />
              </ListItemAction>
            </>
          )}
        />
        <Dialog
          className={classes.dialog}
          open={openDialog}
          activeContent={activeContent}
          onClose={handleCloseDialog}
          onExited={handleCloseDialog}
        >
          <OrderPreviewContent
            id={DialogContents.orderPreview}
            title={`Pedido #${selectedOrder?.shortID}`}
            order={selectedOrder}
          />
          <UpsertOrderContent
            id={DialogContents.upsertOrder}
            title={selectedOrder ? 'Atualize seu pedido' : 'Crie seu pedido'}
            fullScreen={false}
            order={selectedOrder}
            onClose={handleCloseDialog}
            onSubmit={handleUpsertOrder}
          />

          <CancelOrderContent
            id={DialogContents.cancelOrder}
            title={'Cancelar Pedido'}
            fullScreen={false}
            origin={selectedOrder?.origin}
            onCancelOrder={handleCancelOrder}
            onDialogClose={handleCloseDialog}
          />

          <AddPaymentContent
            id={'payment'}
            title={'Adicionar pagamento'}
            initialValues={{
              total: selectedOrder
                ? parseFloat((selectedOrder.total - selectedOrder.totalPaid).toFixed(2))
                : 0.0
            }}
            loading={loadingAddPayment}
            onClose={handleCloseDialog}
            onSubmit={handlePaymentSubmit}
          />
          <InvoiceContent
            id={DialogContents.invoice}
            title='Nota Fiscal'
            loading={loading}
            order={selectedOrder}
            onClose={handleCloseDialog}
            onSubmit={handleGenerateInvoice}
            onSendInvoiceEmail={handleSendInvoiceEmail}
          />
        </Dialog>
      </Main>
    </Page>
  )
}

OrdersHistoryView.propTypes = {
  orders: PropTypes.shape({
    orders: PropTypes.arrayOf(PropTypes.object),
    pagination: PropTypes.object
  }),
  filters: PropTypes.object,
  loading: PropTypes.bool,
  term: PropTypes.string,
  openDialog: PropTypes.bool,
  location: PropTypes.object,
  searchResults: PropTypes.object,
  onCancelOrder: PropTypes.func,
  onUpdateOrder: PropTypes.func,
  onUpsertOrder: PropTypes.func,
  onSetOpenDialog: PropTypes.func,
  onFilterChange: PropTypes.func,
  onSearchChange: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func
}

OrdersHistoryView.defaultProps = {
  loading: false,
  onCancelOrder: () => {},
  onUpdateOrder: () => {},
  onCreateOrder: () => {},
  onUpsertOrder: () => {},
  onSetOpenDialog: () => {},
  onFilterChange: () => {},
  onPageChange: () => {},
  onRowsPerPageChange: () => {}
}

export default OrdersHistoryView
