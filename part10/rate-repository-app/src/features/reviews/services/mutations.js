import { gql } from '@apollo/client';

import { REVIEW_DETAILS } from '../../../graphql/fragments';

export const CREATE_REVIEW = gql`
  mutation CreateReview($review: CreateReviewInput) {
    createReview(review: $review) {
      ...ReviewBaseFields
    }
  }

  ${REVIEW_DETAILS}
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id)
  }
`;
