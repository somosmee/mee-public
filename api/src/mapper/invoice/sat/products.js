const mapMeasurement = (value) => {
  if (value === 'unit') return 'un'
  if (value === 'kilogram') return 'kg'
}

export const mapProd = (item, discount) => {
  const data = {
    cProd: item.gtin,
    xProd: item.name,
    // CFOP 5102 - Venda de mercadoria adquirida ou recebida de terceiros
    CFOP: '5102',
    uCom: mapMeasurement(item.measurement),
    qCom: `${item.quantity}.0000`,
    vUnCom: item.price.toFixed(2),
    indRegra: 'A', // Valor deve ser arredondado, com exceção de operação com combustíveis
    ...(discount && { vDesc: discount.toFixed(2) })
  }

  // Optional
  if (item.ncm) data.NCM = item.ncm

  return data
}
