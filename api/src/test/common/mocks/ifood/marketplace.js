import sinon from 'sinon'

import ifoodScrapper from 'src/scrappers/ifoodScrapper'
import axios from 'src/scrappers/ifoodScrapper/axios'

const stubGet = () => {
  return sinon.stub(axios, 'get')
}

const getSpy = () => {
  return sinon.spy(ifoodScrapper)
}

export default { stubGet, getSpy }
