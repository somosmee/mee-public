export const load = (key) => {
  const serialized = localStorage.getItem(key)
  return JSON.parse(serialized)
}

export const save = (key, state) => {
  const serialized = JSON.stringify(state)
  localStorage.setItem(key, serialized)
}
