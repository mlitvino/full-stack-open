import { View, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';

import AppBarTab from './AppBarTab';
import theme from '../theme';
import { useNavigate } from 'react-router-native';
import { useMe, useAuthStorage } from '../features/auth'
import { useApolloClient } from '@apollo/client/react';

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
          ? <>
              <AppBarTab onPress={() => navigate('/createReview')}>Create a review</AppBarTab>
              <AppBarTab onPress={() => navigate('/myReviews')}>My reviews</AppBarTab>
              <AppBarTab onPress={() => signOut()}>Sign Out</AppBarTab>
            </>
          : <>
              <AppBarTab onPress={() => navigate('/signIn')}>Sign In</AppBarTab>
              <AppBarTab onPress={() => navigate('/signUp')}>Sign Up</AppBarTab>
            </>
        }
      </ScrollView>
    </View>
  );
};

export default AppBar;
