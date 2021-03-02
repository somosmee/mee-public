import { useState, useEffect, useCallback } from 'react'

import { useLazyQuery } from '@apollo/react-hooks'
import debounce from 'lodash.debounce'
import client from 'src/apollo'

import { SEARCH_CUSTOMERS } from 'src/graphql/customer/queries'
import { SEARCH_ORDERS } from 'src/graphql/order/queries'
import { SEARCH_PRODUCTS } from 'src/graphql/product/queries'
import { SEARCH_SUPPLIERS } from 'src/graphql/supplier/queries'

import { DEBOUNCE_MS } from 'src/utils/constants'

const QUERIES = {
  product: SEARCH_PRODUCTS,
  customer: SEARCH_CUSTOMERS,
  order: SEARCH_ORDERS,
  supplier: SEARCH_SUPPLIERS
}

const QUERY_NAMES = ['searchProducts', 'searchCustomers', 'searchOrders', 'searchSuppliers']

const useSearch = ({ entity, options }) => {
  const queries = Array.from(client.queryManager.queries)
  const searchQueries = queries.filter((item) =>
    QUERY_NAMES.includes(item[1]?.observableQuery?.queryName)
  )

  const [results, setResults] = useState([])

  const [query, { called, loading, error, data }] = useLazyQuery(QUERIES[entity], {
    fetchPolicy: 'network-only'
  })
  const queryDebounced = debounce(query, options?.wait ?? DEBOUNCE_MS)

  useEffect(() => {
    if (called && !loading && data) {
      const [root] = Object.keys(data)

      setResults(data[root])
    } else if (error) {
      setResults([])
    }
  }, [called, loading, error, data])

  const search = useCallback((text) => {
    // cancel latest query
    if (searchQueries?.length) {
      const latestQuery = searchQueries[0][1]
      if (latestQuery) {
        latestQuery.cancel()
      }
    }
    queryDebounced({ variables: { text } })
  }, [])

  return [search, { loading, data: results }]
}

export default useSearch
