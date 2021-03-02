import { Payments } from 'src/utils/enums'

export const mapPgto = (order) => {
  if (!order) {
    throw new Error(
      'É preciso ter informações de pagamento para emitir Nota Fiscal. Pedido incorreto.'
    )
  }
  if (!order.payments) {
    throw new Error('É preciso ter informações de pagamento para emitir Nota Fiscal')
  }
  if (order.payments.length === 0) {
    throw new Error('É preciso ter informações de pagamento para emitir Nota Fiscal')
  }

  return {
    MP: order.payments.map((payment) => mapPayment(payment))
  }
}

const mapPayment = (payment) => {
  return {
    cMP: mapPaymentMethod(payment.method),
    vMP: payment.value.toFixed(2)
  }
}

const mapPaymentMethod = (method) => {
  if (method === Payments.CASH) {
    return '01'
  } else if (method === Payments.CREDIT) {
    return '03'
  } else if (method === Payments.DEBT) {
    return '04'
  } else if (method === Payments.VOUCHER) {
    return '10'
  } else if (method === Payments.PIX) {
    return '99'
  } else {
    return '99'
  }
}
