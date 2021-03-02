import { useCallback } from 'react'

import { useMutation } from '@apollo/react-hooks'

import { UPDATE_SEARCH } from 'src/graphql/search/queries'

const useGlobalSearch = () => {
  const [updateSearchMutate, updateSearchResult] = useMutation(UPDATE_SEARCH)

  const updateSearch = useCallback((text) => {
    updateSearchMutate({ variables: { input: { text } } })
  }, [])

  return [updateSearch, updateSearchResult]
}

export default useGlobalSearch
