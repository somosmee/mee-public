import gql from 'graphql-tag'

import { COMPANY_ATTRIBUTES } from 'src/graphql/fragments'
import { ORDER_ATTRIBUTES } from 'src/graphql/order/fragments'

import { IFOOD_CATEGORY_ATTRIBUTES, IFOOD_ITEM_ATTRIBUTES } from './fragments'

export const TOGGLE_OPEN_STATUS = gql`
  mutation($input: ToggleOpenStatusInput!) {
    toggleOpenStatus(input: $input) {
      ...companyAttributes
    }
  }
  ${COMPANY_ATTRIBUTES}
`

export const UPDATE_IFOOD_CREDENTIALS = gql`
  mutation($input: UpdateIfoodCredentialsInput!) {
    updateIfoodCredentials(input: $input) {
      ...companyAttributes
    }
  }
  ${COMPANY_ATTRIBUTES}
`

export const CONFIRM_IFOOD_ORDER = gql`
  mutation($input: ConfirmIfoodOrderInput!) {
    confirmIfoodOrder(input: $input) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const DISPATCH_IFOOD_ORDER = gql`
  mutation($input: DispatchIfoodOrderInput!) {
    dispatchIfoodOrder(input: $input) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const CANCELLATION_IFOOD_ORDER = gql`
  mutation($input: CancellationIfoodOrderInput!) {
    cancellationIfoodOrder(input: $input) {
      ...orderAttributes
    }
  }
  ${ORDER_ATTRIBUTES}
`

export const GET_IFOOD_CATEGORIES = gql`
  query {
    getIfoodCategories {
      categories {
        ...ifoodCategoryAttributes
      }
    }
  }
  ${IFOOD_CATEGORY_ATTRIBUTES}
`

export const CREATE_IFOOD_CATEGORY = gql`
  mutation($input: CreateIfoodCategoryInput!) {
    createIfoodCategory(input: $input) {
      ...ifoodCategoryAttributes
    }
  }
  ${IFOOD_CATEGORY_ATTRIBUTES}
`

export const UPDATE_IFOOD_CATEGORY = gql`
  mutation($input: UpdateIfoodCategoryInput!) {
    updateIfoodCategory(input: $input) {
      ...ifoodCategoryAttributes
    }
  }
  ${IFOOD_CATEGORY_ATTRIBUTES}
`

export const DELETE_IFOOD_CATEGORY = gql`
  mutation($input: DeleteIfoodCategoryInput!) {
    deleteIfoodCategory(input: $input) {
      ...ifoodCategoryAttributes
    }
  }
  ${IFOOD_CATEGORY_ATTRIBUTES}
`

export const ADD_IFOOD_ITEM = gql`
  mutation($input: AddIfoodItemInput!) {
    addIfoodItem(input: $input) {
      ...ifoodItemAttributes
    }
  }
  ${IFOOD_ITEM_ATTRIBUTES}
`

export const UNLINK_IFOOD_ITEM = gql`
  mutation($input: UnlinkIfoodItemInput!) {
    unlinkIfoodItem(input: $input) {
      ...ifoodItemAttributes
    }
  }
  ${IFOOD_ITEM_ATTRIBUTES}
`

export const UPDATE_IFOOD_ITEM_AVAILABILITY = gql`
  mutation($input: UpdateIfoodItemAvailabilityInput!) {
    updateIfoodItemAvailability(input: $input) {
      ...ifoodItemAttributes
    }
  }
  ${IFOOD_ITEM_ATTRIBUTES}
`

export const CREATE_IFOOD_MODOFIER = gql`
  mutation($input: CreateIfoodModifierInput!) {
    createIfoodModifier(input: $input) {
      ...ifoodItemAttributes
    }
  }
  ${IFOOD_ITEM_ATTRIBUTES}
`

export const UPDATE_IFOOD_MODOFIER = gql`
  mutation($input: UpdateIfoodModifierInput!) {
    updateIfoodModifier(input: $input) {
      ...ifoodItemAttributes
    }
  }
  ${IFOOD_ITEM_ATTRIBUTES}
`

export const DELETE_IFOOD_MODOFIER = gql`
  mutation($input: DeleteIfoodModifierInput!) {
    deleteIfoodModifier(input: $input) {
      ...ifoodItemAttributes
    }
  }
  ${IFOOD_ITEM_ATTRIBUTES}
`

export const GET_IFOOD_PRICE_ANALYSIS = gql`
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
