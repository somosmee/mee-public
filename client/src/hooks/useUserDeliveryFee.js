import React from 'react'

import { useMutation } from '@apollo/react-hooks'

import CardActions from '@material-ui/core/CardActions'

import Button from 'src/components/Button'

import { OPEN_NOTIFICATION } from 'src/graphql/notification/queries'

import DeliveryFeesForm from 'src/forms/DeliveryFeesForm'

import useCompany from 'src/hooks/useCompany'

import { FirebaseEvents } from 'src/utils/enums'

import { analytics } from 'src/firebase'

const useUserDeliveryFee = (initialValues) => {
  const {
    updateMyCompany: [updateMyCompany, { loading }]
  } = useCompany()

  const [openNotification] = useMutation(OPEN_NOTIFICATION)

  const handleSubmit = async (data) => {
    try {
      await updateMyCompany({ delivery: data })
      analytics.logEvent(FirebaseEvents.SET_DELIVERY_FEE)
    } catch ({ message }) {
      openNotification({ variables: { input: { variant: 'error', message } } })
    }
  }

  const deliveryFeeProps = {
    initialValues: initialValues,
    loading: loading,
    onSubmit: handleSubmit,
    // eslint-disable-next-line
    actions: (loading, onSubmit) => (
      <CardActions>
        <Button color='primary' onClick={onSubmit} loading={loading}>
          SALVAR
        </Button>
      </CardActions>
    )
  }

  return {
    deliveryFeeProps,
    DeliveryFeesForm
  }
}

export default useUserDeliveryFee
