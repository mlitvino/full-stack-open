import { gql } from '@apollo/client';

import { REPOSITORY_DETAILS, USER_DETAILS } from './fragments';

export const GET_REPOSITORIES = gql`
  query Repositories {
    repositories {
      edges {
        node {
          ...RepositoryBaseFields
        }
      }
    }
  }

  ${REPOSITORY_DETAILS}
`;

export const GET_ME = gql`
  query Me {
    me {
      ...UserBaseFields
    }
  }

  ${USER_DETAILS}
`;
