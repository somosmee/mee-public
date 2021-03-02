import React, { useState } from 'react'

import cep from 'cep-promise'
import PropTypes from 'prop-types'

import CustomerSearchStep from 'src/components/DeliverySteps/CustomerSearchStep'
import PaymentSelectionStep from 'src/components/DeliverySteps/PaymentSelectionStep'
import ReviewStep from 'src/components/DeliverySteps/ReviewStep'
import ShippingSelectionStep from 'src/components/DeliverySteps/ShippingSelectionStep'
import UpsertAddressStep from 'src/components/DeliverySteps/UpsertAddressStep'
import UpsertCustomerStep from 'src/components/DeliverySteps/UpsertCustomerStep'
import UpsertDeliveryFeeStep from 'src/components/DeliverySteps/UpsertDeliveryFeeStep'
import Dialog from 'src/components/Dialog'

import useCustomer from 'src/hooks/useCustomer'
import useOrder from 'src/hooks/useOrder'

import { DeliverySteps, DeliveryTypes } from 'src/utils/enums'

import useStyles from './styles'

const UpsertDeliveryDialog = ({ open, order, onExited, onClose, isAddCustomer }) => {
  const classes = useStyles()

  const hasCompletedSteps =
    !!order?.customer && order?.delivery?.fee !== null && !!order?.delivery?.address

  const [activeContent, setActiveContent] = useState(
    order?.delivery ? DeliverySteps.review : DeliverySteps.customer
  )

  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [address, setAddress] = useState(null)
  const [payments, setPayments] = useState(null)
  const [fee, setFee] = useState(null)

  const { upsertOrder, loading } = useOrder()
  const {
    createCustomer: [createCustomer],
    updateCustomer: [updateCustomer],
    createCustomerAddress: [createCustomerAddress],
    updateCustomerAddress: [updateCustomerAddress]
  } = useCustomer()

  const resetState = (step = DeliverySteps.customer) => {
    setActiveContent(step)
    setSelectedCustomer(null)
    setSelectedAddressId(null)
    setAddress(null)
    setPayments(null)
    setFee(null)
  }

  const handleBack = () => {
    switch (activeContent) {
      case DeliverySteps.customer:
        if (hasCompletedSteps) {
          setActiveContent(DeliverySteps.review)
        } else {
          onClose()
          setActiveContent(DeliverySteps.customer)
        }
        break
      case DeliverySteps.newCustomer:
        setActiveContent(DeliverySteps.customer)
        break
      case DeliverySteps.shipping:
        if (hasCompletedSteps) {
          setActiveContent(DeliverySteps.review)
        } else {
          resetState()
          setActiveContent(DeliverySteps.customer)
        }
        break
      case DeliverySteps.newAddress:
        setActiveContent(DeliverySteps.shipping)
        break
      case DeliverySteps.payment:
        if (hasCompletedSteps) {
          setActiveContent(DeliverySteps.review)
        } else {
          setActiveContent(DeliverySteps.shipping)
        }
        break
      case DeliverySteps.deliveryFee:
        if (hasCompletedSteps) {
          setActiveContent(DeliverySteps.review)
        } else {
          setActiveContent(DeliverySteps.payment)
        }
        break
      case DeliverySteps.review:
        if (hasCompletedSteps) {
          resetState(DeliverySteps.review)
          onClose()
        } else {
          setActiveContent(DeliverySteps.deliveryFee)
        }
        break
      default:
        break
    }
  }

  /**
   * CUSTOMER SEARCH STEP
   */

  const handleSelectCustomer = async (customer) => {
    setSelectedCustomer(customer)

    if (isAddCustomer) {
      setActiveContent(DeliverySteps.review)
    } else {
      setActiveContent(DeliverySteps.shipping)
    }
  }

  const handleAddNewCustomer = () => {
    setActiveContent(DeliverySteps.newCustomer)
  }

  /**
   * UPSERT CUSTOMER STEP
   */

  const handleNewCustomerSubmit = async (input) => {
    try {
      let customer
      if (input._id) {
        customer = await updateCustomer(input)
      } else {
        customer = await createCustomer(input)
      }
      setSelectedCustomer(customer)

      if (isAddCustomer) {
        setActiveContent(DeliverySteps.review)
      } else {
        setActiveContent(DeliverySteps.shipping)
      }
    } catch (error) {}
  }

  const handleChangeAddress = (address) => {
    setAddress(address)
    setSelectedAddressId(address._id)
  }

  const handleEditNewAddress = (address) => {
    setAddress(address)
    setActiveContent(DeliverySteps.newAddress)
  }

  const handleDeleteAddress = async (id) => {
    // try {
    //   await deleteCustomerAddress({ variables: { id: selectedCustomerId, address: id } })
    //   if (selectedAddressId === id) setSelectedAddressId(null)
    // } catch ({ message }) {
    //   openNotification({ variables: { input: { variant: 'error', message } } })
    // }
  }

  const handleAddNewAddress = () => {
    setActiveContent(DeliverySteps.newAddress)
  }

  const handleShippingSelectionSubmit = async (update) => {
    if (hasCompletedSteps) {
      setActiveContent(DeliverySteps.review)
    } else {
      setActiveContent(DeliverySteps.payment)
    }
  }

  /**
   * UPSERT ADDRESS STEP
   */

  const handlePostalCode = async (value) => {
    try {
      const { state, city, street, neighborhood } = await cep(value)
      setAddress({ postalCode: value, state, city, street, district: neighborhood })
    } catch (error) {
      setAddress({ postalCode: value })
    }
  }

  const handleCustomerAddressSubmit = async (input) => {
    try {
      if (input._id) {
        const customer = await updateCustomerAddress({ customer: selectedCustomer._id, ...input })
        const addresses = customer.addresses
        const address = addresses[addresses.length - 1]
        setSelectedAddressId(address._id)
        setAddress(address)
      } else {
        await createCustomerAddress({ customer: selectedCustomer._id, ...input })
        setSelectedAddressId(input._id)
        setAddress(input)
      }

      if (hasCompletedSteps) {
        setActiveContent(DeliverySteps.review)
      } else {
        setActiveContent(DeliverySteps.payment)
      }
    } catch (e) {}
  }

  /**
   * PAYMENT STEP
   */

  const handlePaymentSelect = async (input) => {
    const { payments } = input
    setPayments(payments)
    if (hasCompletedSteps) {
      setActiveContent(DeliverySteps.review)
    } else {
      setActiveContent(DeliverySteps.deliveryFee)
    }
  }

  /**
   * DELIVERY FEE STEP
   */

  const handleDeliveryFee = async (input) => {
    const { deliveryFee } = input
    setFee(parseFloat(deliveryFee))
    setActiveContent(DeliverySteps.review)
  }

  /**
   * REVIEW STEP
   */

  const handleEditCustomer = () => {
    resetState()
  }

  const handleEditAddress = () => {
    setSelectedCustomer(order.customer)
    setActiveContent(DeliverySteps.shipping)
  }

  const handleEditPayment = () => {
    setActiveContent(DeliverySteps.payment)
  }

  const handleEditDeliveryFee = () => {
    setAddress(address)
    setActiveContent(DeliverySteps.deliveryFee)
  }

  const hasSelectedData = isAddCustomer
    ? selectedCustomer
    : payments || address || selectedCustomer || fee

  const handleSubmit = () => {
    if (!hasSelectedData) return onClose()

    let input = {}
    if (isAddCustomer) {
      input = {
        customer: selectedCustomer._id
      }
    } else {
      if (payments) input.payments = payments
      if (selectedCustomer) input.customer = selectedCustomer._id
      if (address || fee) input.delivery = { method: DeliveryTypes.delivery.type }
      if (address) input.delivery.address = address
      if (fee) input.delivery.fee = fee
    }

    upsertOrder(
      { _id: order._id, ...input },
      {
        onSuccess: () => {
          resetState(DeliverySteps.review)
          onClose()
        }
      }
    )
  }

  const handleOnClose = () => {
    if (hasCompletedSteps) {
      resetState(DeliverySteps.review)
    } else {
      resetState(DeliverySteps.customer)
    }

    onClose()
  }

  return (
    <Dialog
      className={classes.root}
      open={open}
      onExited={onExited}
      activeContent={activeContent}
      onBack={handleBack}
      onClose={handleOnClose}
    >
      <CustomerSearchStep
        id={DeliverySteps.customer}
        title='Qual o telefone do cliente?'
        onSelect={handleSelectCustomer}
        onAddNew={handleAddNewCustomer}
      />
      <UpsertCustomerStep
        id={DeliverySteps.newCustomer}
        title='Adicione um cliente'
        onSubmit={handleNewCustomerSubmit}
      />
      <ShippingSelectionStep
        id={DeliverySteps.shipping}
        title='Qual o endereço de entrega?'
        addresses={selectedCustomer?.addresses}
        value={selectedAddressId}
        onChange={handleChangeAddress}
        onEdit={handleEditNewAddress}
        onDelete={handleDeleteAddress}
        onAddNew={handleAddNewAddress}
        onSubmit={handleShippingSelectionSubmit}
      />
      <UpsertAddressStep
        id={DeliverySteps.newAddress}
        title='Adicione um endereço'
        initialValues={address}
        onPostalCode={handlePostalCode}
        onSubmit={handleCustomerAddressSubmit}
      />
      <PaymentSelectionStep
        id={DeliverySteps.payment}
        title='Como você prefere pagar?'
        onSelect={handlePaymentSelect}
      />
      <UpsertDeliveryFeeStep
        id={DeliverySteps.deliveryFee}
        title='Taxa de entrega'
        address={address || order?.delivery?.address}
        initialValues={{ deliveryFee: fee || order?.delivery?.fee || 0.0 }}
        onSubmit={handleDeliveryFee}
      />
      <ReviewStep
        id={DeliverySteps.review}
        title='Confirme os dados'
        loading={loading}
        order={{
          ...order,
          payments: payments || order?.payments,
          customer: selectedCustomer || order?.customer,
          delivery: {
            fee: fee || order?.delivery?.fee || 0.0,
            address: address || order?.delivery?.address
          }
        }}
        onEditCustomer={handleEditCustomer}
        onEditAddress={handleEditAddress}
        onEditPayment={handleEditPayment}
        onEditDeliveryFee={handleEditDeliveryFee}
        onConfirm={handleSubmit}
      />
    </Dialog>
  )
}

UpsertDeliveryDialog.propTypes = {
  open: PropTypes.bool,
  order: PropTypes.object,
  onClose: PropTypes.func,
  onExited: PropTypes.func,
  isAddCustomer: PropTypes.bool
}

UpsertDeliveryDialog.defaultProps = {
  open: false,
  order: {},
  onExited: () => {},
  onClose: () => {}
}

export default UpsertDeliveryDialog
