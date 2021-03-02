Array.prototype.parseNfe = function() {
  if (!this) {
    throw new TypeError('Array is null or undefined')
  }

  const [
    ,
    serie,
    number,
    issuedAt,
    ,,,,,,,,,,,,,,,,
    purpose,
    ,
    operation,
  ] = this

  const invoice = {}
  
  if (serie) {
    invoice.serie = serie
  }
  
  if (number) {
    invoice.number = number
  }
  
  if (issuedAt) {
    invoice.issuedAt = issuedAt
  }

  if (purpose) {
    invoice.purpose = purpose
  }

  if (operation) {
    invoice.operation = operation
  }

  return invoice
}

Array.prototype.parseIssuer = function() {
  if (!this) {
    throw new TypeError('Array is null or undefined')
  }

  const [
    name,
    tradeName,
    nationalId,
    street,
    district,
    postalCode,
    city,
    phone,
    state,
    country,
  ] = this

  const issuer = {}

  if (name) {
    issuer.name = name
  }

  if (tradeName) {
    issuer.tradeName = tradeName
  }

  if (nationalId) {
    issuer.nationalId = nationalId
  }

  if (phone) {
    issuer.phone = phone
  }

  issuer.address = {}
  if (street) {
    issuer.address.street = street
  }

  if (district) {
    issuer.address.district = district
  }

  if (postalCode) {
    issuer.address.postalCode = postalCode
  }

  if (city) {
    issuer.address.city = city
  }

  if (state) {
    issuer.address.state = state
  }

  if (country) {
    issuer.address.country = country
  }

  return issuer
}

Array.prototype.parseBuyer = function() {
  if (!this) {
    throw new TypeError('Array is null or undefined')
  }

  const [
    name,
    nationalId,
    street,
    district,
    postalCode,
    city,
    phone,
    state,
    country,
  ] = this

  const buyer = {}

  if (name) {
    buyer.name = name
  }

  if (nationalId) {
    buyer.nationalId = nationalId
  }

  if (phone) {
    buyer.phone = phone
  }

  buyer.address = {}
  if (street) {
    buyer.address.street = street
  }

  if (district) {
    buyer.address.district = district
  }

  if (postalCode) {
    buyer.address.postalCode = postalCode
  }

  if (city) {
    buyer.address.city = city
  }

  if (state) {
    buyer.address.state = state
  }

  if (country) {
    buyer.address.country = country
  }

  return buyer
}

Array.prototype.parseItem = function() {
  if (!this) {
    throw new TypeError('Array is null or undefined')
  }

  const [
    position,
    name,
    quantity,
    measurement,
    totalPrice,
    ,
    ncm,
    ,,,,,,,,,,,
    gtin,
    ,,,
    unitPrice,
  ] = this

  const item = {}
  
  if (position) {
    item.position = position
  }

  if (name) {
    item.name = name
  }
  
  if (quantity) {
    item.quantity = quantity
  }
  
  if (measurement) {
    item.measurement = measurement
  }
  
  if (totalPrice) {
    item.totalPrice = totalPrice
  }

  if (unitPrice) {
    item.unitPrice = unitPrice
  }

  if (ncm) {
    item.ncm = ncm
  }
  
  if (gtin) {
    item.gtin = gtin
  }

  return item
}