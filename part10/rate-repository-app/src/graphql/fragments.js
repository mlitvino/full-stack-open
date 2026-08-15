import { gql } from '@apollo/client';

export const USER_DETAILS = gql`
  fragment UserBaseFields on User {
    id
    username
  }
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
  }
`;
