import { useQuery, useMutation } from '@apollo/react-hooks'

import { GET_APP, UPDATE_APP } from 'src/graphql/app/queries'

const useApp = () => {
  const { loading, error, data } = useQuery(GET_APP)
  const [updateAppMutate, updateAppResult] = useMutation(UPDATE_APP)

  const updateApp = async (input) => {
    await updateAppMutate({ variables: { input } })
  }

  return { loading, error, app: data.app, updateApp: [updateApp, updateAppResult] }
}

export default useApp
