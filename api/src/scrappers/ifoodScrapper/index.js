import axios from 'src/scrappers/ifoodScrapper/axios'

import logger from 'src/utils/logger'
import { normalizeText } from 'src/utils/preprocess'
import timer from 'src/utils/timer'

const flattenMenuData = (merchant) => {
  const data = []

  const merchantData = {
    merchantId: merchant.id,
    name: merchant.name,
    type: merchant?.extra?.type,
    shifts: merchant?.extra?.shifts,
    userRating: merchant.userRating,
    address: merchant?.extra?.address,
    priceRange: merchant?.extra?.priceRange,
    description: merchant?.extra?.description,
    userRatingCount: merchant?.extra?.userRatingCount,
    category: merchant?.extra?.mainCategory?.friendlyName
  }

  for (const menu of merchant.menu) {
    if (menu.availability === 'AVAILABLE') {
      for (const item of menu.itens) {
        if (item.description) {
          data.push({
            ...merchantData,
            itemId: item.id,
            order: item.order,
            itemDetails: item.details,
            unitPrice: item.unitPrice,
            itemDescription: item.description,
            unitMinPrice: item.unitMinPrice,
            taxonomyName: item.taxonomyName,
            taxonomyScore: item.taxonomyScore
          })
        }
      }
    }
  }

  return data
}

const saveMerchantsNearby = async (lat, lng, company, model, options) => {
  let page = 0
  const size = 50
  let data = []

  while (true) {
    console.time('get-ifood-marketplace-data')
    const merchants = await getMerchantsPaginated(page, size, lat, lng)
    await timer.sleep(1000)

    if (!merchants) break

    if (merchants && merchants.length === 0) {
      logger.debug('[saveMerchantsNearby] STOPPING SCRIPT')
      break
    }

    for (const merchant of merchants) {
      const { id } = merchant

      let restaurantDetails
      try {
        restaurantDetails = await getRestaurant(id)
      } catch (e) {
        continue
      }

      // we should set a type here to compare with equal but for now let's desconsider
      if (restaurantDetails?.extra?.type === 'MARKET') continue

      const flattenData = flattenMenuData({
        ...merchant,
        ...restaurantDetails
      })

      const [first] = flattenData

      if (first) {
        logger.debug(
          `[saveMerchantsNearby] restaurant: ${first.merchantId} ${first.name} ${first.category} ${first.type} ${first.userRatingCount}`
        )
      }

      data = data.concat(flattenData)

      if (model) {
        // let's save this in case we want to reprocess with a better Entity Linking step
        model.insertMany(
          data.map((item) => ({
            ...item,
            user: company._id,
            itemDescription: normalizeText(item.itemDescription)
          }))
        )

        data = []
      }
    }

    console.timeEnd('get-ifood-marketplace-data')
    page += 1
    // let's not go too deep
    if (page > 10) {
      break
    }
  }

  model.synchronize()

  return data
}

const getMerchantsPaginated = async (page, size, lat, lng) => {
  const res = await axios.get('/v2/merchants', {
    params: {
      page,
      size,
      latitude: lat || -23.598533,
      longitude: lng || -46.6243687,
      zip_code: 'undefined',
      channel: 'IFOOD',
      features: 'DELIVERY',
      sort: '',
      categories: '',
      payment_types: '',
      delivery_fee_from: 0,
      delivery_fee_to: 25,
      delivery_time_from: 0,
      delivery_time_to: 240
    }
  })

  return res?.data?.merchants
}

const getRestaurant = async (restaurantUUID) => {
  const resDetails = await axios.get(`/v2/merchants/${restaurantUUID}`, {
    params: {
      latitude: -23.598533,
      longitude: -46.6243687,
      channel: 'IFOOD'
    }
  })

  const resMenu = await axios.get(`/v1/merchants/${restaurantUUID}/menu`)

  const resExtra = await axios.get(`/v1/merchants/${restaurantUUID}/extra`)

  return {
    details: resDetails.data,
    menu: resMenu.data,
    extra: resExtra.data
  }
}

export default {
  getRestaurant,
  flattenMenuData,
  saveMerchantsNearby,
  getMerchantsPaginated
}
