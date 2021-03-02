import gtin from 'gtin'
import { ObjectID } from 'mongodb'
import mongooseDelete from 'mongoose-delete'

import storage from 'src/google/cloud-storage'

import mongoose from 'src/mongoose'

import { Company, Product, UserProduct } from 'src/models'

import { IMAGES_BUCKET_NAME } from 'src/utils/constants'
import { Measurements } from 'src/utils/enums'
import { generate } from 'src/utils/gtin'
import { normalizeText } from 'src/utils/preprocess'

const ProductSchema = new mongoose.Schema(
  {
    gtin: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate: {
        validator: (value) => gtin.validate(value),
        message: '{VALUE} não é um GTIN válido'
      }
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      lowercase: true
    },
    description: {
      type: String,
      trim: true,
      lowercase: true
    },
    measurement: {
      type: String,
      enum: Object.values(Measurements),
      required: true
    },
    ncm: {
      type: String,
      trim: true
    },
    internal: {
      type: Boolean,
      default: false,
      required: true
    },
    brand: {
      type: String,
      trim: true
    },
    deletedAt: Date,
    deleted: Boolean
  },
  {
    timestamps: true
  }
)

ProductSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Produto já cadastrado'))
  } else {
    next(error)
  }
})

ProductSchema.statics.merge = function(userProduct) {
  return {
    ...userProduct.product.toObject(),
    name: userProduct.name,
    image: userProduct.image,
    description: userProduct.description,
    balance: userProduct.balance,
    price: userProduct.price,
    tax: userProduct.tax,
    modifiers: userProduct.modifiers,
    bundle: userProduct.bundle,
    productionLine: userProduct.productionLine,
    deletedAt: userProduct.deletedAt
  }
}

ProductSchema.statics.mergeSearch = function(rankedResults) {
  console.log('[mergeSearch] rankedResults: ', rankedResults)

  return rankedResults.map((userProduct) => {
    console.log('rankedResults.userProduct: ', userProduct)
    const product = userProduct.product

    let productData = {}

    if (product instanceof Product) {
      productData = product.toObject()
    } else {
      productData = product
    }
    return {
      ...productData,
      confidence: userProduct.confidence,
      name: userProduct.name,
      image: userProduct.image,
      description: userProduct.description,
      balance: userProduct.balance,
      price: userProduct.price,
      tax: userProduct.tax,
      modifiers: userProduct.modifiers,
      productionLine: userProduct.productionLine,
      deletedAt: userProduct.deletedAt
    }
  })
}

ProductSchema.statics.findByGtin = function(gtin) {
  const Product = this
  return Product.findOneWithDeleted({ gtin })
}

ProductSchema.statics.createAndBindToUser = async function(input, companyId, userId) {
  const Product = this

  const company = await Company.findById(companyId)

  if (!input.internal && !input.gtin) {
    throw new Error('GTIN é obrigatório para produtos não internos')
  }

  if (input.bundle?.length) {
    for (const product of input.bundle) {
      if (!ObjectID.isValid(product.product)) {
        throw new Error(`Id do produto ${product.product} não é válido`)
      }

      const userProduct = await UserProduct.exists({ company: companyId, product: product.product })
      if (!userProduct) throw new Error(`Produto ${product.product} não existe`)
    }
  }

  if (input.internal) input.gtin = await Product.getNextGTIN(company)

  let product = await Product.findByGtin(input.gtin)

  if (product?.deleted) {
    await product.restore()
  }

  let userProductDeleted = null

  if (!product) {
    product = await Product(input).save()
    if (!product) throw new Error('Erro ao criar produto')
  } else {
    const conditions = { company: companyId, product: product._id }
    const userProductExists = await UserProduct.findOneWithDeleted(conditions)

    if (userProductExists?.deleted) {
      await userProductExists.restore()
      userProductDeleted = userProductExists
    } else if (userProductExists) {
      throw new Error('Produto já existe')
    }
  }

  const userProductInput = {
    _id: userProductDeleted ? userProductDeleted._id : undefined,
    createdBy: userId,
    company: companyId,
    product: product._id,
    price: input.price,
    name: input.name,
    nameES: normalizeText(input.name),
    description: input.description,
    modifiers: input.modifiers,
    bundle: input.bundle
  }

  if ('image' in input) {
    const image = await input.image
    const url = await storage.upload({
      bucketName: IMAGES_BUCKET_NAME,
      file: image,
      optimize: true,
      isPublic: true
    })
    userProductInput.image = url
  }

  if (input.productionLine) {
    if (!ObjectID.isValid(input.productionLine)) {
      throw new Error('Id da linha de produção não é válido')
    }
    userProductInput.productionLine = input.productionLine
  }

  const userProduct = await new UserProduct(userProductInput).save()
  userProduct.product = product

  return Product.merge(userProduct)
}

ProductSchema.statics.getNextGTIN = async function(company) {
  const Product = this

  const userProducts = await UserProduct.findWithDeleted({
    company: company._id
  })

  let lastGtin
  if (userProducts) {
    const ids = userProducts.map((product) => product.product)

    const options = { sort: { gtin: -1 }, limit: 1 }
    const conditions = { _id: { $in: ids }, internal: true }

    const [product] = await Product.findWithDeleted(conditions, null, options)

    if (product) lastGtin = product.gtin
  }

  const { number } = company

  return generate(number, lastGtin)
}

ProductSchema.plugin(mongooseDelete, { overrideMethods: true, indexFields: ['deletedAt'] })

export default mongoose.model('Product', ProductSchema)
