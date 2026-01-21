/**
 * ProfileButton Molecule Component
 *
 * A circular button displaying user avatar or initials for profile/settings access
 */

import React, { type ReactElement } from 'react';
import { Image, Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createProfileButtonStyles, getInitials } from './ProfileButton.styles';
import type { ProfileButtonProps } from './ProfileButton.types';

export function ProfileButton({
  displayName,
  avatarSource,
  size = 'md',
  onPress,
  accessibilityLabel = 'Profile',
  testID,
}: ProfileButtonProps): ReactElement {
  const { theme } = useTheme();
  const styles = createProfileButtonStyles(theme, size);

  const initials = displayName ? getInitials(displayName) : '?';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container as StyleProp<ViewStyle>,
        pressed && (styles.pressed as StyleProp<ViewStyle>),
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {avatarSource ? (
        <Image source={avatarSource} style={styles.avatar} />
      ) : (
        <Text style={styles.initialsText}>{initials}</Text>
      )}
    </Pressable>
  );
}
