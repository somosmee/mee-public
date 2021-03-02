import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Tour from 'reactour'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import ExpandMore from '@material-ui/icons/ExpandMore'
import PaymentIcon from '@material-ui/icons/Payment'
import ShortTextIcon from '@material-ui/icons/ShortTextOutlined'

import Alert from 'src/components/Alert'
import Spacer from 'src/components/Spacer'

import useMe from 'src/hooks/useMe'
import useOrder from 'src/hooks/useOrder'

import { OrderStatus, IfoodStatus, Origins, DeliveryTypes, CompanyRoles } from 'src/utils/enums'

import useStyles from './styles'

const OrderActions = ({
  index,
  expanded,
  order,
  onExpanseChange,
  onEdit,
  onAddPayment,
  onAddItems,
  onEditTitle,
  onCloseOrder
}) => {
  const classes = useStyles()
  const location = useLocation()

  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md'))

  const { me } = useMe()

  const { state } = location

  const [openCancelAlert, setOpenCancelAlert] = useState(false)
  const [openTour, setOpenTour] = useState(state?.tour)

  const { confirmOrder, dispatchOrder, cancelOrder, loading } = useOrder()

  const handlePay = (event) => {
    setOpenTour(false)
    onAddPayment(order)
  }

  const handleAddItems = (event) => {
    setOpenTour(false)
    onAddItems(order)
  }

  const handleEdit = (event) => {
    setOpenTour(false)
    onEdit(order)
  }

  const handleEditTitle = (event) => {
    setOpenTour(false)
    onEditTitle(order)
  }

  const handleClose = (event) => {
    onCloseOrder(order)
  }

  const handleExpandClick = (event) => {
    onExpanseChange(index, expanded)
  }

  const handleConfirm = async (event) => {
    await confirmOrder(order)
  }

  const handleDispatch = async (event) => {
    await dispatchOrder(order)
  }

  const handleCancel = (event) => {
    setOpenCancelAlert(true)
  }

  const handleCloseCancelAlert = () => {
    setOpenCancelAlert(false)
  }

  const handleCancelOrder = async () => {
    await cancelOrder(order, null, {
      onSuccess: () => {
        handleCloseCancelAlert()
      }
    })
  }

  const handleCloseTour = () => {
    setOpenTour(false)
  }

  const renderCloseButton = () => {
    if (upMedium) {
      return (
        <Button
          id='close'
          variant='outlined'
          color='primary'
          size='medium'
          aria-label='finalizar pedido'
          onClick={handleClose}
        >
          Finalizar
        </Button>
      )
    }
  }

  const renderPaymentButton = () => {
    if (upMedium) {
      return (
        <Button
          id='add-payment'
          variant='contained'
          color='primary'
          size='medium'
          aria-label='adicionar pagamento'
          onClick={handlePay}
        >
          Pagar
        </Button>
      )
    } else {
      return (
        <IconButton id='add-payment' aria-label='add payment' onClick={handlePay}>
          <PaymentIcon fontSize='large' />
        </IconButton>
      )
    }
  }

  const renderAddItemsButton = () => {
    if (upMedium) {
      return (
        <Button
          id='add-items'
          variant='contained'
          color='primary'
          size='medium'
          startIcon={<AddIcon />}
          aria-label='adicionar pagamento'
          onClick={handleAddItems}
        >
          Adicionar items
        </Button>
      )
    } else {
      return (
        <IconButton id='add-items' aria-label='add items' onClick={handleAddItems}>
          <AddIcon fontSize='large' />
        </IconButton>
      )
    }
  }

  const renderEditButton = () => {
    if (!upMedium) {
      return (
        <IconButton id='add-items' aria-label='edit order' onClick={handleEdit}>
          <EditIcon fontSize='large' />
        </IconButton>
      )
    }
  }

  const renderEditTitleButton = () => {
    if (!upMedium) {
      return (
        <IconButton id='add-items' aria-label='edit title' onClick={handleEditTitle}>
          <ShortTextIcon fontSize='large' />
        </IconButton>
      )
    }
  }

  const hasClosed = OrderStatus[order.status].type === OrderStatus.closed.type
  const hasCanceled = OrderStatus[order.status].type === OrderStatus.canceled.type

  const steps = [
    {
      selector: '[id="add-payment"]',
      content: 'Clique em "Pagar" para adicionar um pagamento e concluir uma venda'
    }
  ]

  const isAttendant = me.role === CompanyRoles.ATTENDANT
  const isOpen =
    OrderStatus[order.status].type === OrderStatus.open.type ||
    OrderStatus[order.status].type === OrderStatus.partially_paid.type

  return (
    <CardActions id='actions'>
      <Tour
        steps={steps}
        isOpen={me?.onboarding?.finishedCloseOrder ? false : openTour}
        onRequestClose={handleCloseTour}
        rounded={10}
        showButtons={false}
        showNavigation={false}
        showNavigationNumber={false}
      />
      {!hasCanceled && !hasClosed && (
        <>
          {order.origin === Origins.mee.value &&
            !(order.delivery?.method === DeliveryTypes.delivery.type) && (
              <>
                {!isAttendant && renderCloseButton()}
                {isOpen && !isAttendant && renderPaymentButton()}
                {isOpen && renderEditButton()}
                {isOpen && renderEditTitleButton()}
                {isOpen && renderAddItemsButton()}
              </>
            )}
          {(order.origin === Origins.mee.value || order.origin === Origins.shopfront.value) && (
            <>
              {order.origin === Origins.shopfront.value && (
                <Button
                  id='cancel'
                  variant='outlined'
                  color='primary'
                  size='medium'
                  aria-label='cancelar pedido'
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              )}
              {order.status === OrderStatus.confirmed.type &&
                (OrderStatus[order.status].type === OrderStatus.open.type ||
                  OrderStatus[order.status].type === OrderStatus.partially_paid.type) && (
                  <Button
                    id='add-payment'
                    variant='contained'
                    color='primary'
                    size='medium'
                    aria-label='adicionar pagamento'
                    onClick={handlePay}
                  >
                    Pagar
                  </Button>
                )}
              {((OrderStatus[order.status].type === OrderStatus.confirmed.type &&
                order.origin === Origins.shopfront.value) ||
                (order.delivery?.method === DeliveryTypes.delivery.type &&
                  order.origin === Origins.mee.value)) && (
                <Button
                  id='close'
                  variant='contained'
                  color='primary'
                  size='medium'
                  aria-label='finalizar pedido'
                  onClick={handleClose}
                >
                  Finalizar
                </Button>
              )}
              {order.status === OrderStatus.open.type && order.requireConfirmation && (
                <Button
                  id='confirm'
                  variant='contained'
                  color='primary'
                  size='medium'
                  aria-label='pay order'
                  onClick={handleConfirm}
                >
                  Confirmar
                </Button>
              )}
            </>
          )}
          {order.origin === Origins.ifood.value && (
            <>
              {order.ifood &&
                (order.ifood.status === IfoodStatus.integrated ||
                  order.ifood.status === IfoodStatus.placed ||
                  order.ifood.status === IfoodStatus.confirmed) && (
                  <Button
                    id='cancel'
                    variant='outlined'
                    color='primary'
                    size='medium'
                    aria-label='cancelar pedido'
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                )}
              {order.ifood &&
                (order.ifood.status === IfoodStatus.integrated ||
                  order.ifood.status === IfoodStatus.placed) && (
                  <Button
                    id='confirm'
                    variant='contained'
                    color='primary'
                    size='medium'
                    aria-label='confirmar pedido'
                    onClick={handleConfirm}
                  >
                    Confirmar
                  </Button>
                )}
              {order.ifood && order.ifood.status === IfoodStatus.confirmed && (
                <Button
                  id='dispatch'
                  variant='contained'
                  color='primary'
                  size='medium'
                  aria-label='saiu para entrega'
                  onClick={handleDispatch}
                >
                  Saiu para entrega
                </Button>
              )}
            </>
          )}
        </>
      )}
      <Spacer />
      {upMedium && (
        <IconButton
          id='expand-more'
          className={classNames(classes.expand, { [classes.expandOpen]: expanded })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label='mostrar mais'
        >
          <ExpandMore />
        </IconButton>
      )}
      <Alert
        open={openCancelAlert}
        loading={loading}
        onClose={handleCloseCancelAlert}
        title={'Cancelar pedido?'}
        onPrimary={handleCancelOrder}
        primaryLabel={'Cancelar pedido'}
        onSecondary={handleCloseCancelAlert}
        secondaryLabel='Voltar'
      >
        {'Este pedido será cancelado permanentemente.'}
      </Alert>
    </CardActions>
  )
}

OrderActions.propTypes = {
  index: PropTypes.number,
  expanded: PropTypes.bool,
  order: PropTypes.object,
  onExpanseChange: PropTypes.func,
  onEdit: PropTypes.func,
  onAddPayment: PropTypes.func,
  onAddItems: PropTypes.func,
  onEditTitle: PropTypes.func,
  onCloseOrder: PropTypes.func
}

OrderActions.defaultProps = {
  expanded: false,
  order: {},
  onExpanseChange: () => {},
  onEdit: () => {},
  onAddPayment: () => {},
  onAddItems: () => {},
  onEditTitle: () => {},
  onCloseOrder: () => {}
}

export default OrderActions
