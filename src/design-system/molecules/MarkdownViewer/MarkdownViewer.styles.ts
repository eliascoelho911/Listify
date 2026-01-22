/**
 * MarkdownViewer Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export const createMarkdownViewerStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    paragraph: {
      marginBottom: theme.spacing.sm,
    },
    text: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.base,
      color: theme.colors.foreground,
      lineHeight: theme.typography.sizes.base * 1.6,
    },
    bold: {
      fontWeight: theme.typography.weights.bold as '700',
    },
    italic: {
      fontStyle: 'italic',
    },
    strikethrough: {
      textDecorationLine: 'line-through',
    },
    code: {
      fontFamily: theme.typography.families.mono,
      fontSize: theme.typography.sizes.sm,
      backgroundColor: theme.colors.muted,
      borderRadius: theme.radii.sm / 2,
      paddingHorizontal: theme.spacing.xs,
    },
    link: {
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
    h1: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xxl,
      fontWeight: theme.typography.weights.bold as '700',
      color: theme.colors.foreground,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    h2: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold as '700',
      color: theme.colors.foreground,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    h3: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semibold as '600',
      color: theme.colors.foreground,
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
    },
    listItem: {
      flexDirection: 'row',
      marginBottom: theme.spacing.xs,
    },
    listBullet: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.base,
      color: theme.colors.mutedForeground,
      marginRight: theme.spacing.sm,
      width: theme.spacing.md,
    },
    listContent: {
      flex: 1,
    },
    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.muted,
      paddingLeft: theme.spacing.md,
      marginVertical: theme.spacing.sm,
    },
    blockquoteText: {
      fontStyle: 'italic',
      color: theme.colors.mutedForeground,
    },
    horizontalRule: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.md,
    },
    codeBlock: {
      backgroundColor: theme.colors.muted,
      borderRadius: theme.radii.md,
      padding: theme.spacing.md,
      marginVertical: theme.spacing.sm,
    },
    codeBlockText: {
      fontFamily: theme.typography.families.mono,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.foreground,
    },
  });
};
