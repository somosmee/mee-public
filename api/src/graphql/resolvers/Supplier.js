import { User, Company } from 'src/models'

const Supplier = {
  company(parent) {
    return Company.findById(parent.company)
  },
  createdBy(parent) {
    return User.findById(parent.createdBy)
  }
}

export { Supplier as default }
