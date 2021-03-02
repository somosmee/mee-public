import { useState, useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks'
import get from 'lodash.get'

import { GET_SEARCH } from 'src/graphql/search/queries'

const useLocalSearch = ({ options }) => {
  const { data } = useQuery(GET_SEARCH)
  const [items, setItems] = useState([])
  const [results, setResults] = useState([])

  useEffect(() => {
    const search = () => {
      const result = items.filter((item) => {
        let filter = false

        options.keys.forEach((key) => {
          const value = get(item, key, '')

          const tokens = data.search.text
            .toLowerCase()
            .trim()
            .split(' ')
          tokens.forEach((token) => {
            if (value?.toLowerCase().includes(token)) return (filter = true)
          })
        })

        return filter
      })

      setResults(result)
    }

    if (data.search.text !== null && data.search.text !== undefined) {
      search()
    }
  }, [data.search.text, items])

  return [setItems, results]
}

export default useLocalSearch
