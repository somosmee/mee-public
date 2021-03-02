import { v4 as uuid } from 'uuid'

import storage from 'src/google/cloud-storage'

import { Company, User } from 'src/models'

import { isPublicResolver, isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import mail from 'src/services/mail'

import { IMAGES_BUCKET_NAME, CERTIFICATES_BUCKET_NAME } from 'src/utils/constants'
import { MemberInviteStatus } from 'src/utils/enums'
import { generateToken } from 'src/utils/token'

export const myCompany = isAuthenticatedResolver.createResolver(
  async (parent, args, { company }, info) => {
    return company
  }
)

export const myCompanies = isAuthenticatedResolver.createResolver(
  async (parent, args, { user }, info) => {
    const companies = await Company.find({
      'members.user': user._id
    })

    return companies
  }
)

export const signinCompany = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { user }, info) => {
    const company = await Company.findOne({ _id: input.company, 'members.user': user._id })
    if (!company) throw new Error('Empresa selecionada nao existe')

    return {
      token: generateToken({ userId: user._id, companyId: company._id }),
      user,
      company
    }
  }
)

export const createCompany = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { user }, info) => {
    const company = await Company.createCompany(user, input)
    if (!company) {
      console.log('company:', company)
      throw new Error('Erro ao criar a nova empresa')
    }

    return company
  }
)

export const updateMyCompany = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    const {
      banner,
      picture,
      certificate,
      name,
      nationalId,
      stateId,
      description,
      address,
      delivery,
      tax,
      onboarding,
      fees,
      forceOpenRegister,
      paymentMethods,
      purchasePaymentMethods,
      ...rest
    } = input

    if (banner) {
      const url = await storage.upload({
        bucketName: IMAGES_BUCKET_NAME,
        file: await banner,
        optimize: true,
        isPublic: true
      })
      company.banner = url
    }

    if (picture) {
      const url = await storage.upload({
        bucketName: IMAGES_BUCKET_NAME,
        file: await picture,
        optimize: true,
        isPublic: true
      })
      company.picture = url
    }

    if (certificate) {
      const file = await certificate.file
      const name = await storage.upload({ bucketName: CERTIFICATES_BUCKET_NAME, file })
      certificate.name = name

      company.set({ certificate })
    }

    if ('name' in input) company.name = name
    if ('nationalId' in input) company.nationalId = nationalId
    if ('stateId' in input) company.stateId = stateId
    if ('description' in input) company.description = description
    if ('tax' in input) {
      company.tax.set(input.tax)
    }
    if (address) {
      company.address = address
      Company.fetchIBGECityCode(company._id, company.address)
    }

    if (delivery) {
      company.settings.set({ delivery })
    }

    if (fees) {
      company.settings.set({ fees })
    }

    if ('forceOpenRegister' in input) {
      company.settings.set({ forceOpenRegister })
    }

    if ('paymentMethods' in input) {
      company.paymentMethods = input.paymentMethods
    }

    if ('purchasePaymentMethods' in input) {
      company.purchasePaymentMethods = input.purchasePaymentMethods
    }

    company.set(rest)

    await company.save()

    return company
  }
)

/**
 * MEMBERS
 */
export const createMember = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    // Create user
    let user = await User.findOne({ email: input.email })

    if (!user) {
      user = await User.createUser({ email: input.email })
    }

    const hasMember = company.members.find(
      (member) => member.user.toString() === user._id.toString()
    )

    if (hasMember) throw new Error('Usuário já foi adicionado ao time.')

    // associate with company with status pending
    const newMember = {
      user: user._id,
      role: input.role,
      inviteToken: uuid(),
      status: MemberInviteStatus.PENDING
    }

    company.members.push(newMember)

    await company.save()

    mail.send(
      {
        to: user.email,
        subject: company.name
          ? `Você recebeu um convite da ${company.name}`
          : 'Você recebeu um convite!',
        htmlData: {
          name: company.name,
          href: `${process.env.APP_URL}/memberInvite?inviteToken=${newMember.inviteToken}&user=${user._id}&company=${company._id}`
        }
      },
      'memberInvite.html'
    )

    return company
  }
)

export const acceptInvite = isPublicResolver.createResolver(
  async (parent, { input }, context, info) => {
    const user = await User.findById(input.user)
    if (!user) throw new Error('Nenhum convite encontrado para esse usuário')

    const company = await Company.findById(input.company)

    const memberIndex = company.members.findIndex(
      (member) => member.inviteToken === input.inviteToken
    )

    if (memberIndex < 0) throw new Error('Nenhum convite foi encontrado!')

    const member = company.members[memberIndex]

    member.status = MemberInviteStatus.SUCCESS
    member.inviteToken = undefined

    company.members[memberIndex] = member

    await company.save()

    return {
      signup: false,
      token: generateToken({ userId: user._id, companyId: company._id }),
      user: user,
      company
    }
  }
)

export const deleteMember = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    company.members = company.members.filter((member) => member._id.toString() !== input.member)

    await company.save()

    return company
  }
)
