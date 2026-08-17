import { useMutation } from '@apollo/client/react';

import { CREATE_USER } from '../services/mutations';

const useSignUp = () => {
  const [mutate, result] = useMutation(CREATE_USER);

  const signUp = async ({ username, password }) => {
    return mutate({ variables: { user: { username, password } } });
  };

  return [signUp, result];
};

export default useSignUp;
