export const convertUTCOffsetToString = (utcOffset) => {
  if (!utcOffset) return null

  const offset = parseInt(utcOffset)

  const hours = offset / 60

  if (Math.abs(hours) < 10) {
    if (hours < 0) {
      return `-0${hours}`
    } else {
      return `+0${hours}`
    }
  } else {
    if (hours < 0) {
      return `-${hours}`
    } else {
      return `+${hours}`
    }
  }
}
