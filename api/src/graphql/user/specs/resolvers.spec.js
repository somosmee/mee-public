import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'
import axios from 'axios'
import sinon from 'sinon'

import { apolloServer } from 'src/apolloServer'

import { Company, User } from 'src/models'

import {
  SIGN_IN_GOOGLE_EMPLOYER,
  CREATE_PRICE_RULE,
  UPDATE_PRICE_RULE,
  DELETE_PRICE_RULE
} from 'src/graphql/user/specs/gql'

import mail from 'src/services/mail'

import {
  NEW_USER,
  NEW_USER_REFERRAL,
  NEW_PRICE_RULE,
  PRICE_RULE_UPDATE,
  PRICE_RULE
} from 'src/test/common/payloads/users'
import { userGenerator } from 'src/test/utils/generators'

import { generateToken } from 'src/utils/token'

let user = null
let company = null
let headers = null
let stubAxios = null
let stubMail = null

const setUserAndCompany = async () => {
  const { user: newUser, company: newCompany } = await userGenerator()
  user = newUser
  company = newCompany
}

const createPriceRule = async (mutate) => {
  const variables = { input: NEW_PRICE_RULE }
  const response = await mutate(CREATE_PRICE_RULE, { variables })
  return response
}

test.before(async (t) => {
  const response = {
    status: 200,
    data: {
      aud: process.env.GOOGLE_CLIENT_ID,
      email: 'kayron.scabral@gmail.com',
      name: 'New User',
      picture: ''
    }
  }
  stubAxios = sinon.stub(axios, 'get').returns(Promise.resolve(response))
  stubMail = sinon.stub(mail, 'send').returns()
})

test.beforeEach(async (t) => {
  await Company.deleteMany({})
  await User.deleteMany({})

  await setUserAndCompany()
  headers = { Authorization: generateToken({ userId: user._id, companyId: company._id }) }
})

test.afterEach(async (t) => {
  await Company.deleteMany({})
  await User.deleteMany({})
})

test.after(async (t) => {
  await Company.deleteMany({})
  await User.deleteMany({})
  stubAxios.restore()
  stubMail.restore()
})

test('should create a employer user', async (t) => {
  const { mutate } = createTestClient({ apolloServer })

  const variables = NEW_USER
  const response = await mutate(SIGN_IN_GOOGLE_EMPLOYER, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.signinGoogleEmployer, null)
  t.is(response.data.signinGoogleEmployer.signup, true)
  t.not(response.data.signinGoogleEmployer.token, null)

  const {
    user: { referral, ...userData }
  } = response.data.signinGoogleEmployer

  const user = {
    email: 'kayron.scabral@gmail.com',
    name: 'New User'
  }

  t.deepEqual(userData, user)
})

test('should create a employer user with referral code', async (t) => {
  const { mutate } = createTestClient({ apolloServer })

  const variables = NEW_USER_REFERRAL
  const response = await mutate(SIGN_IN_GOOGLE_EMPLOYER, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.signinGoogleEmployer, null)
  t.is(response.data.signinGoogleEmployer.signup, true)
  t.not(response.data.signinGoogleEmployer.token, null)

  const { user } = response.data.signinGoogleEmployer

  const input = {
    email: 'kayron.scabral@gmail.com',
    name: 'New User',
    referral: NEW_USER_REFERRAL.referral
  }

  t.deepEqual(user, input)
})

test('should create a price rule', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const response = await createPriceRule(mutate)

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.createPriceRule, undefined)
  t.not(response.data.createPriceRule.settings, undefined)
  t.not(response.data.createPriceRule.settings.priceRules, undefined)
  t.is(response.data.createPriceRule.settings.priceRules.length, 1)

  const [first] = response.data.createPriceRule.settings.priceRules
  const { _id, ...priceRule } = first

  t.not(_id, undefined)
  t.deepEqual(priceRule, NEW_PRICE_RULE.rules[0])
})

test('should update a price rule', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const responseCreate = await createPriceRule(mutate)

  const variables = {
    input: {
      ...PRICE_RULE_UPDATE,
      id: responseCreate.data.createPriceRule.settings.priceRules[0]._id
    }
  }
  const response = await mutate(UPDATE_PRICE_RULE, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.updatePriceRule, undefined)
  t.not(response.data.updatePriceRule.settings, undefined)
  t.not(response.data.updatePriceRule.settings.priceRules, undefined)
  t.is(response.data.updatePriceRule.settings.priceRules.length, 1)

  const [first] = response.data.updatePriceRule.settings.priceRules
  const { _id, ...priceRuleUpdated } = first
  const { id, ...priceRule } = PRICE_RULE_UPDATE

  t.is(_id, responseCreate.data.createPriceRule.settings.priceRules[0]._id)
  t.deepEqual(priceRuleUpdated, priceRule)
})

test('should delete a price rule', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const variables = { input: PRICE_RULE }
  const response = await mutate(DELETE_PRICE_RULE, { variables })

  t.is(response.errors, undefined)
  t.not(response.data, null)
  t.not(response.data.deletePriceRule, undefined)
  t.not(response.data.deletePriceRule.settings, undefined)
  t.not(response.data.deletePriceRule.settings.priceRules, undefined)
  t.is(response.data.deletePriceRule.settings.priceRules.length, 0)
})
