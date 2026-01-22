/**
 * InlineEdit Atom Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';
import { transparent } from '../../tokens/colors';
import type { InlineEditProps } from './InlineEdit.types';

export const createInlineEditStyles = (
  theme: Theme,
  variant: InlineEditProps['variant'] = 'default',
) => {
  const getTextStyles = () => {
    switch (variant) {
      case 'title':
        return {
          fontSize: theme.typography.sizes.xl,
          fontWeight: theme.typography.weights.bold as '700',
          lineHeight: theme.typography.sizes.xl * 1.3,
        };
      case 'subtitle':
        return {
          fontSize: theme.typography.sizes.lg,
          fontWeight: theme.typography.weights.semibold as '600',
          lineHeight: theme.typography.sizes.lg * 1.4,
        };
      default:
        return {
          fontSize: theme.typography.sizes.base,
          fontWeight: theme.typography.weights.regular as '400',
          lineHeight: theme.typography.sizes.base * 1.5,
        };
    }
  };

  const textStyles = getTextStyles();

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textContainer: {
      flex: 1,
      paddingVertical: theme.spacing.xs,
    },
    text: {
      fontFamily: theme.typography.families.body,
      color: theme.colors.foreground,
      ...textStyles,
    },
    placeholder: {
      fontFamily: theme.typography.families.body,
      color: theme.colors.mutedForeground,
      fontStyle: 'italic',
      ...textStyles,
    },
    inputContainer: {
      flex: 1,
    },
    input: {
      fontFamily: theme.typography.families.body,
      color: theme.colors.foreground,
      borderWidth: 0,
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.primary,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: 0,
      margin: 0,
      backgroundColor: transparent,
      ...textStyles,
    },
    editIcon: {
      marginLeft: theme.spacing.sm,
      opacity: 0.5,
    },
    disabled: {
      opacity: 0.5,
    },
  });
};
