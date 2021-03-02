import { createTestClient } from 'apollo-server-integration-testing'
import { serial as test } from 'ava'

import { apolloServer } from 'src/apolloServer'

import { User, Product, UserProduct } from 'src/models'

import { GET_IFOOD_PRICE_ANALYSIS } from 'src/graphql/ifood/specs/gql'

import { userProductGenerator, productGenerator, userGenerator } from 'src/test/utils/generators'

import { generateToken } from 'src/utils/token'

let headers = null
let user = null
let company = null

const setUserAndCompany = async () => {
  const { user: newUser, company: newCompany } = await userGenerator()
  user = newUser
  company = newCompany
}

test.beforeEach(async (t) => {
  await User.deleteMany({})
  await Product.deleteMany({})
  await UserProduct.deleteMany({})

  await setUserAndCompany()
  headers = { Authorization: generateToken({ userId: user._id, companyId: company._id }) }
})

test.afterEach(async (t) => {
  await User.deleteMany({})
  await Product.deleteMany({})
  await UserProduct.deleteMany({})
})

test('Should return null if no data from price analysis is found', async (t) => {
  const { mutate } = createTestClient({ apolloServer, extendMockRequest: { headers } })

  const response = await mutate(GET_IFOOD_PRICE_ANALYSIS)

  t.is(response.data.ifoodPriceAnalysis, null)
})

test('Should get overall stats from ifood price analysis', async (t) => {
  // generate fake data from analysis
  const totalItems = 3
  const products = await Product.insertMany(productGenerator(totalItems))

  const userProducts = userProductGenerator(user._id.toString(), company._id.toString(), products)
  const ups = await UserProduct.insertMany(userProducts)

  for (const up of ups) {
    up.price = 10
    up.ifood = {
      q0: 6,
      q1: 7.5,
      q2: 8,
      q3: 9,
      q4: 12
    }

    await up.save()
  }

  const { mutate } = createTestClient({
    apolloServer,
    extendMockRequest: { headers }
  })

  const response = await mutate(GET_IFOOD_PRICE_ANALYSIS)

  t.is(response.errors, undefined)
  t.deepEqual(response.data.ifoodPriceAnalysis.general, { median: 10, marketMedian: 8 })
})

// that behaviour is disabled for now
test.skip('Should get alerts from ifood price analysis', async (t) => {
  // generate fake data from analysis
  const totalItems = 3
  const products = await Product.insertMany(productGenerator(user._id.toString(), totalItems))

  const userProducts = userProductGenerator(user._id.toString(), products)
  const ups = await UserProduct.insertMany(userProducts)

  ups.forEach((item, index) => {
    if (index === 0) {
      // below median
      item.price = 5
      item.ifood = {
        q0: 6,
        q1: 7.5,
        q2: 8,
        q3: 9,
        q4: 12
      }
    } else if (index === 1) {
      // below median
      item.price = 15
      item.ifood = {
        q0: 6,
        q1: 7.5,
        q2: 8,
        q3: 9,
        q4: 12
      }
    } else {
      item.price = 8.5
      item.ifood = {
        q0: 6,
        q1: 7.5,
        q2: 8,
        q3: 9,
        q4: 12
      }
    }

    item.save()
  })

  const { mutate } = createTestClient({
    apolloServer,
    extendMockRequest: { headers }
  })

  const response = await mutate(GET_IFOOD_PRICE_ANALYSIS)

  t.is(response.errors, undefined)
  const [first, second] = response.data.ifoodPriceAnalysis.alerts

  t.deepEqual(first, {
    product: ups[0].product.toString(),
    name: ups[0].name,
    percent: -0.3333333333333333
  })
  t.deepEqual(second, {
    product: ups[1].product.toString(),
    name: ups[1].name,
    percent: 0.6666666666666666
  })
})
