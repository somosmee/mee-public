import { withFilter } from 'apollo-server-express'
import axios from 'axios'

import { User, Company } from 'src/models'

import { isPublicResolver, isAuthenticatedResolver } from 'src/graphql/resolvers/authentication'

import mail from 'src/services/mail'
import mailchimp from 'src/services/mailchimp'
import slack from 'src/services/slack'

import { generateShortID } from 'src/utils/auth'
import { Roles, EmployeePermissions } from 'src/utils/enums'
import { generateToken } from 'src/utils/token'
import { getNextCompanyNumber } from 'src/utils/user'

export const signinGoogleEmployer = isPublicResolver.createResolver(
  async (parent, { googleIdToken, loginUUID, referral }, { pubsub }, info) => {
    const {
      status,
      data: { aud, email, name, picture }
    } = await axios.get(`${process.env.GOOGLE_API}/oauth2/v3/tokeninfo?id_token=${googleIdToken}`)

    if (status === 400 || aud !== process.env.GOOGLE_CLIENT_ID) {
      throw new Error('Error signin in google')
    }

    let signup = false

    let user = await User.findOne({ email })

    if (!user) {
      signup = true
      user = await User.createUser({ email, name, picture, referral })

      await mail.send(
        {
          to: user.email,
          subject: user.name ? `${user.name} bem-vindo(a) à Mee!` : 'Bem-vindo(a) à Mee!'
        },
        'welcome.html'
      )

      if (process.env.NODE_ENV === 'production') {
        slack.sendMessage(`Novo usuário: ${user.email} 🎉`)
        mailchimp.addContact(user)
      }
    }

    if (loginUUID) {
      pubsub.publish('magicSignin', {
        magicSignin: {
          signup,
          token: generateToken({ userId: user._id, companyId: null }),
          user,
          loginUUID
        }
      })
    }

    return {
      signup,
      token: generateToken({ userId: user._id }),
      user
    }
  }
)

export const sendPin = async (parent, { input: { email } }, { pubsub }, info) => {
  email = email.toLowerCase()

  let user = await User.findOne({ email })

  if (!user) {
    user = await User.createUser({ email })
  }

  const pin = generateShortID()
  user.pin = pin

  mail.send(
    {
      to: email,
      subject: `Mee - seu PIN é ${pin}`,
      htmlData: { pin: pin }
    },
    'pin.html'
  )

  await user.save()

  return { sent: true }
}

export const signin = isPublicResolver.createResolver(
  async (parent, { input: { email, pin, referral, loginUUID } }, { pubsub }, info) => {
    const user = await User.findOne({ email })

    if (!user) throw new Error('Usuário não existe')

    if (user.pin !== pin) throw new Error('Pin está invalido!')

    let signup = false

    if (user.firstLogin) {
      signup = true
      user.firstLogin = false

      mail.send(
        {
          to: user.email,
          subject: user.name ? `${user.name} bem-vindo(a) à Mee!` : 'Bem-vindo(a) à Mee!'
        },
        'welcome.html'
      )

      if (process.env.NODE_ENV === 'production') {
        slack.sendMessage(`Novo usuário: ${user.email} 🎉`)
        mailchimp.addContact(user)
      }
    }

    const authPayload = {
      signup,
      token: generateToken({ userId: user._id }),
      user: user
    }

    if (loginUUID) {
      pubsub.publish('magicSignin', {
        magicSignin: {
          ...authPayload,
          loginUUID
        }
      })
    }

    user.pin = undefined
    user.save()

    return authPayload
  }
)

export const signinGoogleEmployee = isPublicResolver.createResolver(
  async (parent, args, context, info) => {
    const {
      status,
      data: { aud, email, name, picture }
    } = await axios(`${process.env.GOOGLE_API}/oauth2/v3/tokeninfo?id_token=${args.googleIdToken}`)

    if (status === 400 || aud !== process.env.GOOGLE_CLIENT_ID) {
      throw new Error('Error signin in google')
    }

    let user = await User.findByGoogleUser(email, { name, picture })
    if (!user) {
      const data = {
        email,
        name,
        picture,
        role: Roles.EMPLOYEE,
        permissions: EmployeePermissions,
        ifood: {
          open: false
        }
      }

      data.companyNumber = await getNextCompanyNumber()

      user = await new User(data).save()
      if (!user) throw new Error('Unable to create user')
    }

    return {
      token: generateToken({ userId: user._id }),
      user
    }
  }
)

export const me = isAuthenticatedResolver.createResolver(async (parent, args, { user }, info) => {
  return user
})

export const updateMe = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { user }, info) => {
    const { name, onboarding, ...rest } = input

    if ('name' in input) user.name = name

    if (input.onboarding) {
      if (input.onboarding.finishedCloseOrder) {
        mail.send(
          {
            to: user.email,
            subject: 'Parabéns você completou os primeiros passos 🎉'
          },
          'congrats-onboarding-completed.html'
        )

        input.onboarding.finishedAt = new Date()
      }

      user.onboarding.set(input.onboarding)
    }

    user.set(rest)

    await user.save()

    return user
  }
)

export const createPriceRule = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    company.settings.priceRules.push({ $each: input.rules })
    await company.save()
    return company
  }
)

export const updatePriceRule = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    company.settings.priceRules = company.settings.priceRules.map((rule) => {
      if (rule._id.toString() === input.id) {
        if (input.name) rule.name = input.name
        if (input.amount !== undefined) rule.amount = input.amount
        if (input.operationType) rule.operationType = input.operationType
        if (input.channels) rule.channels = input.channels
        if (input.active !== undefined) rule.active = input.active
      }

      return rule
    })
    await company.save()

    return company
  }
)

export const deletePriceRule = isAuthenticatedResolver.createResolver(
  async (parent, { input }, { company }, info) => {
    company.settings.priceRules = company.settings.priceRules.filter(
      (rule) => rule._id.toString() !== input.id
    )
    await company.save()

    return company
  }
)

/* SUBSCRIPTION */
export const magicSignin = {
  subscribe: withFilter(
    (parent, args, { pubsub, loginUUID }, info) => {
      console.info(`=== WITH_FILTER subscription - magicSignin - args: ${loginUUID}`)
      return pubsub.asyncIterator('magicSignin')
    },
    (payload, { loginUUID }) => {
      console.debug('=== MAGIC_SIGNIN payload:', payload)
      console.debug('=== MAGIC_SIGNIN loginUUID:', loginUUID)
      return loginUUID === payload.magicSignin.loginUUID
    }
  )
}
