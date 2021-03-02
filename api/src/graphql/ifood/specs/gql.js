export const TOGGLE_OPEN_STATUS = `
  mutation($input: ToggleOpenStatusInput!) {
    toggleOpenStatus(input: $input) {
      _id
      ifood {
        open
      }
    }
  }
`
export const GET_MY_COMPANY = `
  query {
    myCompany {
      _id
      ifood {
        open
        merchant
        username
        password
      }
    }
  }
`

export const UPDATE_IFOOD_CREDENTIALS = `
  mutation($input: UpdateIfoodCredentialsInput!) {
    updateIfoodCredentials(input: $input) {
      _id
      ifood {
        open
        merchant
        username
        password
      }
    }
  }
`

export const CONFIRM_IFOOD_ORDER = `
  mutation($input: ConfirmIfoodOrderInput!) {
    confirmIfoodOrder(input: $input) {
      _id
    }
  }
`

export const DISPATCH_IFOOD_ORDER = `
  mutation($input: DispatchIfoodOrderInput!) {
    dispatchIfoodOrder(input: $input) {
      _id
    }
  }
`

export const GET_IFOOD_PRICE_ANALYSIS = `
  query {
    ifoodPriceAnalysis {
      general {
        median
        marketMedian
      }
      alerts {
        product
        name
        percent
      }
    }
  }
`
