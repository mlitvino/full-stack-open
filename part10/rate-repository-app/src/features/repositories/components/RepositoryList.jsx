import { useState } from 'react';
import { FlatList, View, Pressable, StyleSheet } from 'react-native';
import { useNavigate } from 'react-router-native';

import RepositoryItem from './RepositoryItem';
import RepositoryListHeader from './RepositoryListHeader';
import { orderPrinciples } from './RepositoryOrderPicker';
import theme from '../../../theme';
import useRepositories from '../hooks/useRepositories';
import useDebouncedValue from '../../../hooks/useDebouncedValue';

const styles = StyleSheet.create({
  list: {
    backgroundColor: theme.colors.listBackground,
  },
  separator: {
    height: 10,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

export const RepositoryListContainer = ({
  repositories,
  onPressItem,
  ListHeaderComponent,
  onEndReached,
}) => {
  const repositoryNodes = repositories
    ? repositories.edges.map(edge => edge.node)
    : [];

  const renderItem = ({ item }) => (
    <Pressable onPress={() => onPressItem?.(item)}>
      <RepositoryItem item={item} />
    </Pressable>
  );

  return (
    <FlatList
      style={styles.list}
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
};

const RepositoryList = () => {
  const [order, setOrder] = useState(orderPrinciples[0].value);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const debouncedKeyword = useDebouncedValue(keyword);

  const { variables } = orderPrinciples.find(
    (principle) => principle.value === order,
  );

  const { repositories, fetchMore } = useRepositories({
    ...variables,
    searchKeyword: debouncedKeyword,
    first: 5,
  });

  return (
    <RepositoryListContainer
      repositories={repositories}
      onPressItem={(item) => navigate(`/repositories/${item.id}`)}
      onEndReached={fetchMore}
      ListHeaderComponent={
        <RepositoryListHeader
          keyword={keyword}
          onKeywordChange={setKeyword}
          order={order}
          onOrderChange={setOrder}
        />
      }
    />
  );
};

export default RepositoryList;
