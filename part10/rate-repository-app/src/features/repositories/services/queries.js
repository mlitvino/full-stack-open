import { gql } from '@apollo/client';

import { REPOSITORY_DETAILS } from '../../../graphql/fragments';

export const GET_REPOSITORIES = gql`
  query Repositories(
    $orderBy: AllRepositoriesOrderBy
    $orderDirection: OrderDirection
    $searchKeyword: String
    $first: Int
    $after: String
  ) {
    repositories(
      orderBy: $orderBy
      orderDirection: $orderDirection
      searchKeyword: $searchKeyword
      first: $first
      after: $after
    ) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
        startCursor
      }
      edges {
        cursor
        node {
          ...RepositoryBaseFields
        }
      }
    }
  }

  ${REPOSITORY_DETAILS}
`;

export const GET_REPOSITORY = gql`
  query Repository($id: ID!) {
    repository(id: $id) {
      ...RepositoryBaseFields
    }
  }

  ${REPOSITORY_DETAILS}
`;
