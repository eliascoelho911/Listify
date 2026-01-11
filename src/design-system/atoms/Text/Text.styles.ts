/**
 * Text Atom Styles
 */

import { StyleSheet, type TextStyle } from 'react-native';

import type { Theme } from '../../theme/theme';
import type { TextAlign, TextColor, TextVariant, TextWeight } from './Text.types';

interface VariantConfig {
  fontSize: number;
  fontWeight: '400' | '500' | '600' | '700';
  lineHeight: number;
  fontFamily: string;
}

export const createTextStyles = (theme: Theme) => {
  const baseStyles = StyleSheet.create({
    text: {
      color: theme.colors.foreground,
      fontFamily: theme.typography.families.body,
    },
  });

  const variantStyles: Record<TextVariant, VariantConfig> = {
    h1: {
      fontSize: theme.typography.sizes['4xl'],
      fontWeight: theme.typography.weights.bold,
      lineHeight: theme.typography.sizes['4xl'] * theme.typography.lineHeights.tight,
      fontFamily: theme.typography.families.body,
    },
    h2: {
      fontSize: theme.typography.sizes['3xl'],
      fontWeight: theme.typography.weights.bold,
      lineHeight: theme.typography.sizes['3xl'] * theme.typography.lineHeights.tight,
      fontFamily: theme.typography.families.body,
    },
    h3: {
      fontSize: theme.typography.sizes['2xl'],
      fontWeight: theme.typography.weights.semibold,
      lineHeight: theme.typography.sizes['2xl'] * theme.typography.lineHeights.tight,
      fontFamily: theme.typography.families.body,
    },
    h4: {
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.semibold,
      lineHeight: theme.typography.sizes.xl * theme.typography.lineHeights.tight,
      fontFamily: theme.typography.families.body,
    },
    body: {
      fontSize: theme.typography.sizes.base,
      fontWeight: theme.typography.weights.regular,
      lineHeight: theme.typography.sizes.base * theme.typography.lineHeights.normal,
      fontFamily: theme.typography.families.body,
    },
    bodySmall: {
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.regular,
      lineHeight: theme.typography.sizes.sm * theme.typography.lineHeights.normal,
      fontFamily: theme.typography.families.body,
    },
    bodyLarge: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.regular,
      lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.normal,
      fontFamily: theme.typography.families.body,
    },
    caption: {
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.regular,
      lineHeight: theme.typography.sizes.xs * theme.typography.lineHeights.normal,
      fontFamily: theme.typography.families.body,
    },
    label: {
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.medium,
      lineHeight: theme.typography.sizes.sm * theme.typography.lineHeights.normal,
      fontFamily: theme.typography.families.body,
    },
    mono: {
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.regular,
      lineHeight: theme.typography.sizes.sm * theme.typography.lineHeights.relaxed,
      fontFamily: theme.typography.families.mono,
    },
  };

  const colorStyles: Record<TextColor, TextStyle> = {
    foreground: { color: theme.colors.foreground },
    mutedForeground: { color: theme.colors.mutedForeground },
    cardForeground: { color: theme.colors.cardForeground },
    primaryForeground: { color: theme.colors.primaryForeground },
    secondaryForeground: { color: theme.colors.secondaryForeground },
    destructiveForeground: { color: theme.colors.destructiveForeground },
    primary: { color: theme.colors.primary },
    destructive: { color: theme.colors.destructive },
    muted: { color: theme.colors.muted },
  };

  const weightStyles: Record<TextWeight, TextStyle> = {
    regular: { fontWeight: theme.typography.weights.regular },
    medium: { fontWeight: theme.typography.weights.medium },
    semibold: { fontWeight: theme.typography.weights.semibold },
    bold: { fontWeight: theme.typography.weights.bold },
  };

  const alignStyles: Record<TextAlign, TextStyle> = {
    left: { textAlign: 'left' },
    center: { textAlign: 'center' },
    right: { textAlign: 'right' },
    justify: { textAlign: 'justify' },
  };

  return {
    baseStyles,
    variantStyles,
    colorStyles,
    weightStyles,
    alignStyles,
  };
};
