import { Company } from 'src/models'

export const getNextCompanyNumber = async () => {
  const options = { sort: { number: -1 }, limit: 1 }
  const [lastUser] = await Company.find(null, null, options)

  const lastCompanyNumber = lastUser ? lastUser.number + 1 : 1
  return lastCompanyNumber
}
