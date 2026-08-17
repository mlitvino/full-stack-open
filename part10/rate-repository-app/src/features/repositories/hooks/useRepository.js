import { useQuery } from '@apollo/client/react';

import { GET_REPOSITORY } from '../services/queries';

const useRepository = (id) => {
  const { data, loading, error, refetch } = useQuery(GET_REPOSITORY, {
    fetchPolicy: 'cache-and-network',
    variables: { id },
    skip: !id,
  });

  return { repository: data?.repository, loading, error, refetch };
};

export default useRepository;
