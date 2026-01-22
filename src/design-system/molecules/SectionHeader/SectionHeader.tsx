/**
 * SectionHeader Molecule Component
 *
 * Header component for sections within lists. Displays section name with
 * expand/collapse toggle and optional add item button.
 */

import React, { type ReactElement, useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { ChevronRight, Plus } from 'lucide-react-native';

import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createSectionHeaderStyles } from './SectionHeader.styles';
import type { SectionHeaderProps } from './SectionHeader.types';

export function SectionHeader({
  name,
  itemCount,
  expanded = true,
  onToggleExpand,
  onLongPress,
  onAddItem,
  showAddButton = false,
  isDragging = false,
  testID,
  ...viewProps
}: SectionHeaderProps): ReactElement {
  const { theme } = useTheme();
  const styles = createSectionHeaderStyles(theme, { expanded, isDragging });

  const handlePress = useCallback(() => {
    onToggleExpand?.();
  }, [onToggleExpand]);

  const handleAddPress = useCallback(() => {
    onAddItem?.();
  }, [onAddItem]);

  return (
    <Pressable
      style={styles.container}
      onPress={handlePress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityLabel={`${name} section${itemCount !== undefined ? `, ${itemCount} items` : ''}`}
      testID={testID}
      {...viewProps}
    >
      <View style={styles.chevronContainer}>
        <View style={styles.chevron}>
          <Icon icon={ChevronRight} size="sm" color={theme.colors.mutedForeground} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {itemCount !== undefined && <Text style={styles.itemCount}>({itemCount})</Text>}
      </View>

      {showAddButton && (
        <Pressable
          style={styles.addButton}
          onPress={handleAddPress}
          accessibilityRole="button"
          accessibilityLabel={`Add item to ${name}`}
          testID={testID ? `${testID}-add-button` : undefined}
        >
          <Icon icon={Plus} size="sm" color={theme.colors.primary} />
        </Pressable>
      )}
    </Pressable>
  );
}
