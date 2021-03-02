import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'
import jwt from 'jsonwebtoken'
import sinon from 'sinon'

import { apolloServer } from 'src/apolloServer'

import { User, Company } from 'src/models'

import { SEND_PIN, SIGN_IN } from 'src/graphql/user/specs/gql'

import mail from 'src/services/mail'

import { Roles, MemberInviteStatus } from 'src/utils/enums'

let stubMail = null

test.before(async (t) => {
  stubMail = sinon.stub(mail, 'send').returns()
})

test.after(async (t) => {
  stubMail.restore()
})

/**
 * HELPERS
 */

const sendPin = async (input) => {
  const { mutate } = createTestClient({ apolloServer })

  const variables = { input }
  return mutate(SEND_PIN, { variables })
}

const signin = async (input) => {
  const { mutate } = createTestClient({ apolloServer })

  const variables = { input }
  return mutate(SIGN_IN, { variables })
}

/**
 * TESTS
 */

// we will change this later after FE changes to only create new user and
// create company will be a diff flow
test.skip('should send pin and create a new user and company', async (t) => {
  await sendPin({ email: 'guilherme.kodama@somosmee.com' })

  const users = await User.find({})

  t.truthy(!!users)
  t.is(users.length, 1)

  const user = users[0]

  const companies = await Company.find({
    'members.user': user._id,
    'members.role': Roles.BUSINESS_ADMIN
  })

  t.truthy(!!companies)
  t.is(companies.length, 1)

  const company = companies[0].toObject()
  t.is(company.number, 1)
  t.is(company.createdBy.toString(), user._id.toString())
  t.deepEqual(company.members, [
    {
      _id: company.members[0]._id,
      user: user._id,
      status: MemberInviteStatus.SUCCESS,
      role: Roles.BUSINESS_ADMIN
    }
  ])
})

test('should signin and generate token with user and company', async (t) => {
  const email = 'guilherme.kodama@somosmee.com'
  await sendPin({ email })

  const newUser = await User.findOne({ email })

  const res = await signin({ email, pin: newUser.pin })

  const { token, user, company } = res.data.signin

  t.truthy(!!token)
  t.truthy(!!user)
  t.falsy(!!company)

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  t.truthy(!!decoded.userId)
  t.falsy(!!decoded.companyId)
})
