import {
  MAX_PAGINATION_LIMIT,
  PAGINATION_FIRST_DEFAULT,
  PAGINATION_SKIP_DEFAULT,
  PAGINATION_COUNT_DEFAULT
} from 'src/utils/constants'

const PAGINATION_DEFAULT = {
  first: PAGINATION_FIRST_DEFAULT,
  skip: PAGINATION_SKIP_DEFAULT,
  count: PAGINATION_COUNT_DEFAULT
}

export const createPaginationPayload = ({ first, skip, count }) => {
  const pages =
    first === 0 ? 1 : count % first > 0 ? parseInt(count / first) + 1 : parseInt(count / first)

  return {
    page: skip % first > 0 ? parseInt(skip / first) + 1 : parseInt(skip / first) || 0,
    offset: first,
    totalPages: first === 0 ? 1 : parseInt(count / skip) < 1 ? 1 : pages || 0,
    totalItems: count
  }
}

export const enforcePaginationParams = (pagination) => {
  if (!pagination) pagination = PAGINATION_DEFAULT

  if (pagination.first === undefined || pagination.first === null) {
    pagination.first = PAGINATION_FIRST_DEFAULT
  }

  if (pagination.skip === undefined || pagination.skip === null) {
    pagination.skip = PAGINATION_SKIP_DEFAULT
  }

  if (pagination.first > MAX_PAGINATION_LIMIT) pagination.first = MAX_PAGINATION_LIMIT

  return { first: pagination.first, skip: pagination.skip }
}
