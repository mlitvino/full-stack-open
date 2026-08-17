import { useMutation } from '@apollo/client/react';

import { DELETE_REVIEW } from '../services/mutations';

const useDeleteReview = () => {
  const [mutate, result] = useMutation(DELETE_REVIEW);

  const deleteReview = async (id) => {
    return mutate({ variables: { id } });
  };

  return [deleteReview, result];
};

export default useDeleteReview;
