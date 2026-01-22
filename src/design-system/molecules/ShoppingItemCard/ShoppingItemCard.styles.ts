/**
 * ShoppingItemCard Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createShoppingItemCardStyles = (
  theme: Theme,
  options: { isChecked: boolean; selected: boolean; isDragging: boolean },
) => {
  const { isChecked, selected, isDragging } = options;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.radii.lg,
      backgroundColor: isDragging
        ? theme.colors.accent
        : selected
          ? theme.colors.accent
          : theme.colors.card,
      borderWidth: 1,
      borderColor: isDragging
        ? theme.colors.primary
        : selected
          ? theme.colors.primary
          : theme.colors.border,
      gap: theme.spacing.sm,
      opacity: isDragging ? 0.9 : 1,
    },
    dragHandleContainer: {
      paddingRight: theme.spacing.xs,
    },
    checkboxContainer: {
      marginRight: theme.spacing.xs,
    },
    content: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.base,
      fontWeight: theme.typography.weights.medium as '500',
      color: isChecked ? theme.colors.mutedForeground : theme.colors.foreground,
      textDecorationLine: isChecked ? 'line-through' : 'none',
      flex: 1,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    quantity: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: isChecked ? theme.colors.mutedForeground : theme.colors.foreground,
      opacity: isChecked ? 0.7 : 1,
    },
    priceContainer: {
      marginLeft: 'auto',
    },
  });
};
