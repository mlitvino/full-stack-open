import { View, Image, StyleSheet } from 'react-native';

import Text from './Text';
import RepositoryStat from './RepositoryStat';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.itemBackground,
    padding: 10,
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  description: {
    marginTop: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  languageContainer: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  language: {
    color: theme.colors.textWhite,
  },
  topRow: {
    flexDirection: 'row',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 3,
  },
});

const RepositoryItem = ({ item }) => {
  const formatCount = (count) => {
    const rounded = `${(count / 1000).toFixed(1)}k`
    return count >= 1000 ? rounded : String(count);
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Image style={styles.avatar} source={{ uri: item.ownerAvatarUrl }} />
        <View style={styles.info}>
          <Text fontWeight="bold" fontSize="subheading">
            {item.fullName}
          </Text>
          <Text color="textSecondary" style={styles.description}>
            {item.description}
          </Text>
          <View style={styles.languageContainer}>
            <Text style={styles.language}>{item.language}</Text>
          </View>
        </View>
      </View>
      <View style={styles.statsRow}>
        <RepositoryStat label="Stars" value={formatCount(item.stargazersCount)} />
        <RepositoryStat label="Forks" value={formatCount(item.forksCount)} />
        <RepositoryStat label="Reviews" value={formatCount(item.reviewCount)} />
        <RepositoryStat label="Rating" value={formatCount(item.ratingAverage)} />
      </View>
    </View>
  )
};

export default RepositoryItem;
