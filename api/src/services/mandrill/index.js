import mandrill from 'mandrill-api/mandrill'

import logger from 'src/utils/logger'

let client = null
const MERGE_LANGUAGE = 'handlebars'

try {
  client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY)
} catch (e) {
  logger.error(`[mandrill] ERROR: ${e}`)
}

/**
 * Convert the provided key:value pairs and return an array that will be used for the Mandril email template.
 * e.g.
 * { subject: 'support' }
 *  will generate:
 * [{ name: 'subject', content: 'Support' }]
 * @param {*} data
 */
const buildMergeVars = (data = {}) => {
  return Object.entries(data).map((row) => {
    const [name, content] = row
    return { name, content }
  })
}

/**
 * Send an email using a Mandrill template
 * @param {String} params.to Email receipt
 * @param {String} params.name Subject displayed on Email
 * @param {String} params.template Template name/id from Mandrill
 * @param {Object} params.templateData An object containing the placeholder values for the email template
 * @param {String} params.prefix Prefix used for logger
 */
const sendTemplate = async ({
  to,
  from,
  subject,
  template,
  important,
  templateData,
  prefix = 'mandrill.sendTemplate'
}) => {
  const message = {
    subject,
    from_email: from.email,
    from_name: from.name,
    track_opens: true,
    track_clicks: true,
    important,
    to: [{ email: to, type: 'to' }],
    global_merge_vars: buildMergeVars(templateData),
    merge_language: MERGE_LANGUAGE
  }

  return new Promise((resolve, reject) => {
    client.messages.sendTemplate(
      {
        template_name: template,
        template_content: [],
        message,
        async: false
      },
      (result) => {
        resolve(result)
      },
      (e) => {
        logger.error(`[${prefix} - 1] ERROR: ${e}`)
        reject(e)
      }
    )
  })
}

export default {
  sendTemplate,
  client
}
