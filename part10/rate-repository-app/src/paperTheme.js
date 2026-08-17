import { MD3LightTheme } from 'react-native-paper';

import theme from './theme';

const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: theme.colors.primary,
    onPrimary: theme.colors.textWhite,
    background: theme.colors.listBackground,
    surface: theme.colors.itemBackground,
    onSurface: theme.colors.textPrimary,
    surfaceVariant: theme.colors.itemBackground,
    onSurfaceVariant: theme.colors.textSecondary,
    outline: theme.colors.textSecondary,
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level1: theme.colors.itemBackground,
      level2: theme.colors.itemBackground,
      level3: theme.colors.itemBackground,
      level4: theme.colors.itemBackground,
      level5: theme.colors.itemBackground,
    },
  },
};

export default paperTheme;
