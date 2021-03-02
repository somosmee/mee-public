import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.LOGGI_API,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default instance
