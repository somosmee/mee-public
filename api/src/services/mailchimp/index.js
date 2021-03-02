import client from '@mailchimp/mailchimp_marketing'

import logger from 'src/utils/logger'

client.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER
})

const addContact = async (user) => {
  try {
    const response = await client.lists.batchListMembers(process.env.MAILCHIMP_LIST_ID, {
      members: [{ email_address: user.email }],
      update_existing: true
    })

    logger.debug(`[mailchimp.addContact] RESPONSE ${JSON.stringify(response)}`)
  } catch (e) {
    logger.error(`[mailchimp.addContact] ERROR: ${e}`)
  }
}

export default { addContact }
