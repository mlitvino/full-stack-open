import { View, StyleSheet } from 'react-native';

import Text from '../../../components/Text';

const styles = StyleSheet.create({
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    marginTop: 5,
  },
});

const RepositoryStat = ({ label, value }) => (
  <View style={styles.stat}>
    <Text fontWeight="bold">{value}</Text>
    <Text color="textSecondary" style={styles.statLabel}>
      {label}
    </Text>
  </View>
);

export default RepositoryStat;
