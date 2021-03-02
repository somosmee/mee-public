import { Order } from 'src/models'

const UserBill = {
  items: {
    order: (parent) => {
      return Order.findById(parent.order)
    }
  }
}

export { UserBill as default }
