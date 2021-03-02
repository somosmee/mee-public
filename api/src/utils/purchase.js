import { minify, validate, getRealFormat } from 'gtin'
import moment from 'moment'
import mongoose from 'src/mongoose'

import { PurchaseItemStatus } from 'src/utils/enums'

const { ObjectId } = mongoose.Types

const gtins = ['GTIN-8', 'GTIN-12', 'GTIN-13', 'GTIN-14']

String.prototype.toGtin = function() {
  if (!this) return this

  try {
    const gtin = minify(this)

    if (validate(gtin) && gtins.includes(getRealFormat(gtin))) return gtin

    return ''
  } catch (error) {
    return ''
  }
}

const parse = (data) => {
  const purchaseData = {}

  if (data.serie) {
    purchaseData.serie = parseInt(data.serie)
  }

  if (data.number) {
    purchaseData.number = parseInt(data.number)
  }

  if (data.issuedAt) {
    purchaseData.purchasedAt = moment(data.issuedAt.trim(), 'DD/MM/YYYY hh:mm:ssZZ').toISOString()
  }

  const supplierData = {}
  if (data.issuer) {
    if (data.issuer.nationalId) {
      supplierData.nationalId = data.issuer.nationalId.replace(/\D/g, '')
    }

    if (data.issuer.name) {
      supplierData.displayName = data.issuer.name
      supplierData.name = data.issuer.name
    }
  }

  if (data.items) {
    purchaseData.items = data.items.reduce((acc, current) => {
      const index = acc.findIndex((item) => {
        return (
          item.name === current.name &&
          item.measurement === current.measurement &&
          item.gtin.toGtin() === current.gtin.toGtin()
        )
      })

      if (index < 0) {
        return acc.concat({
          _id: new ObjectId(),
          gtin: current.gtin.toGtin(),
          name: current.name,
          quantity: parseFloat(current.quantity.replace(',', '.')),
          measurement: current.measurement,
          unitPrice: parseFloat(current.unitPrice.replace(',', '.')),
          totalPrice: parseFloat(current.totalPrice.replace(',', '.')),
          ncm: current.ncm,
          status: PurchaseItemStatus.NEW
        })
      }

      acc[index] = {
        ...acc[index],
        quantity: acc[index].quantity + parseFloat(current.quantity.replace(',', '.')),
        totalPrice: acc[index].totalPrice + parseFloat(current.totalPrice.replace(',', '.'))
      }

      return acc
    }, [])
  }

  return { supplierData, purchaseData }
}

export { parse as default }
