import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

const publicKey = fs.readFileSync(path.join(__dirname, './sample_public.key')).toString('utf8')
const privateKey = fs
  .readFileSync(path.join(__dirname, './sample_private_pkcs8.key'))
  .toString('utf8')

export const sign = (doc) => {
  const sign = crypto.createSign('RSA-SHA256')
  sign.update(doc)
  const signedDoc = sign.sign(privateKey, 'base64')
  return signedDoc
}

export const validate = (doc, signedDoc) => {
  const verify = crypto.createVerify('RSA-SHA256')
  verify.write(doc)
  verify.end()
  return verify.verify(publicKey, signedDoc, 'base64')
}
