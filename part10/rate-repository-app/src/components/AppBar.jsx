import { View, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';

import AppBarTab from './AppBarTab';
import theme from '../theme';
import { useNavigate } from 'react-router-native';
import useMe from '../hooks/useMe'
import { useApolloClient } from '@apollo/client/react';
import useAuthStorage from '../hooks/useAuthStorage';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBarBackground,
    paddingBottom: 15,
    paddingHorizontal: 10,
  },
});

const AppBar = () => {
  const navigate = useNavigate();
  const apolloClient = useApolloClient()
  const authStorage = useAuthStorage()
  const { me } = useMe()

  const signOut = async () => {
    await authStorage.removeAccessToken()
    await apolloClient.resetStore()
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <AppBarTab onPress={() => navigate('/')}>Repositories</AppBarTab>
        { me
          ? <AppBarTab onPress={() => signOut()}>Sign On</AppBarTab>
          : <AppBarTab onPress={() => navigate('/signIn')}>Sign In</AppBarTab>
        }
      </ScrollView>
    </View>
  );
};

export default AppBar;
