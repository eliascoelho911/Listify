/**
 * Checkbox Atom Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';

export type CheckboxSize = 'sm' | 'md' | 'lg';

const CHECKBOX_SIZES: Record<CheckboxSize, number> = {
  sm: 18,
  md: 22,
  lg: 28,
};

const ICON_SIZES: Record<CheckboxSize, number> = {
  sm: 12,
  md: 16,
  lg: 20,
};

export const getCheckboxSize = (size: CheckboxSize): number => CHECKBOX_SIZES[size];
export const getIconSize = (size: CheckboxSize): number => ICON_SIZES[size];

export const createCheckboxStyles = (
  theme: Theme,
  options: { checked: boolean; disabled: boolean; size: CheckboxSize },
) => {
  const { checked, disabled, size } = options;
  const checkboxSize = CHECKBOX_SIZES[size];

  return StyleSheet.create({
    container: {
      width: checkboxSize,
      height: checkboxSize,
      borderRadius: theme.radii.sm,
      borderWidth: 2,
      borderColor: checked ? theme.colors.primary : theme.colors.border,
      backgroundColor: checked ? theme.colors.primary : theme.colors.transparent,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.5 : 1,
    },
  });
};
