import FormData from 'form-data'
import { ObjectID } from 'mongodb'

import ifood from 'src/ifood'

import { runIfoodMarketPlaceAnalysis } from 'src/cronjobs/jobs'

import { mapIfoodCategory, mapIfoodSku } from 'src/mapper/ifood'

import { Order, UserProduct, Product } from 'src/models'

import { isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import {
  IfoodOrderStatus,
  IfoodCancellationReasons,
  Origins,
  IfoodAvailability
} from 'src/utils/enums'
import logger from 'src/utils/logger'

export const toggleOpenStatus = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    if (!company.ifood.username || !company.ifood.password) {
      throw new Error('Ifood credentials must be filled')
    }

    company.ifood.set(input)
    await company.save()

    return company
  }
)

export const updateIfoodCredentials = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    company.ifood.set(input)
    await company.save()

    // start price market analysis
    // runIfoodMarketPlaceAnalysis(company)

    return company
  }
)

export const confirmIfoodOrder = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company, pubsub }, info) => {
    const order = await Order.findById(input.id)
    if (!order) throw new Error('Order not found')

    if (order.origin !== Origins.IFOOD) throw new Error('Only ifood orders can be accepted')

    await ifood.orderConfirmation(company.ifood.latestToken, order.ifood.reference)

    order.ifood.set({ status: IfoodOrderStatus.CONFIRMED })
    await order.save()

    return order
  }
)

export const dispatchIfoodOrder = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    const order = await Order.findById(input.id)
    if (!order) throw new Error('Order not found')

    if (order.origin !== Origins.IFOOD) throw new Error('Only ifood orders can be accepted')

    await ifood.orderDispatch(company.ifood.latestToken, order.ifood.reference)

    order.ifood.set({ status: IfoodOrderStatus.DISPATCHED })
    await order.save()

    return order
  }
)

export const cancellationIfoodOrder = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    const order = await Order.findById(input.id)
    if (!order) throw new Error('Order not found')

    if (order.origin !== Origins.IFOOD) throw new Error('Only ifood orders can be accepted')

    if (input.code === IfoodCancellationReasons['801'].code && !input.description) {
      throw new Error('Para este motivo é obrigatório informar uma descrição')
    }

    const data = { cancellationCode: input.code, description: input.description }

    await ifood.orderCancellationRequest(company.ifood.latestToken, order.ifood.reference, data)

    return order
  }
)

export const createIfoodCategory = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    if (!company.ifood.latestToken) await company.refreshIfoodToken()
    if (!company.ifood.merchant) throw new Error('Id do comerciante é necessário')

    const data = {
      merchantId: company.ifood.merchant,
      externalCode: new ObjectID(),
      name: input.name,
      description: input.description ?? '',
      availability: IfoodAvailability.AVAILABLE,
      template: 'PADRAO',
      order: input.position ?? 0
    }

    let response = null
    try {
      await ifood.createCategory(company.ifood.latestToken, data)
      response = await ifood.getCategories(company.ifood.latestToken, company.ifood.merchant)
    } catch (error) {
      logger.error('❗️ [createIfoodCategory] ', error)
      if (error.response?.status === 401) {
        await company.refreshIfoodToken()
        await ifood.createCategory(company.ifood.latestToken, data)
        response = await ifood.getCategories(company.ifood.latestToken, company.ifood.merchant)
      }
    }

    const categoryFound = response?.data.find(
      (category) => category.externalCode === data.externalCode.toString()
    )

    const getCategoryResponse = await ifood.getCategory(
      company.ifood.latestToken,
      company.ifood.merchant,
      categoryFound.id
    )

    const category = mapIfoodCategory(getCategoryResponse?.data)

    return category
  }
)

