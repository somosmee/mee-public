import numeral from 'numeral'

numeral.register('locale', 'br', {
  delimiters: {
    thousands: '.',
    decimal: ','
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't'
  },
  ordinal: function(number) {
    return number === 1 ? 'o' : 'a'
  },
  currency: {
    symbol: 'R$'
  }
})

numeral.locale('br')
numeral.defaultFormat('$ 0,0.00')

export { numeral as default }
