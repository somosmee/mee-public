import { useEffect } from 'react'

import { useMutation, useSubscription } from '@apollo/react-hooks'

import { UPDATE_APP } from 'src/graphql/app/queries'
import { ORDER_SUBSCRIPTION } from 'src/graphql/order/queries'

import useApp from 'src/hooks/useApp'

import { Origins, IfoodStatus, OrderStatus } from 'src/utils/enums'

const useOrderSubscription = (input) => {
  const { app } = useApp()

  const [updateApp] = useMutation(UPDATE_APP)
  const { loading, error, data } = useSubscription(ORDER_SUBSCRIPTION, { variables: { input } })

  useEffect(() => {
    if (data?.order) {
      let requireConfirmation = false

      if (
        data.order.origin === Origins.ifood.value &&
        (data.order.ifood.status === IfoodStatus.integrated ||
          data.order.ifood.status === IfoodStatus.placed)
      ) {
        requireConfirmation = true
      }

      if (data.order.requireConfirmation && data.order.status === OrderStatus.open.type) {
        requireConfirmation = true
      }

      if (requireConfirmation) {
        updateApp({
          variables: { input: { notification: { ...app.notification, newOrder: true } } }
        })
      }
    }
  }, [data])

  return { loading, error, order: data?.order }
}

export default useOrderSubscription
