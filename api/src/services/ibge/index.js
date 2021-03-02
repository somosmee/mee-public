import axios from 'src/services/ibge/axios'

const getCitiesFromUF = async (uf) => {
  const response = await axios.get(`/v1/localidades/estados/${uf.toLowerCase()}/municipios`)

  return response.data
}

export default { getCitiesFromUF }
