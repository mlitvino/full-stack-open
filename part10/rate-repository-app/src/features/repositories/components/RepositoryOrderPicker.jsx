import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Menu } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
});

export const orderPrinciples = [
  {
    value: 'latest',
    label: 'Latest repositories',
    variables: { orderBy: 'CREATED_AT', orderDirection: 'DESC' },
  },
  {
    value: 'highestRated',
    label: 'Highest rated repositories',
    variables: { orderBy: 'RATING_AVERAGE', orderDirection: 'DESC' },
  },
  {
    value: 'lowestRated',
    label: 'Lowest rated repositories',
    variables: { orderBy: 'RATING_AVERAGE', orderDirection: 'ASC' },
  },
];

const RepositoryOrderPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const selected = orderPrinciples.find((principle) => principle.value === value);

  const select = (principle) => {
    onChange(principle.value);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={open}
        onDismiss={() => setOpen(false)}
        anchor={
          <Button mode="outlined" icon="sort" onPress={() => setOpen(true)}>
            {selected ? selected.label : 'Select an item...'}
          </Button>
        }
      >
        {orderPrinciples.map((principle) => (
          <Menu.Item
            key={principle.value}
            title={principle.label}
            onPress={() => select(principle)}
          />
        ))}
      </Menu>
    </View>
  );
};

export default RepositoryOrderPicker;
