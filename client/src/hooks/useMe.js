import { useQuery } from '@apollo/react-hooks'

import { GET_ME } from 'src/graphql/user/queries'

const useMe = () => {
  const { loading, error, data } = useQuery(GET_ME)

  return { loading, error, me: data?.me }
}

export default useMe
