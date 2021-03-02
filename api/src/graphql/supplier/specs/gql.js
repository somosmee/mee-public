export const GET_SUPLIERS = `
  query($input: SuppliersInput) {
    suppliers(input: $input) {
      suppliers {
        _id
        nationalId
        displayName
        name
        url
        phone
        description
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
