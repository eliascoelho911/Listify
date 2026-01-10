/**
 * ShoppingListCard Organism Component
 *
 * Composes Card, Badge, and Icon atoms into a shopping list card
 */

import { Check, ShoppingCart } from 'lucide-react-native';
import React, { type ReactElement } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Badge } from '../../atoms/Badge/Badge';
import { Icon } from '../../atoms/Icon/Icon';
import { useTheme } from '../../theme';
import { createShoppingListCardStyles } from './ShoppingListCard.styles';
import type { ShoppingListCardProps } from './ShoppingListCard.types';

export function ShoppingListCard({
  title,
  itemCount,
  completedCount,
  totalValue,
  lastUpdated,
  status = 'active',
  onPress,
  ...viewProps
}: ShoppingListCardProps): ReactElement {
  const { theme } = useTheme();
  const styles = createShoppingListCardStyles(theme);

  const statusVariant = status === 'completed' ? 'default' : status === 'archived' ? 'secondary' : 'outline';
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      style={styles.card}
      onPress={onPress}
      accessible={!!onPress}
      accessibilityRole={onPress ? 'button' : 'none'}
      {...viewProps}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Icon icon={ShoppingCart} size="sm" color={theme.colors['muted-foreground']} />
              <Text style={styles.statText}>
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </Text>
            </View>

            <View style={styles.stat}>
              <Icon icon={Check} size="sm" color={theme.colors['muted-foreground']} />
              <Text style={styles.statText}>
                {completedCount}/{itemCount} done
              </Text>
            </View>
          </View>
        </View>

        {/* Status Badge */}
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {lastUpdated && <Text style={styles.lastUpdated}>{lastUpdated}</Text>}
        {totalValue && <Text style={styles.totalValue}>{totalValue}</Text>}
      </View>
    </CardContainer>
  );
}
