export const getSearch = ({ search }) => {
  const params = new URLSearchParams(search)
  const keys = [...params.keys()]
  const result = {}

  keys.forEach((param) => {
    const value = params.get(param)

    if (!isNaN(value)) {
      if (parseInt(value) === value) {
        result[param] = parseInt(value, 10)
      } else {
        result[param] = parseFloat(value)
      }
    } else {
      result[param] = value
    }
  })

  return result
}

export const updateSearch = ({ search }, params) => {
  const paramsSearch = new URLSearchParams(search)

  Object.keys(params).forEach((param) => {
    paramsSearch.set(param, params[param])
  })

  return paramsSearch.toString()
}
