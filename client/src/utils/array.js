export const groupBy = (array, key) => {
  return array?.reduce((groups, current) => {
    if (!groups[current[key]]) groups[current[key]] = []

    groups[current[key]].push(current)

    return groups
  }, {})
}
