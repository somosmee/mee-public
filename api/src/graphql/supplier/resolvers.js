import { ObjectID } from 'mongodb'

import { Supplier } from 'src/models'

import { isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import { createPaginationPayload, enforcePaginationParams } from 'src/utils/pagination'

export const createSupplier = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { user, company }, info) => {
    input._completion = input.displayName.generateCompletionIndex()
    input._completion = input._completion.concat(input.displayName.generateCompletionIndex())
    input._completion = input._completion.concat([input.nationalId])

    const newSupplier = new Supplier({ ...input, company: company._id, createdBy: user._id })
    const supplier = await newSupplier.save()
    if (!supplier) throw new Error('Não foi possível salvar o fornecedor')

    return supplier
  }
)

export const updateSupplier = isAuthenticatedResolver.createResolver(
  async (parent, { id, input }, { company }, info) => {
    const conditions = { _id: id, company: company._id }
    const update = { $set: input, $unset: { deletedAt: 1 } }
    const options = { new: true }
    const supplier = await Supplier.findOneAndUpdate(conditions, update, options)
    if (!supplier) throw new Error('Fornecedor não encontrado')

    return supplier
  }
)
export const deleteSupplier = isAuthenticatedResolver.createResolver(
  async (parent, args, { company }, info) => {
    const conditions = { _id: args.id, company: company._id }
    const update = { $set: { deletedAt: new Date() } }
    const options = { new: true }
    const supplier = await Supplier.findOneAndUpdate(conditions, update, options)
    if (!supplier) throw new Error('Cliente não encontrado')

    return supplier
  }
)

export const supplier = isAuthenticatedResolver.createResolver(
  async (parent, args, { company }, info) => {
    const supplier = await Supplier.findOne({ _id: args.id, company: company._id })
    if (!supplier) throw new Error('Fornecedor não encontado')

    return supplier
  }
)

export const suppliers = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    const { first, skip } = enforcePaginationParams(input && input.pagination)

    const conditions = { company: company._id }
    const options = { skip, limit: first }
    const suppliers = await Supplier.find(conditions, null, options)
    if (!suppliers) throw new Error('Error while fetch suppliers')

    const count = await Supplier.countDocuments(conditions)

    const suppliersPayload = {
      suppliers,
      pagination: createPaginationPayload({ first, skip, count })
    }

    return suppliersPayload
  }
)

export const searchSuppliers = isAuthenticatedResolver.createResolver(
  async (parent, { text }, { company }, info) => {
    const results = await Supplier.searchES(text, company._id)

    if (results?.hits.total === 0) return []

    const ids = results.hits.hits.map((result) => new ObjectID(result._id))
    const suppliers = await Supplier.find({ _id: { $in: ids } })

    return suppliers
  }
)
