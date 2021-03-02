import createNumberMask from 'text-mask-addons/dist/createNumberMask'

export const numberMask = createNumberMask({
  prefix: 'R$ ',
  allowDecimal: true,
  decimalSymbol: ',',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: '.'
})
