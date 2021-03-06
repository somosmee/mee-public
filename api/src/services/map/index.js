import axios from 'axios'

export const stringifyAddress = (address) => {
  return `${address.street}, ${address.number} - ${address.district}, ${address.city} - ${address.state}, ${address.postalCode}, Brasil`
}

export const geocodeAddress = async (address) => {
  const locationQuery = stringifyAddress(address)

  const uri = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    locationQuery
  )}&key=AIzaSyDrpdmTAct0wy9t4pevLSncM2sFyG7wIsI`

  const res = await axios.get(uri)

  const [result] = res.data?.results

  if (result?.geometry) {
    return result?.geometry?.location
  }

  return null
}

const calculateDistance = (address1, address2) => {
  const distance = getDistanceFromLatLonInKm(address1.lat, address1.lng, address2.lat, address2.lng)
  return distance
}

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  var R = 6371 // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1) // deg2rad below
  var dLon = deg2rad(lon2 - lon1)
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c // Distance in km
  return d
}

const deg2rad = (deg) => {
  return deg * (Math.PI / 180)
}

export default {
  geocodeAddress,
  stringifyAddress,
  calculateDistance
}
