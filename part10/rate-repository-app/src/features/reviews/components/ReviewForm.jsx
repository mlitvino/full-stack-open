import { View, Pressable, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-native';

import FormikTextInput from '../../../components/FormikTextInput';
import Text from '../../../components/Text';
import theme from '../../../theme';
import useCreateReview from '../hooks/useCreateReview';

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
  ownerName: '',
  repositoryName: '',
  rating: '',
  text: '',
};

const validationSchema = yup.object().shape({
  ownerName: yup
    .string()
    .required("Repository owner's username is required"),
  repositoryName: yup.string().required("Repository's name is required"),
  rating: yup
    .number()
    .typeError('Rating must be a number')
    .min(0, 'Rating must be at least 0')
    .max(100, 'Rating must be at most 100')
    .required('Rating is required'),
  text: yup.string(),
});

const ReviewFormFields = ({ onSubmit }) => (
  <View style={styles.container}>
    <View style={styles.form}>
      <FormikTextInput
        name="ownerName"
        placeholder="Repository owner name"
        autoCapitalize="none"
      />
      <FormikTextInput
        name="repositoryName"
        placeholder="Repository name"
        autoCapitalize="none"
      />
      <FormikTextInput
        name="rating"
        placeholder="Rating between 0 and 100"
        keyboardType="numeric"
      />
      <FormikTextInput
        name="text"
        placeholder="Review"
        multiline
        numberOfLines={4}
      />
      <Pressable style={styles.button} onPress={onSubmit}>
        <Text fontWeight="bold" style={styles.buttonText}>
          Create a review
        </Text>
      </Pressable>
    </View>
  </View>
);

export const ReviewFormContainer = ({ onSubmit }) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    {({ handleSubmit }) => <ReviewFormFields onSubmit={handleSubmit} />}
  </Formik>
);

const ReviewForm = () => {
  const [createReview] = useCreateReview();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const { data } = await createReview(values);

      navigate(`/repositories/${data.createReview.repositoryId}`);
    } catch (e) {
      console.log(e);
    }
  };

  return <ReviewFormContainer onSubmit={onSubmit} />;
};

export default ReviewForm;
