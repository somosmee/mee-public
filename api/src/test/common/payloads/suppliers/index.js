import { USER } from 'src/test/common/payloads/users'

export const GET_SUPPLIERS_INPUT = {
  pagination: {
    first: 51,
    skip: 0
  }
}

export const SUPPLIER = {
  grocery: USER._id,
  displayName: 'Mee',
  name: 'MEE TECNOLOGIA DA INFORMACAO LTDA',
  nationalId: '35.725.558/0001-19'
}
