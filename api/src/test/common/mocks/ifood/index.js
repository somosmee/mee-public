import sinon from 'sinon'

import axios from 'src/ifood/axios'

export const mockIfood = (numCalls = 1, method = 'post', response = {}, ...args) => {
  const mock = sinon.mock(axios)
  if (args && args.length > 0) {
    mock
      .expects(method)
      .withExactArgs(args)
      .exactly(numCalls)
      .resolves(Promise.resolve(response))
  } else {
    mock
      .expects(method)
      .exactly(numCalls)
      .resolves(Promise.resolve(response))
  }

  return mock
}

export const stubGet = () => {
  return sinon.stub(axios, 'get')
}

export const stubPost = () => {
  return sinon.stub(axios, 'post')
}

export default { mockIfood, stubGet, stubPost }
