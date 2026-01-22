/**
 * AddAllButton Atom Component
 *
 * A prominent button for "Buy all again" action in purchase history.
 * Features an icon and label, styled for high visibility.
 */

import { Ionicons } from '@expo/vector-icons';
import React, { type ReactElement } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../../theme';
import { createAddAllButtonStyles } from './AddAllButton.styles';
import type { AddAllButtonProps } from './AddAllButton.types';

export function AddAllButton({
  label,
  onPress,
  itemCount,
  loading = false,
  disabled = false,
  style,
  testID,
}: AddAllButtonProps): ReactElement {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;
  const styles = createAddAllButtonStyles(theme, isDisabled);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled }}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={theme.colors.primaryForeground}
        />
      ) : (
        <>
          <Ionicons
            name="cart-outline"
            size={20}
            color={
              isDisabled
                ? theme.colors.mutedForeground
                : theme.colors.primaryForeground
            }
            style={styles.icon}
          />
          <Text style={styles.label}>{label}</Text>
          {itemCount !== undefined && itemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{itemCount}</Text>
            </View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
