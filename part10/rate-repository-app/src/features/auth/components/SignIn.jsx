import { View, Pressable, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';

import FormikTextInput from '../../../components/FormikTextInput';
import Text from '../../../components/Text';
import theme from '../../../theme';
import useSignIn from '../hooks/useSignIn';
import useAuthStorage from '../hooks/useAuthStorage';
import { useNavigate } from 'react-router-native';
import { useApolloClient } from '@apollo/client/react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.listBackground,
  },
  form: {
    backgroundColor: theme.colors.itemBackground,
    padding: 15,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.textWhite,
  },
});

const initialValues = {
  username: '',
  password: '',
};

const validationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const SignInForm = ({ onSubmit }) => (
  <View style={styles.container}>
    <View style={styles.form}>
      <FormikTextInput
        name="username"
        placeholder="Username"
        autoCapitalize="none"
      />
      <FormikTextInput
        name="password"
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry
      />
      <Pressable style={styles.button} onPress={onSubmit}>
        <Text fontWeight="bold" style={styles.buttonText}>
          Sign in
        </Text>
      </Pressable>
    </View>
  </View>
);

export const SignInContainer = ({ onSubmit }) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    {({ handleSubmit }) => <SignInForm onSubmit={handleSubmit} />}
  </Formik>
);

const SignIn = () => {
  const [signIn] = useSignIn()
  const authStorage = useAuthStorage();
  const navigate = useNavigate()
  const apolloClient = useApolloClient()

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      const { data } = await signIn({ username, password })
      await authStorage.setAccessToken(data.authenticate.accessToken);
      await apolloClient.resetStore()
      navigate('/')
    } catch (e) {
      console.log(e);
    }
  };

  return <SignInContainer onSubmit={onSubmit} />;
};

export default SignIn;
