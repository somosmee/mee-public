import { ObjectID } from 'mongodb'

import storage from 'src/google/cloud-storage'

import { Product, UserProduct, Inventory } from 'src/models'

import { isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import { IMAGES_BUCKET_NAME } from 'src/utils/constants'
import { Measurements, Roles, Reasons, Operations } from 'src/utils/enums'
import { normalizeText } from 'src/utils/preprocess'

export const createProduct = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { user, company }, info) => {
    const product = await Product.createAndBindToUser(input, company._id, user._id)
    if (!product) throw new Error('Não foi possível vincular produto à loja')

    return product
  }
)

export const updateProduct = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    const userProduct = await UserProduct.findOne({ company: company._id, product: input.product })
    if (!userProduct) throw new Error('Falha ao atualizar. Produto não encontrado!')

    if (input.image) {
      const image = await input.image
      const url = await storage.upload({
        bucketName: IMAGES_BUCKET_NAME,
        file: image,
        optimize: true,
        isPublic: true
      })
      userProduct.image = url
    }

    if ('price' in input) userProduct.price = input.price

    /* MODIFIERS */
    if ('modifiers' in input) {
      userProduct.modifiers = input.modifiers
      userProduct.markModified('modifiers')
    }

    const product = await Product.findOne({ _id: userProduct.product })
    if (!product) throw new Error('Esse produto não existe. Por favor entre me contato com suporte')

    if (product.internal) {
      if ('name' in input) {
        product.name = input.name
        userProduct.name = input.name
        userProduct.nameES = normalizeText(input.name)
      }

      if ('measurement' in input) product.measurement = input.measurement

      await product.save()
    } else {
      if ('name' in input) {
        userProduct.name = input.name
        userProduct.nameES = normalizeText(input.name)
      }
    }

    if ('description' in input) {
      userProduct.description = input.description
    }

    if ('ncm' in input) {
      product.ncm = input.ncm
      await product.save()
    }

    if (input.productionLine) {
      if (!ObjectID.isValid(input.productionLine)) {
        throw new Error('Id da linha de produção não é válido')
      }
      userProduct.productionLine = input.productionLine
    }

    if (input.bundle?.length) {
      for (const product of input.bundle) {
        if (!ObjectID.isValid(product.product)) {
          throw new Error(`Id do produto ${product.product} não é válido`)
        }

        const userProduct = await UserProduct.exists({
          company: company._id,
          product: product.product
        })
        if (!userProduct) throw new Error(`Produto ${product.product} não existe`)
      }

      userProduct.set({ bundle: input.bundle })
    }

    await userProduct.save()

    userProduct.product = product

    return Product.merge(userProduct)
  }
)

export const deleteProduct = isAuthenticatedResolver.createResolver(
  async (parent, { input: { id } }, { company }, info) => {
    const conditions = { company: company._id, product: id }
    const userProduct = await UserProduct.findOne(conditions)
    const product = await Product.findOne({ _id: conditions.product })

    if (userProduct) {
      await userProduct.unIndex()
      await userProduct.delete()
    }

    if (product.internal) {
      await product.delete()
    }

    const invetoryHistory = await Inventory.find(conditions)
    // we do one be one so the hooks can be triggered
    // we can use them in the future to cascade actions
    for (const movement of invetoryHistory) {
      await movement.remove()
    }

    return product
  }
)

export const importProducts = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company, user }, info) => {
    // map import attributes to product attributes
    const data = input.products.map((product) => ({
      internal: !product.gtin,
      gtin: product.gtin,
      name: product.nome,
      description: product.descricao,
      price: product.preco,
      measurement: product.unidade === 'unidade' ? Measurements.UNIT : Measurements.KILOGRAM,
      quantity: product.quantidade
    }))

    for (const item of data) {
      const product = await Product.createAndBindToUser(item, company._id, user._id)

      if (item.quantity) {
        await Inventory.createMovement({
          data: {
            product: product._id,
            quantity: item.quantity,
            reason: Reasons.ACQUISITION
          },
          companyId: company._id,
          userId: user._id,
          operation: Operations.INCREASE
        })
      }
    }

    return 'OK'
  }
)

export const updateAllCompletionIndexes = async (parent, args, { user }, info) => {
  if (user.role !== Roles.ADMIN) throw new Error('Você não tem permissão para essa ação')

  const session = await Product.startSession()

  session.startTransaction()
  try {
    const userProducts = await UserProduct.find({}).session(session)

    for (const userProduct of userProducts) {
      const product = await Product.findOne({
        _id: userProduct.product
      }).session(session)

      const completion = product.name.generateCompletionIndex()

      await UserProduct.findOneAndUpdate(
        { _id: userProduct._id },
        { $set: { _completion: completion } },
        { session }
      )
    }

    session.commitTransaction()
  } catch (e) {
    console.log('ERROR:', e)
    session.abortTransaction()
  }
}
