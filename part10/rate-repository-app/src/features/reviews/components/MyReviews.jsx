import { View, FlatList, Pressable, Alert, StyleSheet } from 'react-native';
import { useNavigate } from 'react-router-native';

import ReviewItem from './ReviewItem';
import Text from '../../../components/Text';
import theme from '../../../theme';
import useDeleteReview from '../hooks/useDeleteReview';
import { useMe } from '../../auth';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.listBackground,
  },
  message: {
    padding: 15,
  },
  separator: {
    height: 10,
  },
  item: {
    backgroundColor: theme.colors.itemBackground,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  button: {
    flex: 1,
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: theme.colors.primary,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
    marginLeft: 5,
  },
  buttonText: {
    color: theme.colors.textWhite,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const MyReviewItem = ({ review, onView, onDelete }) => (
  <View style={styles.item}>
    <ReviewItem review={review} title={review.repository.fullName} />
    <View style={styles.actions}>
      <Pressable style={[styles.button, styles.viewButton]} onPress={onView}>
        <Text fontWeight="bold" style={styles.buttonText}>
          View repository
        </Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.deleteButton]}
        onPress={onDelete}
      >
        <Text fontWeight="bold" style={styles.buttonText}>
          Delete review
        </Text>
      </Pressable>
    </View>
  </View>
);

export const MyReviewsContainer = ({ reviews, onView, onDelete }) => (
  <FlatList
    style={styles.container}
    data={reviews}
    keyExtractor={({ id }) => id}
    ItemSeparatorComponent={ItemSeparator}
    renderItem={({ item }) => (
      <MyReviewItem
        review={item}
        onView={() => onView?.(item)}
        onDelete={() => onDelete?.(item)}
      />
    )}
  />
);

const MyReviews = () => {
  const { me, loading, refetch } = useMe({ includeReviews: true });
  const [deleteReview] = useDeleteReview();
  const navigate = useNavigate();

  if (!me) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          {loading ? 'Loading...' : 'You are not signed in'}
        </Text>
      </View>
    );
  }

  const reviews = me.reviews ? me.reviews.edges.map((edge) => edge.node) : [];

  const confirmDelete = (review) => {
    Alert.alert(
      'Delete review',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReview(review.id);
              await refetch();
            } catch (e) {
              console.log(e);
            }
          },
        },
      ],
    );
  };

  return (
    <MyReviewsContainer
      reviews={reviews}
      onView={(review) => navigate(`/repositories/${review.repositoryId}`)}
      onDelete={confirmDelete}
    />
  );
};

export default MyReviews;
