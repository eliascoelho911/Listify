/**
 * MarkdownEditor Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';
import { transparent } from '../../tokens/colors';

export const createMarkdownEditorStyles = (theme: Theme, minHeight: number) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      gap: theme.spacing.xs,
    },
    toolbarButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.radii.md,
      backgroundColor: transparent,
    },
    toolbarButtonPressed: {
      backgroundColor: theme.colors.muted,
    },
    toolbarSeparator: {
      width: 1,
      height: 20,
      backgroundColor: theme.colors.border,
      marginHorizontal: theme.spacing.xs,
    },
    editorContainer: {
      flex: 1,
      padding: theme.spacing.md,
    },
    textInput: {
      flex: 1,
      fontFamily: theme.typography.families.mono,
      fontSize: theme.typography.sizes.base,
      color: theme.colors.foreground,
      lineHeight: theme.typography.sizes.base * 1.6,
      textAlignVertical: 'top',
      minHeight,
    },
    placeholder: {
      color: theme.colors.mutedForeground,
    },
  });
};
