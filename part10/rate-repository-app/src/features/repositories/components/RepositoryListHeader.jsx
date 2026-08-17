import { View, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';

import RepositoryOrderPicker from './RepositoryOrderPicker';
import theme from '../../../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.listBackground,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  searchbar: {
    backgroundColor: theme.colors.itemBackground,
  },
});

const RepositoryListHeader = ({ keyword, onKeywordChange, order, onOrderChange }) => (
  <View style={styles.container}>
    <Searchbar
      style={styles.searchbar}
      placeholder="Search repositories"
      value={keyword}
      onChangeText={onKeywordChange}
      autoCapitalize="none"
    />
    <RepositoryOrderPicker value={order} onChange={onOrderChange} />
  </View>
);

export default RepositoryListHeader;
