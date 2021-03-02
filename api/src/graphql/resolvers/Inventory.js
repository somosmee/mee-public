import { Product, User, Company } from 'src/models'

const Inventory = {
  product(parent) {
    return Product.findById(parent.product)
  },
  company(parent) {
    return Company.findById(parent.company)
  },
  createdBy(parent) {
    return User.findById(parent.createdBy)
  }
}

export { Inventory as default }