export const updateIfoodCategory = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    if (!company.ifood.latestToken) await company.refreshIfoodToken()
    if (!company.ifood.merchant) throw new Error('Id do comerciante é necessário')

    const data = {
      merchantId: company.ifood.merchant,
      externalCode: input.externalCode,
      name: input.name,
      description: input.description,
      availability: input.available ? IfoodAvailability.AVAILABLE : IfoodAvailability.UNAVAILABLE,
      order: input.position
    }

    try {
      await ifood.updateCategory(company.ifood.latestToken, data)
    } catch (error) {
      if (error.response?.status === 401) {
        logger.error('❗️ [updateIfoodCategory] ', error)
        await company.refreshIfoodToken()
        await ifood.updateCategory(company.ifood.latestToken, data)
      } else {
        logger.error('❗️ [updateIfoodCategory] ', error)
        throw error
      }
    }

    let category = null

    if (input.available) {
      const getCategoryResponse = await ifood.getCategory(
        company.ifood.latestToken,
        company.ifood.merchant,
        input.id
      )

      if (getCategoryResponse?.data.skus) {
        getCategoryResponse.data.skus = await Promise.all(
          getCategoryResponse.data.skus.map(async (sku) => {
            const getItemResponse = await ifood.getItem(
              company.ifood.latestToken,
              company.ifood.merchant,
              sku.id
            )

            sku.complements = getItemResponse?.data

            return sku
          })
        )
      }

      category = mapIfoodCategory(getCategoryResponse?.data)
    } else {
      category = {
        id: input.id,
        externalCode: data.externalCode,
        name: data.name,
        description: data.description,
        available: data.availability === IfoodAvailability.AVAILABLE,
        position: data.order,
        items: []
      }
    }

    return category
  }
)

export const deleteIfoodCategory = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    if (!company.ifood.latestToken) await company.refreshIfoodToken()
    if (!company.ifood.merchant) throw new Error('Id do comerciante é necessário')

    const data = {
      merchantId: company.ifood.merchant,
      externalCode: input.externalCode,
      availability: IfoodAvailability.DELETED
    }

    const getCategoryResponse = await ifood.getCategory(
      company.ifood.latestToken,
      company.ifood.merchant,
      input.id
    )

    if (getCategoryResponse?.data.skus) {
      getCategoryResponse.data.availability = IfoodAvailability.DELETED
      getCategoryResponse.data.skus = await Promise.all(
        getCategoryResponse.data.skus.map(async (sku) => {
          const getItemResponse = await ifood.getItem(
            company.ifood.latestToken,
            company.ifood.merchant,
            sku.id
          )

          sku.complements = getItemResponse?.data

          return sku
        })
      )
    }

    const category = mapIfoodCategory(getCategoryResponse?.data)

    try {
      await ifood.deleteCategory(company.ifood.latestToken, data)
    } catch (error) {
      if (error.response?.status === 401) {
        logger.error('❗️ [deleteIfoodCategory] ', error)
        await company.refreshIfoodToken()
        await ifood.deleteCategory(company.ifood.latestToken, data)
      } else {
        logger.error('❗️ [deleteIfoodCategory] ', error)
        throw error
      }
    }

    return category
  }
)

