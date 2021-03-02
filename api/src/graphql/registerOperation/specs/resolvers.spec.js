import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'
import moment from 'moment'

import { apolloServer } from 'src/apolloServer'

import {
  RegisterOperation,
  FinancialFund,
  Product,
  UserProduct,
  FinancialStatement
} from 'src/models'

import {
  CREATE_REGISTER_OPERATION,
  GET_REGISTER_OPERATION,
  DELETE_REGISTER_OPERATION
} from 'src/graphql/registerOperation/specs/gql.js'
import { REPORTS } from 'src/graphql/statistics/specs/gql.js'

import { PRODUCT_1, USER_PRODUCT_1 } from 'src/test/common/payloads/products'
import { userGenerator, createOrder } from 'src/test/utils/generators'
import { createFinancialFund } from 'src/test/utils/mutations'

import {
  FinancialFundCategories,
  OrderStatus,
  DefaultPaymentMethods,
  Payments
} from 'src/utils/enums'
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

const createRegisterOperation = async (variables) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const response = await mutate(CREATE_REGISTER_OPERATION, { variables })

  return response
}

const deleteRegisterOperation = async (variables) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const response = await mutate(DELETE_REGISTER_OPERATION, { variables })

  return response
}

test.beforeEach(async (t) => {
  await setUserAndCompany()

  await FinancialStatement.deleteMany({})
  await RegisterOperation.deleteMany({})
  await FinancialFund.deleteMany({})
  await Product.deleteMany({})
  await UserProduct.deleteMany({})

  await new Product(PRODUCT_1).save()
  await new UserProduct({ ...USER_PRODUCT_1, company: company._id, createdBy: user._id }).save()

  headers = { Authorization: generateToken({ userId: user.id, companyId: company.id }) }
})

test.afterEach.always(async (t) => {
  await FinancialStatement.deleteMany({})
  await RegisterOperation.deleteMany({})
  await FinancialFund.deleteMany({})
  await Product.deleteMany({})
  await UserProduct.deleteMany({})
})

test('should create an open register operation', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const responseFund = await createFinancialFund(mutate, {
    input: {
      name: 'Caixa',
      category: FinancialFundCategories.REGISTER,
      balance: 100
    }
  })

  const variables = {
    input: {
      totalSales: 0.0,
      realTotalSales: 0.0,
      operationType: 'open',
      paymentMethods: [],
      registers: [
        {
          register: responseFund.data.createFinancialFund.id,
          name: 'Caixa',
          balance: 100,
          realBalance: 200,
          financialStatements: []
        }
      ]
    }
  }

  const response = await createRegisterOperation(variables)

  t.is(response.errors, undefined)

  const {
    data: {
      createRegisterOperation: { operationType }
    }
  } = response

  t.is(operationType, 'open')

  const registerOperations = await RegisterOperation.find({})

  t.is(registerOperations.length, 1)

  // check if changed the register balance
  const registers = await FinancialFund.find({
    company: company._id,
    category: FinancialFundCategories.REGISTER
  })

  t.is(registers.length, 1)

  const [{ balance }] = registers

  t.is(balance, 200)
})

