/**
 * GroupHeader Atom Component
 *
 * Header for grouping items in lists (Inbox, Notes, etc.).
 * Used as sticky headers for date groups or list/category groups.
 */

import React, { type ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import { ChevronDown, ChevronRight } from 'lucide-react-native';

import { useTheme } from '../../theme';
import { Icon } from '../Icon/Icon';
import { Text } from '../Text/Text';
import { createGroupHeaderStyles } from './GroupHeader.styles';
import type { GroupHeaderProps } from './GroupHeader.types';

export function GroupHeader({
  label,
  count,
  variant = 'date',
  collapsible = false,
  collapsed = false,
  onToggleCollapse,
  ...viewProps
}: GroupHeaderProps): ReactElement {
  const { theme } = useTheme();
  const styles = createGroupHeaderStyles(theme, variant);

  const content = (
    <>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {count !== undefined && <Text style={styles.count}>({count})</Text>}
      </View>
      {collapsible && (
        <Icon
          icon={collapsed ? ChevronRight : ChevronDown}
          size="sm"
          color={theme.colors.mutedForeground}
        />
      )}
    </>
  );

  if (collapsible && onToggleCollapse) {
    return (
      <Pressable
        style={styles.container}
        onPress={onToggleCollapse}
        accessibilityRole="button"
        accessibilityLabel={`${label} group, ${collapsed ? 'collapsed' : 'expanded'}`}
        {...viewProps}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={styles.container} {...viewProps}>
      {content}
    </View>
  );
}
