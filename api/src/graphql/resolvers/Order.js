import SAT from 'src/SAT'

import { User, Company, Customer, ProductionRequest } from 'src/models'

import { SalesInvoiceStatus } from 'src/utils/enums'
import logger from 'src/utils/logger'

const Order = {
  company(parent) {
    return Company.findById(parent.company)
  },
  createdBy(parent) {
    return User.findById(parent.createdBy)
  },
  customer: async (parent) => {
    const customer = await Customer.findById(parent.customer)
    return customer
  },
  invoice(order) {
    if (!order.invoice) return null

    return {
      ...order.invoice.toObject(),
      message() {
        const invoice = order.invoice
        if (invoice.status === SalesInvoiceStatus.PENDING) {
          return 'Invoice ainda não foi enviada para o SAT. Verifique se o programa da Mee para conexão com o SAT está aberto e conectado a internet.'
        } else if (invoice.status === SalesInvoiceStatus.SUCCESS) {
          try {
            const parsedResponse = SAT.parseResponse(invoice.responseSAT)
            return parsedResponse.messageCode
          } catch (e) {
            logger.error(
              `[Order.invoice.message] FAILED TO PARSE SAT RESPONSE ${invoice.responseSAT} ${e}`
            )
          }

          return 'Emitido com sucesso!'
        } else if (invoice.status === SalesInvoiceStatus.ERROR) {
          return invoice.validationError || invoice.error
        }
      }
    }
  },
  productionRequests(order) {
    return ProductionRequest.find({ order: order._id }).sort({
      createdAt: -1
    })
  }
}

export { Order as default }
