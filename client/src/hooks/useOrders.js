import { useEffect } from 'react'

import { useQuery, useMutation } from '@apollo/react-hooks'

import { UPDATE_APP } from 'src/graphql/app/queries'
import { ORDERS } from 'src/graphql/order/queries'

import useApp from 'src/hooks/useApp'

import { Origins, IfoodStatus, OrderStatus } from 'src/utils/enums'

const useOrders = (options, queryOptions = {}) => {
  const { app } = useApp()

  const [updateApp] = useMutation(UPDATE_APP)
  const { loading, error, data, refetch } = useQuery(ORDERS, {
    variables: { input: { filter: { ...options } } },
    fetchPolicy: queryOptions.fetchPolicy || 'network-only'
  })

  useEffect(() => {
    if (data?.orders.orders) {
      const requireConfirmation = data.orders.orders
        .filter((order) => order.status === OrderStatus.open.type)
        .some((order) => {
          if (
            order.origin === Origins.ifood.value &&
            (order.ifood.status === IfoodStatus.integrated ||
              order.ifood.status === IfoodStatus.placed)
          ) {
            return true
          }

          if (order.requireConfirmation) return true

          return false
        })

      if (requireConfirmation) {
        updateApp({
          variables: { input: { notification: { ...app.notification, newOrder: true } } }
        })
      } else {
        updateApp({
          variables: { input: { notification: { ...app.notification, newOrder: false } } }
        })
      }
    }
  }, [data])

  return { loading, error, orders: data?.orders, refetch }
}

export default useOrders
