import { useQuery } from '@apollo/client/react';

import { GET_REPOSITORIES } from '../services/queries';

const useRepositories = (variables) => {
  const { data, loading, error, refetch, fetchMore } = useQuery(
    GET_REPOSITORIES,
    {
      fetchPolicy: 'cache-and-network',
      variables,
    },
  );

  const handleFetchMore = () => {
    const pageInfo = data?.repositories?.pageInfo;

    if (!pageInfo?.hasNextPage) {
      return;
    }

    fetchMore({
      variables: {
        ...variables,
        after: pageInfo.endCursor,
      },
    });
  };

  return {
    repositories: data?.repositories,
    loading,
    error,
    refetch,
    fetchMore: handleFetchMore,
  };
};

export default useRepositories;
