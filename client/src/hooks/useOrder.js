import { useCallback } from 'react'

import { useMutation, useLazyQuery } from '@apollo/react-hooks'

import {
  CONFIRM_IFOOD_ORDER,
  DISPATCH_IFOOD_ORDER,
  CANCELLATION_IFOOD_ORDER
} from 'src/graphql/ifood/queries'
import { OPEN_NOTIFICATION } from 'src/graphql/notification/queries'
import {
  GET_SUGGESTIONS,
  GET_DELIVERY_DETAILS,
  ADD_ITEMS,
  UPDATE_ORDER,
  CREATE_ORDER,
  CANCEL_ORDER,
  CLOSE_ORDER,
  GENERATE_INVOICE,
  SEND_INVOICE_EMAIL,
  ADD_PAYMENT,
  CONFIRM_ORDER,
  DOWNLOAD_INVOICES
} from 'src/graphql/order/queries'
import { UPDATE_ME } from 'src/graphql/user/queries'

import useMe from 'src/hooks/useMe'

import { Origins, FirebaseEvents } from 'src/utils/enums'

import { analytics } from 'src/firebase'

const cleanItems = (items) =>
  items.map((item) => {
    delete item.subtotal
    delete item.modifiers
    return { ...item, quantity: parseFloat(item.quantity), price: parseFloat(item.price) }
  })

