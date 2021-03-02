import axios from 'src/services/analytics/axios'

import logger from 'src/utils/logger'

const sendReports = async (order) => {
  let response

  try {
    response = await axios.post('/reports')
  } catch (e) {
    logger.error(`[analytics.sendReports] ERROR ${JSON.stringify(e?.response?.data)}`)
  }

  return response?.data
}

const reclassifyUsers = async (order) => {
  let response

  try {
    response = await axios.post('/reclassify')
  } catch (e) {
    logger.error(`[analytics.sendReports] ERROR ${JSON.stringify(e?.response?.data)}`)
  }

  return response?.data
}

const recalculateAssociationRules = async (company) => {
  let response

  console.log('company:', company)

  try {
    response = await axios.post('/associative_analysis', { companyId: company._id })
  } catch (e) {
    logger.error(
      `[analytics.recalculateAssociationRules] ERROR ${JSON.stringify(e?.response?.data)}`
    )
  }

  return response?.data
}

export default { sendReports, reclassifyUsers, recalculateAssociationRules }
