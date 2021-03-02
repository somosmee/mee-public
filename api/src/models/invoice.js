import mongoose from 'src/mongoose'

import invoiceScraper from 'src/scrappers/invoiceScrapper'

import { Supplier, Product, FinancialStatement } from 'src/models'

import {
  PurchaseItemStatus,
  PurchaseInvoiceStatus,
  FinancialOperations,
  ExpenseCategories
} from 'src/utils/enums'
import parse from 'src/utils/purchase'
import { isAccessKey } from 'src/utils/validator'

const { ObjectId } = mongoose.Types
const { Mixed } = mongoose.Schema.Types

const address = {
  street: {
    type: String,
    trim: true
  },
  number: {
    type: String,
    trim: true
  },
  complement: {
    type: String,
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  postalCode: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  }
}

const InvoiceSchema = new mongoose.Schema(
  {
    company: {
      type: ObjectId,
      index: true,
      ref: 'Company',
      required: true,
      es_indexed: true
    },
    createdBy: {
      type: ObjectId,
      index: true,
      ref: 'User',
      required: true,
      es_indexed: true
    },
    status: {
      type: String,
      enum: Object.keys(PurchaseInvoiceStatus).map((key) => PurchaseInvoiceStatus[key]),
      default: PurchaseInvoiceStatus.FETCHING,
      required: true
    },
    accessKey: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate: {
        validator: (value) => isAccessKey(value),
        message: (props) => `${props.value} não é uma chave de acesso válida.`
      }
    },
    serie: {
      type: String,
      trim: true
    },
    number: {
      type: String,
      trim: true
    },
    purpose: {
      type: String,
      trim: true
    },
    operation: {
      type: String,
      trim: true
    },
    issuer: {
      name: {
        type: String,
        trim: true
      },
      status: {
        type: String,
        trim: true
      },
      nationalId: {
        type: String,
        trim: true
      },
      address
    },
    buyer: {
      name: {
        type: String,
        trim: true
      },
      serie: {
        type: String,
        trim: true
      },
      number: {
        type: String,
        trim: true
      },
      address
    },
    items: [
      {
        type: Mixed,
        gtin: {
          type: String,
          trim: true
        },
        operation: {
          type: String,
          trim: true
        },
        quantity: {
          type: String,
          trim: true
        },
        totalPrice: {
          type: String,
          trim: true
        },
        items: [
          {
            type: Mixed,
            gtin: {
              type: String,
              trim: true
            },
            name: {
              type: String,
              trim: true
            },
            quantity: {
              type: String,
              trim: true
            },
            totalPrice: {
              type: String,
              trim: true
            },
            ncm: {
              type: String,
              trim: true
            }
          }
        ],
        body: String,
        issuedAt: {
          type: String,
          trim: true
        }
      }
    ],
    body: String,
    issuedAt: {
      type: String,
      trim: true
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
)

InvoiceSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Nota fiscal já existe'))
  } else {
    next(error)
  }
})

InvoiceSchema.statics.fetch = async function(companyId, userId, accessKey, purchase) {
  const Invoice = this

  let rawData
  let status = PurchaseInvoiceStatus.SUCCESS
  const conditions = { accessKey, company: companyId }

  try {
    rawData = await invoiceScraper({ accessKey })
  } catch (error) {
    status = PurchaseInvoiceStatus.ERROR
  }

  const update = { $set: { ...rawData, status } }
  const options = { new: true }
  const updatedInvoice = await Invoice.findOneAndUpdate(conditions, update, options)
  if (!updatedInvoice) throw new Error('Nota fiscal não encontrada')

  const { supplierData, purchaseData } = parse(rawData)

  let supplier
  if (supplierData && supplierData.nationalId) {
    const supplierQuey = {
      nationalId: supplierData.nationalId,
      company: companyId
    }
    supplier = await Supplier.findOne(supplierQuey)

    if (!supplier) {
      supplier = await new Supplier({
        ...supplierData,
        company: companyId,
        createdBy: userId
      }).save()
    }
  }

  if (purchaseData && supplier._id) {
    const gtins = purchaseData.items.map((item) => item.gtin)
    const productConditions = { gtin: { $in: gtins }, company: companyId }

    const products = await Product.find(productConditions)
    products.forEach((product) => {
      const index = purchaseData.items.findIndex((item) => item.gtin === product.gtin)

      if (index >= 0) {
        purchaseData.items[index] = {
          product: product._id,
          ...purchaseData.items[index],
          status: PurchaseItemStatus.DRAFT
        }
      }
    })

    // we are not getting the total amount so I am calculating manually for now
    purchaseData.total = parseFloat(
      purchaseData.items.reduce((total, item) => total + item.totalPrice, 0.0).toFixed(2)
    )

    purchase.set({ ...purchaseData, status, supplier: supplier._id })
    await purchase.save()

    // create financial movement for this purchase
    await FinancialStatement.createMovement(
      {
        value: purchase.total,
        paid: true,
        purchase: purchase._id,
        category: ExpenseCategories.INVENTORY_PURCHASE,
        description: supplier?.displayName
          ? `compra realizada no ${supplier.displayName}`
          : 'compra importada pela NFC-e',
        dueAt: new Date()
      },
      companyId,
      userId,
      FinancialOperations.EXPENSE
    )
  }
}

export default mongoose.model('Invoice', InvoiceSchema)
