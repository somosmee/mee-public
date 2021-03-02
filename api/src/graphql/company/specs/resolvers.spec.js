import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'
import sinon from 'sinon'

import { apolloServer } from 'src/apolloServer'

import { Company, User } from 'src/models'

import { CREATE_MEMBER, DELETE_MEMBER, ACCEPT_INVITE } from 'src/graphql/company/specs/gql'

import mail from 'src/services/mail'

import { userGenerator } from 'src/test/utils/generators'

import { Roles, MemberInviteStatus } from 'src/utils/enums'
import { generateToken } from 'src/utils/token'

let headers = null
let user = null
let company = null
let stubMail = null

const setUserAndCompany = async () => {
  const { user: newUser, company: newCompany } = await userGenerator()
  user = newUser
  company = newCompany
}

test.before(() => {
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
  stubMail.restore()
})

/**
 * HELPERS
 */

const createMember = async (email) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })
  const variables = {
    input: {
      email,
      role: Roles.ATTENDANT
    }
  }

  const response = await mutate(CREATE_MEMBER, { variables })

  return response
}

const deleteMember = async (memberId) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })
  const variables = {
    input: {
      member: memberId
    }
  }

  const response = await mutate(DELETE_MEMBER, { variables })

  return response
}

test('should create member and send invite', async (t) => {
  const email = 'guilherme.kodama@gmail.com'

  const response = await createMember(email)

  t.is(response.errors, undefined)

  const companyUpdated = await Company.findById(company._id)

  t.is(companyUpdated.members.length, 2)
  t.is(companyUpdated.members[1].status, MemberInviteStatus.PENDING)
  t.is(companyUpdated.members[1].role, Roles.ATTENDANT)
  t.not(companyUpdated.members[1].inviteToken, undefined)
  t.is(response.data.createMember.members[1].user.email, email)
})

test('should be able to accept the invite and auth as an user in the company invite', async (t) => {
  const email = 'guilherme.kodama@gmail.com'

  const responseCreate = await createMember(email)

  t.is(responseCreate.errors, undefined)

  const companyUpdated = await Company.findById(company._id)
  const newMember = companyUpdated.members[1]

  t.not(newMember.inviteToken, undefined)

  const variables = {
    input: {
      user: newMember.user.toString(),
      company: company._id.toString(),
      inviteToken: newMember.inviteToken
    }
  }

  const { mutate } = createTestClient({ apolloServer })
  const response = await mutate(ACCEPT_INVITE, { variables })

  t.is(response.errors, undefined)
  t.not(response.data.acceptInvite.token, undefined)

  const companyUpdated2 = await Company.findById(company._id)

  t.is(companyUpdated2.members.length, 2)
  t.is(companyUpdated2.members[1].status, MemberInviteStatus.SUCCESS)
  t.is(companyUpdated2.members[1].role, Roles.ATTENDANT)
  t.is(companyUpdated2.members[1].inviteToken, undefined)
})

test('should remove member from company', async (t) => {
  const email = 'guilherme.kodama@gmail.com'

  const responseCreate = await createMember(email)

  t.is(responseCreate.errors, undefined)

  const companyUpdated = await Company.findById(company._id)
  const newMember = companyUpdated.members[1]

  const response = await deleteMember(newMember._id.toString())

  t.is(response.errors, undefined)

  const companyUpdated2 = await Company.findById(company._id)

  t.is(companyUpdated2.members.length, 1)
})
