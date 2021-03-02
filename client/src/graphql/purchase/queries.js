import { graphql } from 'react-apollo'

import { getSearch } from 'src/utils/url'

import {
  GET_PURCHASE,
  GET_PURCHASES,
  ADD_PURCHASE,
  CREATE_PURCHASE_ITEM,
  UPDATE_PURCHASE_ITEM,
  IMPORT_PURCHASE_ITEMS
} from './gqls'

export const getPurchase = graphql(GET_PURCHASE, {
  name: 'getPurchase',
  options: (props) => {
    const { purchaseId } = props
    const variables = { id: purchaseId }

    return {
      variables
    }
  }
})

export const getPurchases = graphql(GET_PURCHASES, {
  name: 'getPurchases',
  options: (props) => {
    const { page, offset } = getSearch(props.location)
    const skip = page * offset || 0
    const variables = { input: { pagination: { first: offset, skip } } }

    return {
      variables
    }
  }
})

export const addPurchase = graphql(ADD_PURCHASE, {
  name: 'addPurchase',
  options: (props) => {
    const { page, offset } = getSearch(props.location)
    const skip = page * offset || 0
    const variables = { input: { pagination: { first: offset, skip } } }

    return {
      refetchQueries: [
        {
          query: GET_PURCHASES,
          variables
        }
      ],
      awaitRefetchQueries: true
    }
  }
})

export const createPurchaseItem = graphql(CREATE_PURCHASE_ITEM, {
  name: 'createPurchaseItem'
})

export const updatePurchaseItem = graphql(UPDATE_PURCHASE_ITEM, {
  name: 'updatePurchaseItem'
})

export const importPurchaseItems = graphql(IMPORT_PURCHASE_ITEMS, {
  name: 'importPurchaseItems'
})
