/**
 * ShoppingItemCard Molecule Component
 *
 * A card component specifically designed for shopping list items.
 * Displays item title, quantity, price, and a checkbox for marking as purchased.
 */

import React, { type ReactElement, useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';

import { Checkbox } from '../../atoms/Checkbox/Checkbox';
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
  style,
  testID,
}: ShoppingItemCardProps): ReactElement {
  const { theme } = useTheme();
  const isChecked = item.isChecked ?? false;
  const styles = createShoppingItemCardStyles(theme, { isChecked, selected });

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
    onLongPress?.(item);
  }, [item, onLongPress]);

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
