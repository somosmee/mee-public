import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.IFOOD_API,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default instance
