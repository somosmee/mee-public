import { User } from 'src/models'

import { CONFIRM_IFOOD_ORDER, DISPATCH_IFOOD_ORDER } from 'src/graphql/ifood/specs/gql'

import { userGenerator, orderGenerator } from 'src/test/utils/generators'

import { COMISSION_FEE_PERCENT } from 'src/utils/constants'
import { Roles } from 'src/utils/enums'
import { getNextCompanyNumber } from 'src/utils/user'

export const createBillableUsers = async () => {
  const lastCompanyNumber = await getNextCompanyNumber()

  const userBillable = new User({
    email: 'test1@gmail.com',
    name: 'Test1',
    role: Roles.EMPLOYER,
    companyNumber: lastCompanyNumber + 1,
    stripeCustomerId: 'cus_HLM9k70vQaChvw',
    card: {
      id: 'pm_1GmfbOCRDziohXRw5teduzw6'
    },
    ifood: {
      open: true,
      username: 'POS-65415645',
      password: 'POS-65415645'
    }
  })

  await userBillable.save()

  const orders = orderGenerator(userBillable._id, 3, 'closed')

  userBillable.billableItems = [
    {
      fee: COMISSION_FEE_PERCENT,
      order: orders[0]._id,
      totalOrder: 30,
      totalFee: 0.3
    },
    {
      fee: COMISSION_FEE_PERCENT,
      order: orders[1]._id,
      totalOrder: 250,
      totalFee: 2.5
    },
    {
      fee: COMISSION_FEE_PERCENT,
      order: orders[2]._id,
      totalOrder: 100,
      totalFee: 1
    }
  ]

  await userBillable.save()

  const userClosed = new User({
    email: 'test2@gmail.com',
    name: 'Test1',
    role: Roles.EMPLOYER,
    companyNumber: lastCompanyNumber + 2,
    ifood: {
      open: false,
      username: 'usertest2',
      password: 'password2'
    }
  })

  await userClosed.save()

  return { userBillable, userClosed }
}

export const createFakeUsers = async () => {
  const { user: userOpen, company: companyOpen } = await userGenerator({
    address: {
      street: 'Rua Benedito Caim',
      number: '92',
      complement: 'Apto 1',
      district: 'Vila Mariana',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '04121-070',
      lat: -23.598533,
      lng: -46.6243687
    },
    ifood: {
      open: true,
      username: 'POS-65415645',
      password: 'POS-65415645'
    }
  })

  const { user: userClosed, company: companyClosed } = await userGenerator({
    address: {
      street: 'Rua Benedito Caim',
      number: '92',
      complement: 'Apto 1',
      district: 'Vila Mariana',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '04121-070',
      lat: -23.598533,
      lng: -46.6243687
    },
    ifood: {
      open: false,
      username: 'usertest2',
      password: 'password2'
    }
  })

  return { userOpen, companyOpen, userClosed, companyClosed }
}

export const confirmOrder = async (mutate, id) => {
  const variables = { input: { id: id.toString() } }
  const response = await mutate(CONFIRM_IFOOD_ORDER, { variables })
  return response
}

export const dispatchOrder = async (mutate, id) => {
  const variables = { input: { id: id.toString() } }
  const response = await mutate(DISPATCH_IFOOD_ORDER, { variables })
  return response
}
