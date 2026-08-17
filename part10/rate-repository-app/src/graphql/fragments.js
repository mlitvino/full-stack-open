import { gql } from '@apollo/client';

export const USER_DETAILS = gql`
  fragment UserBaseFields on User {
    id
    username
  }
`;

export const REVIEW_DETAILS = gql`
  fragment ReviewBaseFields on Review {
    id
    text
    rating
    createdAt
    repositoryId
    user {
      ...UserBaseFields
    }
  }

  ${USER_DETAILS}
`;

export const REPOSITORY_DETAILS = gql`
  fragment RepositoryBaseFields on Repository {
    id
    fullName
    description
    language
    forksCount
    stargazersCount
    ratingAverage
    reviewCount
    ownerAvatarUrl
    url,
    reviews {
      edges {
        node {
          ...ReviewBaseFields
        }
      }
    }
  }

  ${REVIEW_DETAILS}
`;
