export const GET_CUSTOMERS = `
  query($input: CustomersInput) {
    customers(input: $input) {
      customers {
        _id
        email
        nationalId
        firstName
        lastName
        birthday
        mobile
        receiveOffers
        addresses {
          _id
          street
          number
          complement
          district
          city
          state
          postalCode
        }
        business {
          nationalId
          name
        }
        deletedAt
        createdAt
        updatedAt
      }
      pagination {
        page
        offset
        totalPages
        totalItems
      }
    }
  }
`
