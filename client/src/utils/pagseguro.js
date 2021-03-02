
const getBrand = async data => new Promise((resolve, reject) => {
  window.PagSeguroDirectPayment.getBrand({
    cardBin: data.cardBin,
    success: (response) => {
      resolve(response)
    },
    error: (response) => {
      // tratamento do erro
      reject(response.error)
    }
  })
})

const getSenderHash = async data => new Promise((resolve, reject) => {
  window.PagSeguroDirectPayment.onSenderHashReady((response) => {
    if (response.status === 'error') {
      return reject(response.message)
    }

    return resolve(response)
  })
})

const getCreditCardToken = async data => new Promise((resolve, reject) => {
  window.PagSeguroDirectPayment.createCardToken({
    cardNumber: data.cardNumber, // Número do cartão de crédito
    brand: data.brand, // Bandeira do cartão
    cvv: data.cvv, // CVV do cartão
    expirationMonth: data.expirationMonth, // Mês da expiração do cartão
    expirationYear: data.expirationYear, // Ano da expiração do cartão, é necessário os 4 dígitos.
    success: (response) => {
      resolve(response)
    },
    error: (response) => {
      reject(response)
    }
  })
})

export default {
  getBrand,
  getSenderHash,
  getCreditCardToken
}
