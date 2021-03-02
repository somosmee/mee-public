import { Storage } from '@google-cloud/storage'
import AdmZip from 'adm-zip'
import path from 'path'
import sharp from 'sharp'
import { v4 as uuid } from 'uuid'

import { IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT } from 'src/utils/constants'
import logger from 'src/utils/logger'

const storage = new Storage({ keyFilename: path.join(__dirname, 'mee-66d104805202.json') })

const allowedExtensions = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'application/x-pkcs12': 'pfx'
}

const imageExtensions = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg'
}

const upload = async ({ bucketName, file, optimize = false, isPublic = false }) => {
  const bucket = storage.bucket(bucketName)

  const { mimetype, createReadStream } = file

  if (!Object.keys(allowedExtensions).includes(mimetype)) {
    throw new Error('Formato de arquivo inválido')
  }

  if (!createReadStream) return

  const fileName = `${uuid()}.${allowedExtensions[mimetype]}`
  const bucketFile = bucket.file(fileName)

  return new Promise((resolve, reject) => {
    if (optimize && Object.keys(imageExtensions).includes(mimetype)) {
      const transformer = sharp().resize(IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT)

      createReadStream()
        .pipe(transformer)
        .pipe(bucketFile.createWriteStream({ resumable: false }))
        .on('error', (error) => {
          logger.error('[upload] save', error)
          reject(error)
        })
        .on('finish', () => {
          if (isPublic) {
            bucketFile.makePublic((error, response) => {
              if (!error) {
                const url = `${process.env.GOOGLE_STORAGE_URL}/${bucket.name}/${fileName}`
                return resolve(url)
              } else {
                logger.error('[upload] upload makePublic', error)
                return reject(error)
              }
            })
          } else {
            return resolve(fileName)
          }
        })
    } else {
      createReadStream()
        .pipe(bucketFile.createWriteStream({ resumable: false }))
        .on('error', (error) => {
          logger.error('[upload] save', error)
          reject(error)
        })
        .on('finish', () => {
          if (isPublic) {
            bucketFile.makePublic((error, response) => {
              if (!error) {
                const url = `${process.env.GOOGLE_STORAGE_URL}/${bucket.name}/${fileName}`
                return resolve(url)
              } else {
                logger.error('[upload] upload makePublic', error)
                return reject(error)
              }
            })
          } else {
            return resolve(fileName)
          }
        })
    }
  })
}

const uploadZip = async ({ bucketName, files, zipFileName }) => {
  const bucket = storage.bucket(bucketName)

  // create archive
  var zip = new AdmZip()

  for (const file of files) {
    // add in-memory file
    zip.addFile(file.fileName, Buffer.alloc(file.content.length, file.content), file.content)
  }

  // get in-memory zip
  var zipFile = zip.toBuffer()

  const stream = require('stream')
  const dataStream = new stream.PassThrough()
  const gcFile = bucket.file(zipFileName)

  dataStream.push(zipFile)
  dataStream.push(null)

  await new Promise((resolve, reject) => {
    dataStream
      .pipe(
        gcFile.createWriteStream({
          resumable: false,
          validation: false,
          metadata: { 'Cache-Control': 'public, max-age=31536000' }
        })
      )
      .on('error', (error) => {
        reject(error)
      })
      .on('finish', () => {
        gcFile.makePublic((error, response) => {
          if (!error) {
            const url = `${process.env.GOOGLE_STORAGE_URL}/${bucket.name}/${zipFileName}`
            return resolve(url)
          } else {
            logger.error('[upload] upload makePublic', error)
            return reject(error)
          }
        })
        resolve(true)
      })
  })

  return `${process.env.GOOGLE_STORAGE_URL}/${bucket.name}/${zipFileName}`
}

const remove = async ({ bucketName, name, isPublic = false }) => {
  const bucket = storage.bucket(bucketName)

  let fileName = name

  if (isPublic) {
    const [, second] = name.split(`${process.env.GOOGLE_STORAGE_URL}/${bucket.name}/`)
    fileName = second
  }

  const bucketFile = bucket.file(fileName)

  try {
    await bucketFile.delete()
  } catch (error) {
    logger.error('[remove] delete', error)
  }
}

export default {
  upload,
  uploadZip,
  remove
}
