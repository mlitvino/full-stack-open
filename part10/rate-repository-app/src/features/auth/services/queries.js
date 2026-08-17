import { gql } from '@apollo/client';

import { USER_DETAILS, REVIEW_DETAILS } from '../../../graphql/fragments';

export const GET_ME = gql`
  query Me($includeReviews: Boolean = false) {
    me {
      ...UserBaseFields
      reviews @include(if: $includeReviews) {
        edges {
          node {
            ...ReviewBaseFields
            repository {
              id
              fullName
            }
          }
        }
      }
    }
  }

  ${USER_DETAILS}
  ${REVIEW_DETAILS}
`;
