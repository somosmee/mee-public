import { Order, User } from 'src/models'

export default {
  productionLine: async (parent, args, { company }, info) => {
    return company.productionLines.find(
      (productionLine) => productionLine._id.toString() === parent.productionLine.toString()
    )
  },
  order: async (parent, args, { user }, info) => {
    return Order.findById(parent.order)
  },
  createdBy: async (parent, args, { user }, info) => {
    return User.findById(parent.createdBy)
  }
}
