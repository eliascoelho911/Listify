/**
 * Navbar Organism Component
 *
 * Top navigation bar using custom topbar tokens
 */

import React, { type ReactElement } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Icon } from '../../atoms/Icon/Icon';
import { useTheme } from '../../theme';
import { createNavbarStyles } from './Navbar.styles';
import type { NavbarProps } from './Navbar.types';

export function Navbar({
  title,
  leftActions = [],
  rightActions = [],
  showBorder = true,
  ...viewProps
}: NavbarProps): ReactElement {
  const { theme } = useTheme();
  const styles = createNavbarStyles(theme);

  return (
    <View style={[styles.container, !showBorder && styles.containerWithoutBorder]} {...viewProps}>
      {/* Left Actions */}
      <View style={styles.actionsContainer}>
        {leftActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionButton}
            onPress={action.onPress}
            accessibilityLabel={action.label}
          >
            <Icon icon={action.icon} size="md" color={theme.colors['topbar-foreground']} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Title */}
      {title && (
        <View style={styles.centerContent}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}

      {/* Right Actions */}
      <View style={styles.actionsContainer}>
        {rightActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionButton}
            onPress={action.onPress}
            accessibilityLabel={action.label}
          >
            <Icon icon={action.icon} size="md" color={theme.colors['topbar-foreground']} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
