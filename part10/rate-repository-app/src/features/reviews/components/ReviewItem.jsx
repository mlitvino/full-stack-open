import { View, StyleSheet } from 'react-native';

import Text from '../../../components/Text';
import theme from '../../../theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.itemBackground,
    padding: 10,
  },
  rating: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
    marginLeft: 15,
  },
  date: {
    marginTop: 3,
  },
  text: {
    marginTop: 8,
  },
});

const ReviewItem = ({ review, title }) => (
  <View style={styles.container}>
    <View style={styles.rating}>
      <Text fontWeight="bold" style={styles.ratingText}>
        {review.rating}
      </Text>
    </View>
    <View style={styles.content}>
      <Text fontWeight="bold" fontSize="subheading">
        {title ?? review.user.username}
      </Text>
      <Text color="textSecondary" style={styles.date}>
        {new Date(review.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </Text>
      {review.text ? <Text style={styles.text}>{review.text}</Text> : null}
    </View>
  </View>
);

export default ReviewItem;
