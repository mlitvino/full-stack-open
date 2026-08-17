import { ApolloProvider } from '@apollo/client/react';
import { StatusBar } from 'expo-status-bar';
import { NativeRouter } from 'react-router-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Main from './src/app/Main';
import createApolloClient from './src/lib/apolloClient';
import { AuthStorage, AuthStorageContext } from './src/features/auth';
import paperTheme from './src/paperTheme';

const authStorage = new AuthStorage();
const apolloClient = createApolloClient(authStorage);

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <StatusBar style="light" />
        <NativeRouter>
          <ApolloProvider client={apolloClient}>
            <AuthStorageContext.Provider value={authStorage}>
              <Main />
            </AuthStorageContext.Provider>
          </ApolloProvider>
        </NativeRouter>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
