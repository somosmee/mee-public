import fs from 'fs'
import mustache from 'mustache'
import nodemailer from 'nodemailer'

import logger from 'src/utils/logger'

const transporter = nodemailer.createTransport(
  {
    service: 'gmail',
    auth: {
      user: 'oi@somosmee.com',
      pass: 'azzaropourhome2'
    }
  },
  {
    from: {
      name: 'Mee',
      address: 'guilherme.kodama@somosmee.com'
    }
  }
)

const send = async (data, templateName) => {
  const template = fs.readFileSync(__dirname.concat(`/templates/${templateName}`), 'utf8')
  data.html = mustache.render(template, data.htmlData)
  const info = await transporter.sendMail(data)

  logger.debug(`[mail.send] Email sent! ${info}`)
}

export default {
  send
}
