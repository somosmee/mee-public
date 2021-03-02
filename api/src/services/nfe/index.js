import Joi from '@hapi/joi'

import mapper from 'src/mapper'

import { User } from 'src/models'

import axios from 'src/services/nfe/axios'

import { SalesInvoiceStatus } from 'src/utils/enums'
import logger from 'src/utils/logger'

const depopulateProduct = (item) => ({
  ...item.toObject(),
  product: item.product._id
})

const schema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.object().required()
      })
    )
    .required()
})

const sendNFCe = async (order) => {
  if (!order.invoice) order.invoice = {}

  // check if it's an ifood order and the product is not mapped
  const result = schema.validate(order, { allowUnknown: true })
  if (result.error) {
    console.log('ERROR:', result.error)
    order.invoice.status = SalesInvoiceStatus.ERROR
    order.invoice.error =
      'Por favor verifique se o GTIN dos seus produtos estão mapeados com o seu cardápio do ifood'

    throw new Error(
      `[sendNFCe] Products not mapped on ifood menu ${order.company} ${order._id.toString()}`
    )
  }

  const user = await User.findOne({ _id: order.company })

  if (!user.certificate) throw new Error(`[sendNFCe] User ${user._id} dont have a certifiate setup`)

  const populatedOrder = await order
    .populate('company')
    .populate('items.product')
    .execPopulate()

  logger.debug(`[sendNFCe] order: ${JSON.stringify(populatedOrder)}`)

  let response

  try {
    const data = mapper.mapOrderToNFe(populatedOrder)
    response = await axios.post('/nfce', {
      ...data,
      certificado_nome: user.certificate.name,
      certificado_senha: user.certificate.password
    })
  } catch (e) {
    order.invoice.status = SalesInvoiceStatus.ERROR
    order.invoice.error = e.message

    order.depopulate('company')
    order.items = order.items.map(depopulateProduct)

    await order.save()

    throw e
  }

  logger.debug(`[sendNFCe] nfe response: ${JSON.stringify(response?.data)}`)

  if (response.data?.error) {
    order.invoice.status = SalesInvoiceStatus.ERROR

    if (response.data?.error.includes('<xMotivo>')) {
      const errorMessages = response.data.error
        .match(/<xMotivo>(.*?)<\/xMotivo>/g)
        .map((val) => val.replace(/<\/?xMotivo>/g, ''))

      if (errorMessages.length > 0) {
        order.invoice.error = errorMessages[errorMessages.length - 1]
      }
    } else {
      order.invoice.error = response.data?.error
    }
  } else {
    order.invoice.status = SalesInvoiceStatus.SUCCESS
  }

  order.depopulate('company')
  order.items = order.items.map(depopulateProduct)

  await order.save()

  return response.data
}

export default { sendNFCe }
