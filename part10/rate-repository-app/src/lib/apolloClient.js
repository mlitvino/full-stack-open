import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { relayStylePagination } from '@apollo/client/utilities';

const httpLink = new HttpLink({
  uri: process.env.EXPO_PUBLIC_APOLLO_URI,
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        repositories: relayStylePagination([
          'orderBy',
          'orderDirection',
          'searchKeyword',
        ]),
      },
    },
  },
});

const createApolloClient = (authStorage) => {
  const authLink = new SetContextLink(async ({ headers }) => {
    try {
      const acessToken = await authStorage.getAccessToken();

      return {
        headers: {
          ...headers,
          authorization: acessToken ? `Bearer ${acessToken}` : ''
        },
      };
    } catch (e) {
      console.log(e);

      return { headers };
    }
  })

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
  });
};

export default createApolloClient;
