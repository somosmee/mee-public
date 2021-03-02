import { order, orderClosed, productionRequest } from 'src/graphql/order/subscriptions'
import { magicSignin } from 'src/graphql/user/resolvers'

const Subscription = {
  order,
  orderClosed,
  productionRequest,
  magicSignin
}

export { Subscription as default }
