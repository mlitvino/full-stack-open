import { View, Pressable, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-native';

import FormikTextInput from '../../../components/FormikTextInput';
import Text from '../../../components/Text';
import theme from '../../../theme';
import useSignUp from '../hooks/useSignUp';

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
  passwordConfirmation: '',
};

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(5, 'Username must be at least 5 characters long')
    .max(30, 'Username must be at most 30 characters long')
    .required('Username is required'),
  password: yup
    .string()
    .min(5, 'Password must be at least 5 characters long')
    .max(50, 'Password must be at most 50 characters long')
    .required('Password is required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Password confirmation is required'),
});

const SignUpForm = ({ onSubmit }) => (
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
      <FormikTextInput
        name="passwordConfirmation"
        placeholder="Password confirmation"
        autoCapitalize="none"
        secureTextEntry
      />
      <Pressable style={styles.button} onPress={onSubmit}>
        <Text fontWeight="bold" style={styles.buttonText}>
          Sign up
        </Text>
      </Pressable>
    </View>
  </View>
);

export const SignUpContainer = ({ onSubmit }) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    {({ handleSubmit }) => <SignUpForm onSubmit={handleSubmit} />}
  </Formik>
);

const SignUp = () => {
  const [signUp] = useSignUp();
  const navigate = useNavigate();

  const onSubmit = async ({ username, password }) => {
    try {
      await signUp({ username, password });

      navigate('/signIn');
    } catch (e) {
      console.log(e);
    }
  };

  return <SignUpContainer onSubmit={onSubmit} />;
};

export default SignUp;
