import { ObjectID } from 'mongodb'

import { Customer } from 'src/models'

import { isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import { createPaginationPayload, enforcePaginationParams } from 'src/utils/pagination'

export const createCustomer = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { user, company }, info) => {
    input._completion = [input.mobile, input.mobile.slice(2)]

    let customer = await Customer.findOneWithDeleted({
      company: company._id,
      mobile: input.mobile
    })

    if (!customer) {
      if ('nationalId' in input) {
        const customerCPF = await Customer.findOne({
          company: company._id,
          nationalId: input.nationalId
        })

        if (customerCPF) {
          throw new Error(
            `O cliente ${customerCPF.firstName} ${customerCPF.lastName} já tem o CPF: ${input.nationalId}`
          )
        }
      }

      customer = new Customer({ ...input, company: company._id, createdBy: user._id })
    } else if (customer.deleted) {
      await customer.restore()

      customer.set({ ...input, company: company._id, createdBy: user._id })
    } else {
      throw new Error('Cliente já existe!')
    }

    await customer.save()

    return customer
  }
)

export const updateCustomer = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    const customer = await Customer.findOne({ _id: input.customer, company: company._id })

    if (!customer) throw new Error('Cliente não foi encontrado!')

    if (input.company) customer.markModified('company')

    customer.set(input)
    await customer.save()

    return customer
  }
)

export const deleteCustomer = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    if (!ObjectID.isValid(input.customer)) throw new Error('Id do cliente não é válido')

    const result = await Customer.deleteById(input.customer)
    if (!result.nModified) throw new Error('Cliente não encontrado')

    const customer = await Customer.findOneDeleted({ _id: input.customer })
    if (!customer) throw new Error('Cliente não encontrado')

    return customer
  }
)

export const customer = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { user, company }, info) => {
    if (!ObjectID.isValid(input.customer)) throw new Error('Id do cliente não é válido')

    const customer = await Customer.findOne({ _id: input.customer, company: company._id })
    if (!customer) throw new Error('Cliente não encontado')

    return customer
  }
)

export const customers = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    const { first, skip } = enforcePaginationParams(input && input.pagination)

    const conditions = { company: company._id }
    const options = { skip: skip, limit: first }
    const customers = await Customer.find(conditions, null, options)
    if (!customers) throw new Error('Error while fetch customers')

    const count = await Customer.countDocuments(conditions)

    const customersPayload = {
      customers,
      pagination: createPaginationPayload({ first, skip, count })
    }

    return customersPayload
  }
)

export const createCustomerAddress = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    if (!ObjectID.isValid(input.customer)) throw new Error('Id do cliente não é válido')

    const customer = await Customer.findOne({ _id: input.customer, company: company._id })
    if (!customer) throw new Error('Customer not found')

    customer.addresses.push(input)
    await customer.save()

    return customer
  }
)

export const updateCustomerAddress = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    if (!ObjectID.isValid(input.customer)) throw new Error('Id do cliente não é válido')
    if (!ObjectID.isValid(input.address)) throw new Error('Id do endereço não é válido')

    const customer = await Customer.findOne({ _id: input.customer, company: company._id })
    if (!customer) throw new Error('Cliente não encontrado')

    const index = customer.addresses.findIndex(
      (address) => address._id.toString() === input.address
    )
    if (index < 0) throw new Error('Endereço não encontrado')

    customer.addresses.set(index, input)
    await customer.save()

    return customer
  }
)

export const deleteCustomerAddress = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    if (!ObjectID.isValid(input.customer)) throw new Error('Id do cliente não é válido')
    if (!ObjectID.isValid(input.address)) throw new Error('Id do endereço não é válido')

    const customer = await Customer.findOne({ _id: input.customer, company: company._id })
    if (!customer) throw new Error('Cliente não encontrado')

    customer.addresses.pull({ _id: input.address })
    await customer.save()

    return customer
  }
)

export const searchCustomers = isAuthenticatedResolver.createResolver(
  async (parent, { text }, { company }, info) => {
    const results = await Customer.searchES(text, company._id)

    if (results?.hits.total === 0) return []

    const ids = results.hits.hits.map((result) => new ObjectID(result._id))
    const customers = await Customer.find({ _id: { $in: ids } })

    return customers
  }
)
