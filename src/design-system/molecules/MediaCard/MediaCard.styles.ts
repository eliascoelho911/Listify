/**
 * MediaCard Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createMediaCardStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: theme.colors.card,
      borderRadius: theme.radii.lg,
      padding: theme.spacing.sm,
      gap: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    containerPressed: {
      backgroundColor: theme.colors.muted,
    },
    containerChecked: {
      opacity: 0.7,
    },
    containerDisabled: {
      opacity: 0.5,
    },
    coverImage: {
      width: 60,
      height: 90,
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.muted,
    },
    coverPlaceholder: {
      width: 60,
      height: 90,
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.muted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      gap: theme.spacing.xs,
      justifyContent: 'center',
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.xs,
    },
    title: {
      flex: 1,
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.cardForeground,
    },
    titleChecked: {
      textDecorationLine: 'line-through',
      color: theme.colors.mutedForeground,
    },
    metadataRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    yearText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.mutedForeground,
    },
    ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs / 2,
      backgroundColor: theme.colors.muted,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.radii.sm,
    },
    ratingText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.foreground,
    },
    secondaryInfo: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.primary,
    },
    description: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.mutedForeground,
      lineHeight: theme.typography.sizes.xs * 1.4,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: theme.spacing.xs / 2,
      backgroundColor: theme.colors.accent,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.radii.sm,
      marginTop: theme.spacing.xs,
    },
    statusText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.accentForeground,
    },
    checkboxContainer: {
      justifyContent: 'center',
      paddingLeft: theme.spacing.xs,
    },
  });
};

export type MediaCardStyles = ReturnType<typeof createMediaCardStyles>;
