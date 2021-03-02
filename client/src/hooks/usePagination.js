import { useCallback } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

import { PAGINATION_PAGE_DEFAULT, PAGINATION_OFFSET_DEFAULT } from 'src/utils/constants'
import { updateSearch, getSearch } from 'src/utils/url'

const usePagination = ({
  page = PAGINATION_PAGE_DEFAULT,
  offset = PAGINATION_OFFSET_DEFAULT
} = {}) => {
  const location = useLocation()
  const history = useHistory()

  const search = getSearch(location)

  const setPagination = useCallback(
    (pagination) => {
      const searchUpdated = updateSearch(location, {
        page: pagination.page ?? search.page ?? page,
        offset: pagination.offset ?? search.offset ?? offset
      })

      history.push(`?${searchUpdated}`)
    },
    [location, history, search, page, offset]
  )

  return [{ page: search.page ?? page, offset: search.offset ?? offset }, setPagination]
}

export default usePagination