const useOrder = () => {
  /**
   * QUERY
   */
  const [getDeliveryDetailQuery, getDeliveryDetailResult] = useLazyQuery(GET_DELIVERY_DETAILS, {
    fetchPolicy: 'network-only'
  })

  const [getSuggestionsQuery, getSuggestionsResult] = useLazyQuery(GET_SUGGESTIONS, {
    fetchPolicy: 'network-only'
  })

  const [openNotification] = useMutation(OPEN_NOTIFICATION)
  const [updateOrder, { loading: loadingUpdateOrder }] = useMutation(UPDATE_ORDER)
  const [addItemsMutate, { loading: loadingAddItems }] = useMutation(ADD_ITEMS)
  const [createOrder, { loading: loadingCreateOrder }] = useMutation(CREATE_ORDER)
  const [cancelIfoodOrderMutate] = useMutation(CANCELLATION_IFOOD_ORDER)
  const [cancelOrderMutate, { loading: loadingCancelOrder }] = useMutation(CANCEL_ORDER)
  const [generateInvoiceMutate, { loading: loadingGenerateInvoice }] = useMutation(GENERATE_INVOICE)
  const [closeOrderMutate, { loading: loadingCloseOrder }] = useMutation(CLOSE_ORDER)
  const [sendInvoiceEmailMutate] = useMutation(SEND_INVOICE_EMAIL)
  const [addPaymentMutate, { loading: loadingAddPayment }] = useMutation(ADD_PAYMENT)
  const [confirmOrderMutate] = useMutation(CONFIRM_ORDER)
  const [confirmIfoodOrderMutate] = useMutation(CONFIRM_IFOOD_ORDER)
  const [dispatchIfoodOrderMutate] = useMutation(DISPATCH_IFOOD_ORDER)
  const [downloadInvoicesMutate, { loading: loadingDownloadInvoices }] = useMutation(
    DOWNLOAD_INVOICES
  )

  const [updateMe] = useMutation(UPDATE_ME)

  const { me } = useMe()

  const getSuggestions = useCallback((input) => {
    getSuggestionsQuery({ variables: { input } })
  }, [])

  const getDeliveryDetails = useCallback((input) => {
    getDeliveryDetailQuery({ variables: { input } })
  }, [])

  const upsertOrder = async (order, options = {}) => {
    if (order._id) {
      return handleUpdateOrder(order, options)
    } else {
      return handleCreateOrder(
        { items: order.items, nationalId: order.nationalId, title: order.title },
        options
      )
    }
  }

  const handleUpdateOrder = async (order, options) => {
    const { onSuccess, onFailure } = options

    if (order.items) {
      order.items = cleanItems(order.items)
    }

    const { _id, ...data } = order

    try {
      const res = await updateOrder({ variables: { id: _id, input: data } })
      onSuccess && onSuccess()
      openNotification({
        variables: { input: { variant: 'success', message: 'Pedido atualizado' } }
      })

      return res
    } catch ({ message }) {
      onFailure && onFailure()
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const handleCreateOrder = async (input, options) => {
    const { onSuccess, onFailure } = options
    input.items = cleanItems(input.items)

    try {
      const data = await createOrder({
        variables: {
          nationalId: input.nationalId,
          input: { title: input.title, items: input.items }
        }
      })

      analytics.logEvent(FirebaseEvents.CREATE_ORDER)
      onSuccess && onSuccess()

      openNotification({
        variables: { input: { variant: 'success', message: 'Pedido adicionado' } }
      })

      if (!me?.onboarding?.finishedAddOrder) {
        updateMe({ variables: { input: { onboarding: { finishedAddOrder: true } } } })
      }

      return data
    } catch ({ message }) {
      onFailure && onFailure()
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const closeOrder = async (order, options = {}) => {
    const { onSuccess, onFailure } = options
    try {
      await closeOrderMutate({ variables: { id: order._id } })
      onSuccess && onSuccess()
      openNotification({ variables: { input: { variant: 'success', message: 'Pedido fechado' } } })
    } catch ({ message }) {
      onFailure && onFailure()
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const cancelOrder = async (order, values, options = {}) => {
    const { onSuccess, onFailure } = options
    try {
      if (order.origin === Origins.ifood.value) {
        const variables = { input: { id: order._id, ...values } }
        await cancelIfoodOrderMutate({ variables })
      } else if (order.origin === Origins.mee.value) {
        await cancelOrderMutate({ variables: { input: { id: order._id } } })
      }

      onSuccess && onSuccess()

      await openNotification({
        variables: { input: { variant: 'success', message: 'Pedido cancelado' } }
      })
    } catch ({ message }) {
      onFailure && onFailure()
      await openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const generateInvoice = async (order, options = {}) => {
    const { onSuccess, onFailure } = options
    try {
      await generateInvoiceMutate({
        variables: {
          id: order._id
        }
      })

      onSuccess && onSuccess()

      openNotification({
        variables: { input: { variant: 'success', message: 'Informações enviadas ao SAT!' } }
      })
    } catch ({ message }) {
      onFailure && onFailure()
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const sendInvoiceEmail = async (order, email, options = {}) => {
    const { onSuccess, onFailure } = options

    try {
      await sendInvoiceEmailMutate({
        variables: {
          input: {
            orderId: order._id,
            email: email
          }
        }
      })

      onSuccess && onSuccess()

      openNotification({
        variables: { input: { variant: 'success', message: 'Nota fiscal enviada por email!' } }
      })
    } catch ({ message }) {
      onFailure && onFailure()
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const addPayment = async (order, payment, options = {}) => {
    const { onSuccess, onFailure } = options
    let { method, value, received, financialFund, category } = payment

    if (method instanceof Object) method = method.id

    try {
      await addPaymentMutate({
        variables: {
          id: order._id,
          input: {
            method,
            value: parseFloat(value),
            received: parseFloat(received),
            financialFund,
            category
          }
        }
      })

      onSuccess && onSuccess()

      openNotification({
        variables: { input: { variant: 'success', message: 'Pagamento adicionado!' } }
      })

      if (!me?.onboarding?.finishedCloseOrder) {
        updateMe({ variables: { input: { onboarding: { finishedCloseOrder: true } } } })
      }
    } catch ({ message }) {
      onFailure && onFailure()
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const confirmOrder = async (order, options = {}) => {
    try {
      if (order.origin === Origins.ifood.value) {
        await confirmIfoodOrderMutate({ variables: { input: { id: order._id } } })
        analytics.logEvent(FirebaseEvents.IFOOD_CONFIRM_ORDER)
        openNotification({
          variables: { input: { variant: 'success', message: 'Pedido confirmado!' } }
        })
      } else {
        await confirmOrderMutate({ variables: { input: { id: order._id } } })
        analytics.logEvent(FirebaseEvents.CONFIRM_ORDER)
        openNotification({
          variables: { input: { variant: 'success', message: 'Pedido confirmado!' } }
        })
      }
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const dispatchOrder = async (order, options = {}) => {
    try {
      await dispatchIfoodOrderMutate({ variables: { input: { id: order._id } } })
      analytics.logEvent(FirebaseEvents.IFOOD_DISPATCH_ORDER)
      openNotification({
        variables: { input: { variant: 'success', message: 'Pedido saiu para entrega!' } }
      })
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const downloadInvoices = async (input) => {
    try {
      const { data } = await downloadInvoicesMutate({
        variables: {
          input
        }
      })

      return data.downloadInvoices
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const addItems = async (order, input, options = {}) => {
    const { onSuccess, onFailure } = options

    input.items = cleanItems(input.items)

    try {
      await addItemsMutate({ variables: { id: order._id, input } })
      onSuccess && onSuccess()
      openNotification({
        variables: { input: { variant: 'success', message: 'Pedido atualizado' } }
      })
    } catch ({ message }) {
      onFailure && onFailure()
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  return {
    upsertOrder,
    closeOrder,
    cancelOrder,
    generateInvoice,
    sendInvoiceEmail,
    addPayment,
    confirmOrder,
    dispatchOrder,
    downloadInvoices,
    addItems,
    getDeliveryDetails: [getDeliveryDetails, getDeliveryDetailResult],
    getSuggestions: [getSuggestions, getSuggestionsResult],
    loading:
      loadingCreateOrder ||
      loadingUpdateOrder ||
      loadingCancelOrder ||
      loadingGenerateInvoice ||
      loadingAddPayment ||
      loadingCloseOrder ||
      loadingDownloadInvoices ||
      loadingAddItems
  }
}

export default useOrder
