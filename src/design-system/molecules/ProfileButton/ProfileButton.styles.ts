/**
 * ProfileButton Molecule Styles
 */

import { StyleSheet } from 'react-native';

import type { Theme } from '../../theme/theme';
import type { ProfileButtonSize } from './ProfileButton.types';

const SIZE_MAP: Record<ProfileButtonSize, number> = {
  sm: 32,
  md: 40,
  lg: 48,
};

const FONT_SIZE_MAP: Record<ProfileButtonSize, number> = {
  sm: 12,
  md: 14,
  lg: 18,
};

export const createProfileButtonStyles = (theme: Theme, size: ProfileButtonSize) => {
  const buttonSize = SIZE_MAP[size];
  const fontSize = FONT_SIZE_MAP[size];

  return StyleSheet.create({
    container: {
      width: buttonSize,
      height: buttonSize,
      borderRadius: theme.radii.full,
      backgroundColor: theme.colors.muted,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    pressed: {
      opacity: 0.7,
    },
    avatar: {
      width: buttonSize,
      height: buttonSize,
      borderRadius: theme.radii.full,
    },
    initialsText: {
      fontSize,
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.foreground,
    },
  });
};

export function getInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (parts[0]?.slice(0, 2) || '?').toUpperCase();
}
