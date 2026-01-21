/**
 * NoteCard Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createNoteCardStyles = (theme: Theme, selected?: boolean) => {
  const iconContainerSize = theme.spacing.xl + theme.spacing.md; // 24 + 12 = 36

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: theme.spacing.md,
      borderRadius: theme.radii.lg,
      backgroundColor: selected ? theme.colors.accent : theme.colors.card,
      borderWidth: 1,
      borderColor: selected ? theme.colors.primary : theme.colors.border,
      gap: theme.spacing.sm,
    },
    iconContainer: {
      width: iconContainerSize,
      height: iconContainerSize,
      borderRadius: theme.radii.md,
      backgroundColor: `${theme.colors.itemNote}20`,
      alignItems: 'center',
      justifyContent: 'center',
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
      color: theme.colors.foreground,
      flex: 1,
    },
    description: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.mutedForeground,
      lineHeight: theme.typography.sizes.sm * 1.4,
    },
    timestamp: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.mutedForeground,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.xs,
    },
    charCount: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.mutedForeground,
    },
  });
};
