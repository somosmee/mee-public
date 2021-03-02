import { serial as test } from 'ava'
import sinon from 'sinon'

import { getIfoodTokens, syncEvents, runIfoodMarketPlaceAnalysis } from 'src/cronjobs/jobs'
import { ifoodAuthResponse, ifoodEventPlaced, ifoodOrderTest } from 'src/cronjobs/specs/payload'
import { createFakeUsers } from 'src/cronjobs/specs/utils'

import {
  Company,
  User,
  Order,
  Product,
  UserProduct,
  IfoodOrder,
  IfoodMarketplace
} from 'src/models'

import { ifood, ifoodMarketPlace } from 'src/test/common/mocks'
import { merchants, restaurantDetail } from 'src/test/common/payloads/ifood/marketplace'
import { productGenerator, userProductGenerator } from 'src/test/utils/generators'

test.before(async (t) => {
  await Company.deleteMany({})
  await User.deleteMany({})
  await Order.deleteMany({})
  await Product.deleteMany({})
  await IfoodOrder.deleteMany({})
  await UserProduct.deleteMany({})
  await IfoodMarketplace.deleteMany({})
})

test.afterEach(async (t) => {
  await Company.deleteMany({})
  await User.deleteMany({})
  await Order.deleteMany({})
  await Product.deleteMany({})
  await IfoodOrder.deleteMany({})
  await UserProduct.deleteMany({})
  await IfoodMarketplace.deleteMany({})
})

test('should get ifood tokens for users with open stores', async (t) => {
  const mock = ifood.mockIfood(1, 'post', ifoodAuthResponse)

  const { companyOpen, companyClosed } = await createFakeUsers()
  await getIfoodTokens()

  const refreshedUserOpen = await Company.findOne({ _id: companyOpen._id })
  const refreshedUserClosed = await Company.findOne({ _id: companyClosed._id })

  t.is(
    refreshedUserOpen.ifood.latestToken,
    `${ifoodAuthResponse.data.token_type} ${ifoodAuthResponse.data.access_token}`
  )
  t.is(refreshedUserClosed.ifood.latestToken, undefined)

  mock.verify()

  mock.restore()
})

test('should get ifood events for users with open stores', async (t) => {
  const stub = ifood.stubGet()
  stub.onCall(0).resolves(ifoodEventPlaced)
  stub.onCall(1).resolves(ifoodOrderTest)

  const stub2 = ifood.stubPost()
  stub2.onCall(0).resolves(ifoodAuthResponse)
  stub2.onCall(1).resolves({ statusCode: 200 })
  stub2.onCall(2).resolves({ statusCode: 200 })

  const { companyOpen, companyClosed } = await createFakeUsers()
  await syncEvents()

  const ifoodOrders = await IfoodOrder.find({})
  t.is(ifoodOrders.length, 1)

  const [iOrder] = ifoodOrders
  t.is(iOrder.reference, ifoodOrderTest.data.reference)

  // check mapping to open user
  const ordersOpen = await Order.find({ company: companyOpen._id })
  t.is(ordersOpen.length, 1)

  const [order] = ordersOpen
  t.is(order.ifood.reference, ifoodOrderTest.data.reference)

  const ordersClosed = await Order.find({ company: companyClosed._id })
  t.is(ordersClosed.length, 0)

  stub.restore()
  stub2.restore()
})

test.skip('Should scrap nearby merchants based on lat and lng', async (t) => {
  const stubSearch = sinon.stub(IfoodMarketplace, 'searchES')
  stubSearch.resolves({
    hits: {
      hits: [
        {
          _score: 1.89712,
          _source: {
            unitPrice: 34,
            itemDescription:
              'frango a parmegiana + ovo frito +  batata frita + 4 unidade de biz de chocolate + refrigerante lata'
          }
        },
        {
          _score: 1.3561887,
          _source: {
            unitPrice: 34,
            itemDescription:
              'file de frango grelhado + ovo frito + batata frita  + 4 unidade de biz de chocolate + refrigerante lata'
          }
        },
        {
          _score: 0.9717939,
          _source: {
            unitPrice: 34,
            itemDescription:
              'strogonoff de frango + ovo frito +  batata frita + 4 unidade de biz de chocolate + refrigerante lata'
          }
        }
      ]
    }
  })

  const { userOpen, companyOpen } = await createFakeUsers()

  const totalItems = 1
  const products = await Product.insertMany(productGenerator(totalItems, ['parmegiana de frango']))

  const userProducts = userProductGenerator(
    userOpen._id.toString(),
    companyOpen._id.toString(),
    products
  )
  await UserProduct.insertMany(userProducts)

  const stub = ifoodMarketPlace.stubGet()
  stub.onCall(0).resolves({
    statusCode: 200,
    data: { merchants }
  })
  stub.onCall(1).resolves({
    statusCode: 200,
    data: restaurantDetail.detail
  })
  stub.onCall(2).resolves({
    statusCode: 200,
    data: restaurantDetail.menu
  })
  stub.onCall(3).resolves({
    statusCode: 200,
    data: restaurantDetail.extra
  })

  await runIfoodMarketPlaceAnalysis(companyOpen)

  // check if we saved the transformed data on ifoodMarketplace collection for reprocessing
  const transformedData = await IfoodMarketplace.find({ user: companyOpen._id })

  t.not(transformedData, null)
  // check if we erased the data :)
  t.is(transformedData.length, 0)

  // check if new stats where saved on userProduct
  const ups = await UserProduct.find({ company: companyOpen._id })
  const [firstUP] = ups

  t.not(ups, null)
  t.not(firstUP.ifood, undefined)
  t.is(firstUP.ifood.q0, 34)
  t.is(firstUP.ifood.q1, 34)
  t.is(firstUP.ifood.q2, 34)
  t.is(firstUP.ifood.q3, 34)
  t.is(firstUP.ifood.q4, 34)

  stub.restore()
  stubSearch.restore()
})
