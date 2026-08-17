import { useQuery } from '@apollo/client/react';

import { GET_ME } from '../services/queries';

const useMe = (variables) => {
  const { data, loading, error, refetch } = useQuery(GET_ME, {
    fetchPolicy: 'cache-and-network',
    variables,
  });

  return { me: data?.me, loading, error, refetch };
};

export default useMe;
