/**
 * SectionHeader Molecule Styles
 *
 * Header component for sections within lists.
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createSectionHeaderStyles = (
  theme: Theme,
  options: { expanded: boolean; isDragging: boolean },
) => {
  const { expanded, isDragging } = options;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: isDragging ? theme.colors.accent : theme.colors.muted,
      borderRadius: theme.radii.md,
      opacity: isDragging ? 0.9 : 1,
    },
    chevronContainer: {
      marginRight: theme.spacing.sm,
    },
    chevron: {
      transform: [{ rotate: expanded ? '90deg' : '0deg' }],
    },
    content: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    name: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.foreground,
    },
    itemCount: {
      fontSize: theme.typography.sizes.xs,
      fontFamily: theme.typography.families.body,
      color: theme.colors.mutedForeground,
      marginLeft: theme.spacing.sm,
    },
    addButton: {
      marginLeft: theme.spacing.sm,
      padding: theme.spacing.xs,
    },
  });
};
