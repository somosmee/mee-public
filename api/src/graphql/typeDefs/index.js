import { gql } from 'apollo-server-express'
import fs from 'fs'
import path from 'path'

const fileNames = fs.readdirSync(__dirname).filter((fileName) => {
  const extension = fileName.split('.').pop()
  return extension === 'graphql'
})

const typeDefs = fileNames.map((fileName) =>
  gql(fs.readFileSync(path.join(__dirname, fileName), 'utf8'))
)

export default typeDefs