test('should create a close register operation', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const responseRegister = await createFinancialFund(mutate, {
    input: {
      name: 'Caixa',
      category: FinancialFundCategories.REGISTER,
      balance: 100,
      shouldCreateFinancialStatement: false
    }
  })

  // create sales in diff payment methods
  await createOrder(
    {
      company: company._id,
      status: OrderStatus.CLOSED,
      shortID: '3232',
      items: [
        {
          name: 'Produto 1',
          product: PRODUCT_1._id,
          price: 10.0,
          measurement: 'unit',
          quantity: 10,
          discount: 0.0
        }
      ],
      payments: [
        {
          method: 'cash',
          value: 100.0,
          received: 100.0,
          paymentMethod: DefaultPaymentMethods[0]._id
        }
      ],
      createdAt: new Date()
    },
    company
  )

  await createOrder(
    {
      company: company._id,
      status: OrderStatus.CLOSED,
      shortID: '3232',
      items: [
        {
          name: 'Produto 1',
          product: PRODUCT_1._id,
          price: 10.0,
          measurement: 'unit',
          quantity: 10,
          discount: 0.0
        }
      ],
      payments: [
        {
          method: 'credit',
          value: 100.0,
          received: 100.0,
          paymentMethod: DefaultPaymentMethods[1]._id
        }
      ],
      createdAt: new Date()
    },
    company
  )

  await createOrder(
    {
      company: company._id,
      status: OrderStatus.CLOSED,
      shortID: '3232',
      items: [
        {
          name: 'Produto 1',
          product: PRODUCT_1._id,
          price: 10.0,
          measurement: 'unit',
          quantity: 10,
          discount: 0.0
        }
      ],
      payments: [
        {
          method: 'debt',
          value: 100.0,
          received: 100.0,
          paymentMethod: DefaultPaymentMethods[2]._id
        }
      ],
      createdAt: new Date()
    },
    company
  )

  await createOrder(
    {
      company: company._id,
      status: OrderStatus.CLOSED,
      shortID: '3232',
      items: [
        {
          name: 'Produto 1',
          product: PRODUCT_1._id,
          price: 10.0,
          measurement: 'unit',
          quantity: 10,
          discount: 0.0
        }
      ],
      payments: [
        {
          method: 'voucher',
          value: 100.0,
          received: 100.0,
          paymentMethod: DefaultPaymentMethods[3]._id
        }
      ],
      createdAt: new Date()
    },
    company
  )

  await createOrder(
    {
      company: company._id,
      status: OrderStatus.CLOSED,
      shortID: '3232',
      items: [
        {
          name: 'Produto 1',
          product: PRODUCT_1._id,
          price: 10.0,
          measurement: 'unit',
          quantity: 10,
          discount: 0.0
        }
      ],
      payments: [
        {
          method: 'pix',
          value: 100.0,
          received: 100.0,
          paymentMethod: DefaultPaymentMethods[4]._id
        }
      ],
      createdAt: new Date()
    },
    company
  )

  const variables = {
    input: {
      totalSales: 500.0,
      realTotalSales: 640.0,
      operationType: 'close',
      paymentMethods: [
        {
          method: Payments.CASH,
          total: 100,
          realTotal: 150
        },
        {
          method: Payments.CREDIT,
          total: 100,
          realTotal: 120
        },
        {
          method: Payments.DEBT,
          total: 100,
          realTotal: 160
        },
        {
          method: Payments.VOUCHER,
          total: 100,
          realTotal: 110
        },
        {
          method: Payments.PIX,
          total: 100,
          realTotal: 100
        }
      ],
      registers: [
        {
          register: responseRegister.data.createFinancialFund.id,
          name: 'Caixa',
          balance: 100,
          realBalance: 200,
          financialStatements: []
        }
      ]
    }
  }

  const response = await createRegisterOperation(variables)

  t.is(response.errors, undefined)

  const {
    data: {
      createRegisterOperation: { operationType }
    }
  } = response

  t.is(operationType, 'close')

  const registerOperations = await RegisterOperation.find({})

  t.is(registerOperations.length, 1)

  // check if changed the register balance
  const registers = await FinancialFund.find({
    company: company._id,
    category: FinancialFundCategories.REGISTER
  })

  t.is(registers.length, 1)

  const [{ balance }] = registers

  t.is(balance, 200)

  // check if totals match for payment methods and total sales
  const startDate = moment().startOf('day')
  const endDate = moment().endOf('day')

  const variablesReports = {
    input: {
      startDate,
      endDate
    }
  }
  const responseStats = await mutate(REPORTS, { variables: variablesReports })

  const {
    data: {
      reports: {
        salesReport: { data: dataSales },
        salesStatisticsReport: { totalRevenue },
        cashFlowReport: { data }
      }
    }
  } = responseStats

  t.is(totalRevenue, 640)
  t.is(data[0].values[1], 640)
  t.is(dataSales[0].values[0], 120)
  t.is(dataSales[0].values[1], 160)
  t.is(dataSales[0].values[2], 150)
  t.is(dataSales[0].values[3], 110)
  t.is(dataSales[0].values[4], 100)
})

test('should list register operations', async (t) => {
  const { query, mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const responseRegister = await createFinancialFund(mutate, {
    input: {
      name: 'Caixa',
      category: FinancialFundCategories.REGISTER,
      balance: 100,
      shouldCreateFinancialStatement: false
    }
  })

  const variables = {
    input: {
      totalSales: 500.0,
      realTotalSales: 640.0,
      operationType: 'close',
      paymentMethods: [
        {
          method: Payments.CASH,
          total: 100,
          realTotal: 150
        },
        {
          method: Payments.CREDIT,
          total: 100,
          realTotal: 120
        },
        {
          method: Payments.DEBT,
          total: 100,
          realTotal: 160
        },
        {
          method: Payments.VOUCHER,
          total: 100,
          realTotal: 110
        },
        {
          method: Payments.PIX,
          total: 100,
          realTotal: 100
        }
      ],
      registers: [
        {
          register: responseRegister.data.createFinancialFund.id,
          name: 'Caixa',
          balance: 100,
          realBalance: 200,
          financialStatements: []
        }
      ]
    }
  }

  await createRegisterOperation(variables)

  const response = await query(GET_REGISTER_OPERATION)

  const {
    data: {
      registerOperations: { registerOperations }
    }
  } = response

  t.is(registerOperations.length, 1)
})

test('should delete register operations', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const responseRegister = await createFinancialFund(mutate, {
    input: {
      name: 'Caixa',
      category: FinancialFundCategories.REGISTER,
      balance: 100,
      shouldCreateFinancialStatement: false
    }
  })

  const variables = {
    input: {
      totalSales: 500.0,
      realTotalSales: 640.0,
      operationType: 'close',
      paymentMethods: [
        {
          method: Payments.CASH,
          total: 100,
          realTotal: 150
        },
        {
          method: Payments.CREDIT,
          total: 100,
          realTotal: 120
        },
        {
          method: Payments.DEBT,
          total: 100,
          realTotal: 160
        },
        {
          method: Payments.VOUCHER,
          total: 100,
          realTotal: 110
        },
        {
          method: Payments.PIX,
          total: 100,
          realTotal: 100
        }
      ],
      registers: [
        {
          register: responseRegister.data.createFinancialFund.id,
          name: 'Caixa',
          balance: 100,
          realBalance: 200,
          financialStatements: []
        }
      ]
    }
  }

  const {
    data: {
      createRegisterOperation: { id }
    }
  } = await createRegisterOperation(variables)

  await deleteRegisterOperation({ input: { id } })

  const registerOperations = await RegisterOperation.find({})
  const financialStatements = await FinancialStatement.find({})

  t.is(registerOperations.length, 0)
  t.is(financialStatements.length, 0)
})