export const addIfoodItem = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    if (!company.ifood.latestToken) await company.refreshIfoodToken()
    if (!company.ifood.merchant) throw new Error('Id do comerciante é necessário')

    const conditions = { company: company._id, product: input.product }
    const userProduct = await UserProduct.findOne(conditions).populate('product')
    const product = Product.merge(userProduct)

    const sku = {
      merchantId: company.ifood.merchant,
      externalCode: product.gtin,
      availability: IfoodAvailability.AVAILABLE,
      name: product.name,
      ean: product.gtin,
      description: product.description ?? '',
      order: 0,
      price: {
        value: product.price
      }
    }

    const form = new FormData()
    form.append('sku', JSON.stringify(sku))

    try {
      await ifood.createItem(company.ifood.latestToken, form)
    } catch (error) {
      if (error.response?.status === 401) {
        logger.error('❗️ [addIfoodCategoryItem] ', error)
        await company.refreshIfoodToken()
        await ifood.createItem(company.ifood.latestToken, form)
      } else {
        logger.error('❗️ [addIfoodCategoryItem] Item has been created in iFood ', error)
      }
    }

    const linkItemData = {
      merchantId: company.ifood.merchant,
      externalCode: product.gtin,
      order: 0
    }

    try {
      await ifood.linkItem(company.ifood.latestToken, input.categoryExternalCode, linkItemData)
    } catch (error) {
      if (error.response?.status === 401) {
        logger.error('❗️ [addIfoodCategoryItem] ', error)
        await company.refreshIfoodToken()
        await ifood.linkItem(company.ifood.latestToken, input.categoryExternalCode, linkItemData)
      } else {
        logger.error(
          '❗️ [addIfoodCategoryItem] Item has been linked to a category in iFood ',
          error
        )

        throw new Error('Item já existe na categoria do iFood')
      }
    }

    const getCategoryResponse = await ifood.getCategory(
      company.ifood.latestToken,
      company.ifood.merchant,
      input.category
    )

    if (getCategoryResponse?.data.skus) {
      getCategoryResponse.data.skus = await Promise.all(
        getCategoryResponse.data.skus
          .filter((sku) => sku.externalCode === product.gtin)
          .map(async (sku) => {
            const getItemResponse = await ifood.getItem(
              company.ifood.latestToken,
              company.ifood.merchant,
              sku.id
            )

            sku.complements = getItemResponse?.data

            return sku
          })
      )
    }

    const item = mapIfoodSku(getCategoryResponse.data.skus[0])

    return item
  }
)

export const unlinkIfoodItem = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    if (!company.ifood.latestToken) await company.refreshIfoodToken()
    if (!company.ifood.merchant) throw new Error('Id do comerciante é necessário')

    const getCategoryResponse = await ifood.getCategory(
      company.ifood.latestToken,
      company.ifood.merchant,
      input.category
    )

    if (getCategoryResponse?.data.skus) {
      getCategoryResponse.data.skus = await Promise.all(
        getCategoryResponse.data.skus
          .filter((sku) => sku.externalCode === input.externalCode)
          .map(async (sku) => {
            const getItemResponse = await ifood.getItem(
              company.ifood.latestToken,
              company.ifood.merchant,
              sku.id
            )

            sku.complements = getItemResponse?.data

            return sku
          })
      )
    }

    const item = mapIfoodSku(getCategoryResponse.data.skus[0])

    const data = { merchantId: company.ifood.merchant, externalCode: input.externalCode }

    try {
      await ifood.unlinkItem(company.ifood.latestToken, input.categoryExternalCode, data)
    } catch (error) {
      if (error.response?.status === 401) {
        logger.error('❗️ [deleteIfoodCategoryItem] ', error)
        await company.refreshIfoodToken()
        await ifood.unlinkItem(company.ifood.latestToken, input.categoryExternalCode, data)
      } else {
        logger.error('❗️ [deleteIfoodCategoryItem] ', error)
        throw error
      }
    }

    return item
  }
)

export const updateIfoodItemAvailability = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    if (!company.ifood.latestToken) await company.refreshIfoodToken()
    if (!company.ifood.merchant) throw new Error('Id do comerciante é necessário')

    const data = {
      status: input.available ? IfoodAvailability.AVAILABLE : IfoodAvailability.UNAVAILABLE
    }

    try {
      await ifood.updateItemStatus(
        company.ifood.latestToken,
        company.ifood.merchant,
        input.externalCode,
        data
      )
    } catch (error) {
      if (error.response?.status === 401) {
        logger.error('❗️ [updateIfoodItemAvailability] ', error)
        await company.refreshIfoodToken()
        await ifood.updateItemStatus(company.ifood.latestToken, input.category, data)
      } else {
        logger.error('❗️ [updateIfoodItemAvailability] ', error)
        throw error
      }
    }

    const getCategoryResponse = await ifood.getCategory(
      company.ifood.latestToken,
      company.ifood.merchant,
      input.category
    )

    if (getCategoryResponse?.data.skus) {
      getCategoryResponse.data.skus = await Promise.all(
        getCategoryResponse.data.skus
          .filter((sku) =>
            input.item ? sku.id === input.item : sku.externalCode === input.externalCode
          )
          .map(async (sku) => {
            const getItemResponse = await ifood.getItem(
              company.ifood.latestToken,
              company.ifood.merchant,
              sku.id
            )

            if (!input.item) {
              sku.availability = data.status
              sku.complements = getItemResponse?.data
            } else {
              sku.complements = getItemResponse?.data.map((complement) => {
                complement.options = complement.options.map((option) => {
                  if (option.externalCode === input.externalCode) {
                    option.availability = data.status
                  }

                  return option
                })

                return complement
              })
            }

            return sku
          })
      )
    }

    const item = mapIfoodSku(getCategoryResponse.data.skus[0])

    return item
  }
)

