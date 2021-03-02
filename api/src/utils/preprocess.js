const natural = require('natural')

const stopwords = require('src/utils/stopwords')

const tokenizer = new natural.AggressiveTokenizerPt()

export const normalizeText = (text) => {
  if (!text) return text
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export const normalizePhone = (text) => {
  if (!text) return text
  return normalizeText(text)
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/\s/g, '')
}

export const buildQueryString = (text, options = {}) => {
  let query = ''
  const symbol = options.wildcard ? '*' : '~'

  if (text) {
    if (options.wildcard) {
      query = text.replace(/ /g, `${symbol} `)
      if (query.slice(-2) !== `${symbol} `) {
        query = `${symbol}${query.trim()}${symbol}`
      }
    } else {
      // https://www.elastic.co/guide/en/elasticsearch/reference/7.6/query-dsl-query-string-query.html
      query = text.replace(/ /g, `${symbol} `)
      if (query.slice(-2) !== `${symbol} `) {
        query = `${query.trim()}${symbol}`
      }
    }
  }

  return query
}

export const tokenize = (text) => tokenizer.tokenize(text)

export const removeStopwords = (text) => {
  const tokens = tokenize(text)
  const terms = tokens.filter((token) => !(token in stopwords))

  return terms.join(' ')
}
