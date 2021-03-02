const natural = require('natural')

const stopwords = require('src/utils/stopwords')

const tokenizer = new natural.AggressiveTokenizerPt()

String.prototype.generateCompletionIndex = function() {
  const normalized = this.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  const tokens = tokenizer.tokenize(normalized)
  const terms = tokens.filter((token) => !(token in stopwords))

  return terms.map((_, index) => terms.slice(index).join(' '))
}
