import React, { useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

import moment from 'moment'
import PropTypes from 'prop-types'

import Box from '@material-ui/core/Box'
import CardHeader from '@material-ui/core/CardHeader'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { useTheme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Add from '@material-ui/icons/Add'
import AttachMoney from '@material-ui/icons/AttachMoneyOutlined'
import Close from '@material-ui/icons/CloseOutlined'
import Edit from '@material-ui/icons/EditOutlined'
import ListIcon from '@material-ui/icons/ListOutlined'
import MoneyOff from '@material-ui/icons/MoneyOffOutlined'
import MoreVert from '@material-ui/icons/MoreVertOutlined'
import Motorcycle from '@material-ui/icons/Motorcycle'
import PersonOutline from '@material-ui/icons/PersonOutline'
import Print from '@material-ui/icons/PrintOutlined'
import Receipt from '@material-ui/icons/Receipt'
import ShortText from '@material-ui/icons/ShortTextOutlined'
import SwapHoriz from '@material-ui/icons/SwapHorizOutlined'

import Color from 'src/components/Color'
import OrderReceipt from 'src/components/OrderReceipt'

import useMe from 'src/hooks/useMe'

import { InvoiceIndicatorColors, OrderStatus, Origins, CompanyRoles } from 'src/utils/enums'

import useStyles from './styles'

const OrderHeader = ({
  order,
  onEdit,
  onFees,
  onCancel,
  onAddItems,
  onEditTitle,
  onInvoice,
  onTransferItems,
  onDiscount,
  onAddCustomer,
  onDelivery,
  onProductionRequests
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const upMedium = useMediaQuery(theme.breakpoints.up('md'))

  const { me } = useMe()

  /**
   * CONTROLLERS
   */

  const orderReceiptRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => orderReceiptRef.current
  })

  const [anchorEl, setAnchorEl] = useState(null)

  const handleDeliveryClick = (event) => {
    onDelivery(order)
  }

  const handleAddCustomer = (event) => {
    onAddCustomer(order)
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleAddTitle = (event) => {
    setAnchorEl(null)
    onEditTitle(order)
  }

  const handleCancel = (event) => {
    setAnchorEl(null)
    onCancel(order)
  }

  const handleProductionRequests = (event) => {
    setAnchorEl(null)
    onProductionRequests(order)
  }

  const handleAddItems = (event) => {
    setAnchorEl(null)
    onAddItems(order)
  }

  const handleDiscount = (event) => {
    setAnchorEl(null)
    onDiscount(order)
  }

  const handleFees = (event) => {
    setAnchorEl(null)
    onFees(order)
  }

  const handleSwitch = (event) => {
    setAnchorEl(null)
    onTransferItems(order)
  }

  const handleInvoice = (event) => {
    setAnchorEl(null)
    onInvoice(order)
  }

  const handleOpenEdit = (event) => {
    setAnchorEl(null)
    onEdit(order)
  }

  const hasClosed = OrderStatus[order.status].type === OrderStatus.closed.type
  const hasCanceled = OrderStatus[order.status].type === OrderStatus.canceled.type
  const hasCustomer = order.customer
  const hasDelivery = hasCustomer && order.delivery?.address
  const hasDiscount = order?.discount > 0
  const hasTitle = order.title

  const renderTitle = () => {
    let title = ''

    if (upMedium) {
      if (hasTitle) {
        title = (
          <>
            <b>{order.title}</b> - {moment(order.createdAt).format('DD/MM/YY LT')}
          </>
        )
      } else {
        title = moment(order.createdAt).format('DD/MM/YY LT')
      }
    } else {
      if (hasTitle) {
        title = (
          <>
            <b>{order.title}</b> - {moment(order.createdAt).format('LT')}
          </>
        )
      } else {
        title = moment(order.createdAt).format('LT')
      }
    }
    return title
  }

  const title = renderTitle()

  const isAttendant = me.role === CompanyRoles.ATTENDANT

  const getInvoiceIndicator = (order) => {
    if (!order.invoice || !order.invoice.status || order.invoice.status === 'error') {
      return { title: 'Erro ao gerar Nota Fiscal', color: InvoiceIndicatorColors.error }
    } else if (order.invoice.status === 'pending') {
      return { title: 'Nota Fiscal não enviada ao SAT', color: InvoiceIndicatorColors.pending }
    } else if (order.invoice.status === 'success') {
      return { title: 'Nota Fiscal gerada com sucesso', color: InvoiceIndicatorColors.success }
    }
    return { title: 'Erro ao gerar Nota Fiscal', color: InvoiceIndicatorColors.error }
  }

  const invoiceIndicator = getInvoiceIndicator(order)

  return (
    <>
      <CardHeader
        id='header'
        classes={{ root: classes.root }}
        action={
          !hasCanceled && (
            <Box display='flex'>
              {order.origin === Origins.mee.value && (
                <>
                  {hasClosed && (
                    <Tooltip title={invoiceIndicator.title}>
                      <IconButton color={'default'}>
                        <Color size='extraSmall' color={invoiceIndicator.color} />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title='Adicionar cliente ao pedido'>
                    <IconButton
                      id='customer'
                      aria-haspopup='true'
                      aria-label='adicionar cliente'
                      disabled={hasClosed || hasCanceled}
                      color={hasCustomer ? 'primary' : 'default'}
                      onClick={handleAddCustomer}
                    >
                      <PersonOutline />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Adicionar informações de delivery'>
                    <IconButton
                      id='delivery'
                      aria-haspopup='true'
                      aria-label='adicionar delivery'
                      disabled={hasClosed || hasCanceled}
                      color={hasDelivery ? 'primary' : 'default'}
                      onClick={handleDeliveryClick}
                    >
                      <Motorcycle />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              {!isAttendant && (
                <Tooltip title='Imprimir pedido'>
                  <IconButton id='print' aria-label='imprimir pedido' onClick={handlePrint}>
                    <Print />
                  </IconButton>
                </Tooltip>
              )}
              <OrderReceipt ref={orderReceiptRef} user={me} order={order} />
              <Tooltip title='Mais opções'>
                <IconButton
                  id='more'
                  aria-haspopup='true'
                  aria-label='mais'
                  onClick={handleMenuClick}
                >
                  <MoreVert />
                </IconButton>
              </Tooltip>
              <Menu
                id='menu'
                anchorEl={anchorEl}
                keepMounted
                open={!!anchorEl}
                onClose={handleMenuClose}
              >
                {!hasClosed && order.origin === Origins.mee.value && (
                  <MenuItem onClick={handleAddTitle}>
                    <ShortText className={classes.icon} />
                    {order.title ? 'Editar título' : 'Adicionar título'}
                  </MenuItem>
                )}
                {!isAttendant && !hasClosed && order.origin === Origins.mee.value && (
                  <MenuItem onClick={handleAddItems}>
                    <Add className={classes.icon} />
                    Adicionar items
                  </MenuItem>
                )}
                {!hasClosed && order.origin === Origins.mee.value && (
                  <MenuItem onClick={handleOpenEdit}>
                    <Edit className={classes.icon} />
                    Editar
                  </MenuItem>
                )}
                {!isAttendant && (
                  <MenuItem onClick={handleInvoice}>
                    <Receipt className={classes.icon} />
                    Nota Fiscal
                  </MenuItem>
                )}
                {!hasClosed && !hasCanceled && !isAttendant && order.origin === Origins.mee.value && (
                  <MenuItem onClick={handleDiscount}>
                    <MoneyOff className={classes.icon} />
                    {hasDiscount ? 'Editar desconto' : 'Adicionar desconto'}
                  </MenuItem>
                )}
                {!hasClosed && !hasCanceled && !isAttendant && order.origin === Origins.mee.value && (
                  <MenuItem onClick={handleFees}>
                    <AttachMoney className={classes.icon} />
                    {'Taxas'}
                  </MenuItem>
                )}
                {!hasClosed && !hasCanceled && order.origin === Origins.mee.value && (
                  <MenuItem onClick={handleSwitch}>
                    <SwapHoriz className={classes.icon} />
                    {'Transferir items'}
                  </MenuItem>
                )}
                {!isAttendant &&
                  order.origin === Origins.mee.value &&
                  order.productionRequests?.length > 0 && (
                    <MenuItem onClick={handleProductionRequests}>
                      <ListIcon className={classes.icon} />
                      Histórico de modificações
                    </MenuItem>
                  )}
                {!isAttendant && order.origin === Origins.mee.value && (
                  <MenuItem onClick={handleCancel}>
                    <Close className={classes.icon} />
                    Cancelar
                  </MenuItem>
                )}
              </Menu>
            </Box>
          )
        }
        subheader={title}
      />
    </>
  )
}

OrderHeader.propTypes = {
  order: PropTypes.object,
  onEdit: PropTypes.func,
  onFees: PropTypes.func,
  onCancel: PropTypes.func,
  onInvoice: PropTypes.func,
  onDelivery: PropTypes.func,
  onDiscount: PropTypes.func,
  onAddItems: PropTypes.func,
  onEditTitle: PropTypes.func,
  onAddCustomer: PropTypes.func,
  onTransferItems: PropTypes.func,
  onProductionRequests: PropTypes.func
}

OrderHeader.defaultProps = {
  onEdit: () => {},
  onFees: () => {},
  onCancel: () => {},
  onInvoice: () => {},
  onDelivery: () => {},
  onDiscount: () => {},
  onAddItems: () => {},
  onEditTitle: () => {},
  onAddCustomer: () => {},
  onTransferItems: () => {},
  onProductionRequests: () => {}
}

export default OrderHeader