export const createIfoodModifier = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    if (!company.ifood.latestToken) await company.refreshIfoodToken()
    if (!company.ifood.merchant) throw new Error('Id do comerciante é necessário')

    const data = {
      merchantId: company.ifood.merchant,
      externalCode: new ObjectID(),
      name: input.name,
      minQuantity: input.minimum ?? 0,
      maxQuantity: input.maximum,
      sequence: input.position ?? 0
    }

    try {
      await ifood.createOptionGroup(company.ifood.latestToken, data)
    } catch (error) {
      if (error.response?.status === 401) {
        logger.error('❗️ [createIfoodModifier] ', error)
        await company.refreshIfoodToken()
        await ifood.createOptionGroup(company.ifood.latestToken, data)
      } else {
        logger.error('❗️ [createIfoodModifier] createOptionGroup ', error)
      }
    }

    const foundProduct = await Product.findOne({ gtin: input.gtin })
    if (!foundProduct) throw new Error('Produto não encontrado!')

    const conditions = { company: company._id, product: foundProduct._id }
    const userProduct = await UserProduct.findOne(conditions).populate('product')
    const product = Product.merge(userProduct)

    Promise.all(
      product.modifiers.map(async (modifier) => {
        if (!input.modifiers.includes(modifier.id.toString())) return modifier

        const sku = {
          merchantId: company.ifood.merchant,
          externalCode: modifier.id,
          availability: 'AVAILABLE',
          name: modifier.name,
          description: modifier.description ?? '',
          order: 0,
          price: { value: modifier.price }
        }

        const form = new FormData()
        form.append('sku', JSON.stringify(sku))

        try {
          await ifood.createItem(company.ifood.latestToken, form)
        } catch (error) {
          if (error.response?.status === 401) {
            logger.error('❗️ [createIfoodModifier] ', error)
            await company.refreshIfoodToken()
            await ifood.createItem(company.ifood.latestToken, form)
          } else {
            logger.error('❗️ [createIfoodModifier] Item has been created in iFood ', error)
          }
        }

        const optionGroupData = {
          merchantId: company.ifood.merchant,
          externalCode: modifier.id,
          order: 0
        }

        try {
          await ifood.linkOptionGroupItem(
            company.ifood.latestToken,
            data.externalCode,
            optionGroupData
          )
        } catch (error) {
          if (error.response?.status === 401) {
            logger.error('❗️ [createIfoodModifier] ', error)
            await company.refreshIfoodToken()
            await ifood.linkOptionGroupItem(
              company.ifood.latestToken,
              data.externalCode,
              optionGroupData
            )
          } else {
            logger.error('❗️ [createIfoodModifier] linkOptionGroupItem ', error)
          }
        }

        return modifier
      })
    )

    const linkItemData = {
      merchantId: company.ifood.merchant,
      externalCode: data.externalCode,
      minQuantity: data.minQuantity,
      maxQuantity: data.maxQuantity,
      order: 0
    }

    try {
      await ifood.linkOptionGroupCategory(company.ifood.latestToken, input.gtin, linkItemData)
    } catch (error) {
      if (error.response?.status === 401) {
        logger.error('❗️ [createIfoodModifier] ', error)
        await company.refreshIfoodToken()
        await ifood.linkOptionGroupCategory(
          company.ifood.latestToken,
          '2000001000014',
          linkItemData
        )
      } else {
        logger.error('❗️ [createIfoodModifier] linkItem ', error)
      }
    }

    const getCategoryResponse = await ifood.getCategory(
      company.ifood.latestToken,
      company.ifood.merchant,
      input.category
    )

    if (getCategoryResponse?.data.skus) {
      getCategoryResponse.data.skus = await Promise.all(
        getCategoryResponse.data.skus
          .filter((sku) => sku.externalCode === input.gtin)
          .map(async (sku) => {
            const getItemResponse = await ifood.getItem(
              company.ifood.latestToken,
              company.ifood.merchant,
              sku.id
            )

            sku.complements = getItemResponse?.data

            return sku
          })
      )
    }

    const item = mapIfoodSku(getCategoryResponse.data.skus[0])

    return item
  }
)

