export const CREATE_CUSTOMER = `
  mutation createCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      mobile
      firstName
      lastName
      email
      cpf
      birthday
    }
  }
`
