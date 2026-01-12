/**
 * UserInputCard Component
 *
 * Displays a single user input with text, tags, and timestamp.
 */

import React, { type ReactElement } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { UserInput } from '@domain/inbox/entities';
import { Badge, Text } from '@design-system/atoms';
import { useTheme } from '@design-system/theme';

export interface UserInputCardProps {
  /**
   * The user input to display
   */
  input: UserInput;

  /**
   * Callback when the card is pressed
   */
  onPress?: () => void;

  /**
   * Callback when the card is long pressed (for context menu)
   */
  onLongPress?: () => void;
}

export function UserInputCard({ input, onPress, onLongPress }: UserInputCardProps): ReactElement {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const formattedTime = input.createdAt.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      delayLongPress={500}
    >
      <Text style={styles.text}>{input.text}</Text>

      {input.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {input.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              <Text style={styles.tagText}>#{tag.name}</Text>
            </Badge>
          ))}
        </View>
      )}

      <Text style={styles.timeText}>{formattedTime}</Text>
    </Pressable>
  );
}

const createStyles = (theme: typeof import('@design-system/theme/theme').darkTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radii.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    pressed: {
      opacity: 0.8,
    },
    text: {
      fontSize: theme.typography.sizes.base,
      fontFamily: theme.typography.families.body,
      color: theme.colors.foreground,
      marginBottom: theme.spacing.sm,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    tagText: {
      fontSize: theme.typography.sizes.xs,
      fontFamily: theme.typography.families.body,
      color: theme.colors.primary,
    },
    timeText: {
      fontSize: theme.typography.sizes.xs,
      fontFamily: theme.typography.families.body,
      color: theme.colors.mutedForeground,
    },
  });