export const updateIfoodModifier = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    if (!company.ifood.latestToken) await company.refreshIfoodToken()
    if (!company.ifood.merchant) throw new Error('Id do comerciante é necessário')

    const data = {
      merchantId: company.ifood.merchant,
      name: input.name,
      minQuantity: input.minimum,
      maxQuantity: input.maximum,
      sequence: input.position,
      availability: input.available ? IfoodAvailability.AVAILABLE : IfoodAvailability.UNAVAILABLE
    }

    try {
      await ifood.updateOptionGroup(company.ifood.latestToken, input.externalCode, data)
    } catch (error) {
      if (error.response?.status === 401) {
        logger.error('❗️ [deleteIfoodModifier] ', error)
        await company.refreshIfoodToken()
        await ifood.updateOptionGroup(company.ifood.latestToken, input.externalCode, data)
      } else {
        logger.error('❗️ [deleteIfoodModifier] ', error)
        throw error
      }
    }

    const getCategoryResponse = await ifood.getCategory(
      company.ifood.latestToken,
      company.ifood.merchant,
      input.category
    )

    if (getCategoryResponse?.data.skus) {
      getCategoryResponse.data.skus = await Promise.all(
        getCategoryResponse.data.skus
          .filter((sku) => sku.id === input.item)
          .map(async (sku) => {
            const getItemResponse = await ifood.getItem(
              company.ifood.latestToken,
              company.ifood.merchant,
              sku.id
            )

            sku.complements = getItemResponse?.data

            return sku
          })
      )
    }

    const item = mapIfoodSku(getCategoryResponse.data.skus[0])

    return item
  }
)

export const deleteIfoodModifier = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    if (!company.ifood.latestToken) await company.refreshIfoodToken()
    if (!company.ifood.merchant) throw new Error('Id do comerciante é necessário')

    const data = {
      merchantId: company.ifood.merchant,
      name: input.name,
      minQuantity: input.minimum,
      maxQuantity: input.maximum,
      sequence: input.position,
      availability: IfoodAvailability.DELETED
    }

    try {
      await ifood.updateOptionGroup(company.ifood.latestToken, input.externalCode, data)
    } catch (error) {
      if (error.response?.status === 401) {
        logger.error('❗️ [deleteIfoodModifier] ', error)
        await company.refreshIfoodToken()
        await ifood.updateOptionGroup(company.ifood.latestToken, input.externalCode, data)
      } else {
        logger.error('❗️ [deleteIfoodModifier] ', error)
        throw error
      }
    }

    const getCategoryResponse = await ifood.getCategory(
      company.ifood.latestToken,
      company.ifood.merchant,
      input.category
    )

    if (getCategoryResponse?.data.skus) {
      getCategoryResponse.data.skus = await Promise.all(
        getCategoryResponse.data.skus
          .filter((sku) => sku.id === input.item)
          .map(async (sku) => {
            const getItemResponse = await ifood.getItem(
              company.ifood.latestToken,
              company.ifood.merchant,
              sku.id
            )

            sku.complements = getItemResponse?.data

            return sku
          })
      )
    }

    const item = mapIfoodSku(getCategoryResponse.data.skus[0])

    return item
  }
)
