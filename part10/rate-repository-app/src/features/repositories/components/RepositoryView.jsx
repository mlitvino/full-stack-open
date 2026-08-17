import { View, FlatList, Pressable, Linking, StyleSheet } from 'react-native';
import { useParams } from 'react-router-native';

import RepositoryItem from './RepositoryItem';
import { ReviewItem } from '../../reviews';
import Text from '../../../components/Text';
import theme from '../../../theme';
import useRepository from '../hooks/useRepository';

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
  actions: {
    backgroundColor: theme.colors.itemBackground,
    paddingHorizontal: 10,
    paddingBottom: 10,
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

const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryInfo = ({ repository }) => (
  <View>
    <RepositoryItem item={repository} />
    {repository.url && (
      <View style={styles.actions}>
        <Pressable
          style={styles.button}
          onPress={() => Linking.openURL(repository.url)}
        >
          <Text fontWeight="bold" style={styles.buttonText}>
            Open in GitHub
          </Text>
        </Pressable>
      </View>
    )}
  </View>
);

export const RepositoryContainer = ({ repository, reviews }) => (
  <FlatList
    style={styles.container}
    data={reviews}
    renderItem={({ item }) => <ReviewItem review={item} />}
    keyExtractor={({ id }) => id}
    ListHeaderComponent={() => <RepositoryInfo repository={repository} />}
    ItemSeparatorComponent={ItemSeparator}
  />
);

const RepositoryView = () => {
  const { id } = useParams();
  const { repository, loading } = useRepository(id);

  if (!repository) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          {loading ? 'Loading...' : 'Repository not found'}
        </Text>
      </View>
    );
  }

  const reviews = repository.reviews
    ? repository.reviews.edges.map(edge => edge.node)
    : [];

  return <RepositoryContainer repository={repository} reviews={reviews} />;
};

export default RepositoryView;
