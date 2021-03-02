const id = 'beacon-container'

const showBeacon = () => {
  const el = document.getElementById(id)

  if (el) {
    el.style.display = 'block'
  }
}

const hideBeacon = () => {
  const el = document.getElementById(id)

  if (el) {
    el.style.display = 'none'
  }
}

export default { showBeacon, hideBeacon }
