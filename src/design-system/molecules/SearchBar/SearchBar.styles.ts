/**
 * SearchBar Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createSearchBarStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      position: 'relative',
      width: '100%',
    },
    iconContainer: {
      position: 'absolute',
      left: theme.spacing.md,
      top: '50%',
      transform: [{ translateY: -10 }], // Half of icon size (20/2)
      zIndex: 1,
    },
    inputWithIcon: {
      paddingLeft: theme.spacing.xl + theme.spacing.md, // Icon size + padding
    },
    clearButton: {
      position: 'absolute',
      right: theme.spacing.md,
      top: '50%',
      transform: [{ translateY: -10 }],
      zIndex: 1,
    },
    inputWithClear: {
      paddingRight: theme.spacing.xl + theme.spacing.md,
    },
  });
};
