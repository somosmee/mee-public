import { Supplier, User, Invoice, Company } from 'src/models'

const Purchase = {
  supplier(parent) {
    return Supplier.findById(parent.supplier)
  },
  company(parent) {
    return Company.findById(parent.company)
  },
  createdBy(parent) {
    return User.findById(parent.createdBy)
  },
  invoice(parent) {
    return Invoice.findById(parent.invoice)
  }
}

export { Purchase as default }
