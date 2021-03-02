import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'

import { apolloServer } from 'src/apolloServer'

import { Company, User, FinancialFund, FinancialStatement } from 'src/models'

import {
  CREATE_FINANCIAL_FUND,
  DELETE_FINANCIAL_FUND,
  UPDATE_FINANCIAL_FUND,
  GET_FINANCIAL_FUNDS,
  ADJUST_FINANCIAL_FUND
} from 'src/graphql/financialFund/specs/gql.js'

import { userGenerator } from 'src/test/utils/generators'

import { FinancialFundCategories } from 'src/utils/enums'
import { generateToken } from 'src/utils/token'

let headers = null
let user = null
let company = null

/**
 * CONTROLLERS
 */

const setUserAndCompany = async () => {
  const { user: newUser, company: newCompany } = await userGenerator()
  user = newUser
  company = newCompany
}

const createFinancialFund = async (variables) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const response = await mutate(CREATE_FINANCIAL_FUND, { variables })

  return response
}

const deleteFinancialFund = async (variables) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const response = await mutate(DELETE_FINANCIAL_FUND, { variables })

  return response
}

const updateFinancialFund = async (variables) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const response = await mutate(UPDATE_FINANCIAL_FUND, { variables })

  return response
}

const getFinancialFunds = async () => {
  const { query } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const response = await query(GET_FINANCIAL_FUNDS)

  return response
}

const adjustFinancialFund = async (variables) => {
  const { query } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const response = await query(ADJUST_FINANCIAL_FUND, { variables })

  return response
}

test.beforeEach(async (t) => {
  await Company.deleteMany({})
  await User.deleteMany({})
  await FinancialFund.deleteMany({})
  await FinancialStatement.deleteMany({})

  await setUserAndCompany()

  headers = { Authorization: generateToken({ userId: user.id, companyId: company.id }) }
})

test.afterEach.always(async (t) => {
  await Company.deleteMany({})
  await User.deleteMany({})
  await FinancialFund.deleteMany({})
  await FinancialStatement.deleteMany({})
})

test('should create financial fund', async (t) => {
  const variables = {
    input: {
      name: 'Caixa',
      category: FinancialFundCategories.REGISTER
    }
  }

  const response = await createFinancialFund(variables)

  t.is(response.errors, undefined)

  const {
    data: {
      createFinancialFund: { name, category, balance }
    }
  } = response

  t.is(name, 'Caixa')
  t.is(category, FinancialFundCategories.REGISTER)
  t.is(balance, 0)

  const statements = await FinancialStatement.find({})

  t.is(statements.length, 1)
})

test('should delete financial fund', async (t) => {
  const variables = {
    input: {
      name: 'Caixa',
      category: FinancialFundCategories.REGISTER
    }
  }

  const response = await createFinancialFund(variables)

  const {
    data: {
      createFinancialFund: { id }
    }
  } = response

  await deleteFinancialFund({ input: { id: id } })

  const funds = await FinancialFund.find({})

  t.is(funds.length, 0)

  const statements = await FinancialStatement.find({})

  t.is(statements.length, 0)
})

test('should update financial fund', async (t) => {
  const variables = {
    input: {
      name: 'Caixa',
      category: FinancialFundCategories.REGISTER
    }
  }

  const response = await createFinancialFund(variables)

  const {
    data: {
      createFinancialFund: { id }
    }
  } = response

  const resUp = await updateFinancialFund({ input: { id: id, name: 'Caixa 2' } })

  const {
    data: {
      updateFinancialFund: { name }
    }
  } = resUp

  t.is(name, 'Caixa 2')
})

test('should query financial funds', async (t) => {
  const variables = {
    input: {
      name: 'Caixa',
      category: FinancialFundCategories.REGISTER
    }
  }

  await createFinancialFund(variables)

  const response = await getFinancialFunds()
  const {
    data: { financialFunds }
  } = response

  t.is(financialFunds.length, 1)
})

test('should adjust balance of a financial fund to a negative value', async (t) => {
  const variables = {
    input: {
      name: 'Caixa',
      category: FinancialFundCategories.REGISTER,
      balance: 100
    }
  }

  const response = await createFinancialFund(variables)

  const {
    data: {
      createFinancialFund: { id }
    }
  } = response

  const respAd = await adjustFinancialFund({ input: { id: id, balance: -200 } })

  const {
    data: {
      adjustFinancialFund: { balance }
    }
  } = respAd

  t.is(balance, -200)

  const statements = await FinancialStatement.find({})

  t.is(statements.length, 2)
})

test('should adjust balance of a financial fund to a positive value', async (t) => {
  const variables = {
    input: {
      name: 'Caixa',
      category: FinancialFundCategories.REGISTER,
      balance: 100
    }
  }

  const response = await createFinancialFund(variables)

  const {
    data: {
      createFinancialFund: { id }
    }
  } = response

  const respAd = await adjustFinancialFund({ input: { id: id, balance: -200 } })

  const {
    data: {
      adjustFinancialFund: { balance }
    }
  } = respAd

  t.is(balance, -200)

  const statements = await FinancialStatement.find({})

  t.is(statements.length, 2)
})
