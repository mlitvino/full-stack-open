import { useMutation } from '@apollo/client/react';

import { CREATE_REVIEW } from '../services/mutations';

const useCreateReview = () => {
  const [mutate, result] = useMutation(CREATE_REVIEW);

  const createReview = async ({ ownerName, repositoryName, rating, text }) => {
    return mutate({
      variables: {
        review: {
          ownerName,
          repositoryName,
          rating: Number(rating),
          text,
        },
      },
    });
  };

  return [createReview, result];
};

export default useCreateReview;
