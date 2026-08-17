import { StyleSheet, View } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native';

import AppBar from './AppBar';
import { RepositoryList, RepositoryView } from '../features/repositories';
import { ReviewForm, MyReviews } from '../features/reviews';
import { SignIn, SignUp } from '../features/auth';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Main = () => {
  return (
    <View style={styles.container}>
      <AppBar />
      <Routes>
        <Route path="/" element={<RepositoryList />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/repositories/:id" element={<RepositoryView />} />
        <Route path="/createReview" element={<ReviewForm />} />
        <Route path="/myReviews" element={<MyReviews />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </View>
  );
};

export default Main;
