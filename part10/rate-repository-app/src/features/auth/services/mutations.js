import { gql } from '@apollo/client';

import { USER_DETAILS } from '../../../graphql/fragments';

export const AUTHENTICATE = gql`
  mutation Authenticate($credentials: AuthenticateInput) {
    authenticate(credentials: $credentials) {
      accessToken
      expiresAt
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($user: CreateUserInput) {
    createUser(user: $user) {
      ...UserBaseFields
    }
  }

  ${USER_DETAILS}
`;
