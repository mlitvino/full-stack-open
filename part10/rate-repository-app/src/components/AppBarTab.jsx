import { Pressable, StyleSheet } from 'react-native';

import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  tab: {
    paddingHorizontal: 10,
  },
  text: {
    color: theme.colors.appBarText,
  },
});

const AppBarTab = ({ children, onPress }) => {
  return (
    <Pressable style={styles.tab} onPress={onPress}>
      <Text fontSize="subheading" fontWeight="bold" style={styles.text}>
        {children}
      </Text>
    </Pressable>
  );
};

export default AppBarTab;
