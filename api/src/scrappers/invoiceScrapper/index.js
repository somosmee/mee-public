import cheerio from 'cheerio'
import requestPromise from 'request-promise'

import 'src/scrappers/invoiceScrapper/parsers'

const URL = 'https://sistemas.sefaz.am.gov.br/nfceweb/'

const NFE_CONTEXT_SELECTOR = '#NFe'
const ISSUER_CONTEXT_SELECTOR = '#Emitente'
const BUYER_CONTEXT_SELECTOR = '#DestRem'
const PRODUCT_CONTEXT_SELECTOR = '#Prod'

const NFE_SELECTOR = 'fieldset > table > tbody > tr'
const ISSUER_SELECTOR = 'fieldset > table > tbody > tr'
const BUYER_SELECTOR = 'fieldset > table > tbody > tr'
const PRODUCT_SELECTOR = 'fieldset > div > table.toggle > tbody > tr'
const PRODUCT_DETAILS_SELECTOR = 'fieldset > div > table.toggable > tbody > tr > td'

let $ = null

const request = requestPromise.defaults({ baseUrl: URL, jar: true })

const invoiceScraper = async ({ accessKey, body }) => {
  let invoice = {}

  try {
    if (accessKey && body) {
      $ = cheerio.load(body)
    } else if (accessKey) {
      await request('consultarNFCe.jsp', { qs: { p: accessKey } })

      const options = {
        uri: 'consultarNFCe.do?acao=abrirAbas',
        transform: (body) => {
          invoice.body = body
          return cheerio.load(body)
        }
      }

      $ = await request(options)
    }

    const nfe = await getNfe()
    invoice = {
      ...invoice,
      ...nfe
    }
    invoice.issuer = await getIssuer()
    invoice.buyer = await getBuyer()
    invoice.items = await getItems()

    return Promise.resolve(invoice)
  } catch (error) {
    return Promise.reject(error)
  }
}

const getNfe = async () => {
  let result = []

  $(NFE_SELECTOR, NFE_CONTEXT_SELECTOR).each((_, el) => {
    const span = $(el)
      .find('td > span')
      .map((_, el) =>
        $(el)
          .text()
          .trim()
      )
      .get()

    result = result.concat(span)
  })

  return result.parseNfe()
}

const getIssuer = async () => {
  let result = []

  $(ISSUER_SELECTOR, ISSUER_CONTEXT_SELECTOR).each((_, el) => {
    const span = $(el)
      .find('td > span')
      .map((_, el) =>
        $(el)
          .text()
          .trim()
      )
      .get()

    result = result.concat(span)
  })

  return result.parseIssuer()
}

const getBuyer = async () => {
  let result = []

  $(BUYER_SELECTOR, BUYER_CONTEXT_SELECTOR).each((_, el) => {
    const span = $(el)
      .find('td')
      .map((_, el) =>
        $(el)
          .find('span')
          .text()
          .trim()
      )
      .get()

    result = result.concat(span)
  })

  return result.parseBuyer()
}

const getItems = async () => {
  const results = []

  $(PRODUCT_SELECTOR, PRODUCT_CONTEXT_SELECTOR).each((index, el) => {
    results[index] = $(el)
      .find('td')
      .map((_, el) =>
        $(el)
          .find('span')
          .text()
          .trim()
      )
      .get()
  })

  $(PRODUCT_DETAILS_SELECTOR, PRODUCT_CONTEXT_SELECTOR).each((index, el) => {
    const details = $(el)
      .find('table > tbody > tr > td')
      .map((_, el) =>
        $(el)
          .find('span.linha')
          .text()
          .trim()
      )
      .get()
    results[index] = [...results[index], ...details]
  })

  return results.map((result) => result.parseItem())
}

export { invoiceScraper as default }
