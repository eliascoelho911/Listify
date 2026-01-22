/**
 * ShoppingItemCard Molecule Component
 *
 * A card component specifically designed for shopping list items.
 * Displays item title, quantity, price, and a checkbox for marking as purchased.
 * Supports drag handle for reordering when in edit mode.
 */

import React, { type ReactElement, useCallback, useMemo } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';

import { Checkbox } from '../../atoms/Checkbox/Checkbox';
import { DragHandle } from '../../atoms/DragHandle/DragHandle';
import { PriceBadge } from '../../atoms/PriceBadge/PriceBadge';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createShoppingItemCardStyles } from './ShoppingItemCard.styles';
import type { ShoppingItemCardProps } from './ShoppingItemCard.types';

export function ShoppingItemCard({
  item,
  onToggle,
  onPress,
  onLongPress,
  selected = false,
  showDragHandle = false,
  isDragging = false,
  onDrag,
  style,
  testID,
}: ShoppingItemCardProps): ReactElement {
  const { theme } = useTheme();
  const isChecked = item.isChecked ?? false;
  const styles = createShoppingItemCardStyles(theme, { isChecked, selected, isDragging });

  const handleToggle = useCallback(
    (checked: boolean) => {
      onToggle?.(item, checked);
    },
    [item, onToggle],
  );

  const handlePress = useCallback(() => {
    onPress?.(item);
  }, [item, onPress]);

  const handleLongPress = useCallback(() => {
    if (showDragHandle && onDrag) {
      // When drag handle is shown, long press on card initiates drag
      onDrag();
    } else {
      onLongPress?.(item);
    }
  }, [item, onLongPress, showDragHandle, onDrag]);

  const hasPrice = useMemo(() => item.price !== undefined && item.price > 0, [item.price]);

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}${item.quantity ? `, ${item.quantity}` : ''}${hasPrice ? `, price` : ''}, ${isChecked ? 'checked' : 'unchecked'}`}
      testID={testID}
    >
      {showDragHandle && (
        <TouchableOpacity
          onLongPress={onDrag}
          delayLongPress={100}
          style={styles.dragHandleContainer}
          accessibilityLabel="Drag to reorder"
          accessibilityHint="Long press and drag to reorder this item"
        >
          <DragHandle size="md" isDragging={isDragging} />
        </TouchableOpacity>
      )}

      <View style={styles.checkboxContainer}>
        <Checkbox
          checked={isChecked}
          onToggle={handleToggle}
          size="md"
          testID={testID ? `${testID}-checkbox` : undefined}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
        </View>

        {(item.quantity || hasPrice) && (
          <View style={styles.metaRow}>
            {item.quantity && <Text style={styles.quantity}>{item.quantity}</Text>}
            {hasPrice && (
              <View style={styles.priceContainer}>
                <PriceBadge price={item.price!} size="sm" />
              </View>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}
