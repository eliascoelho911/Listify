/**
 * SectionAddButton Atom Component
 *
 * A small button for adding a new section to a list.
 */

import React, { type ReactElement, useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FolderPlus } from 'lucide-react-native';

import { Icon } from '../Icon/Icon';
import { Text } from '../Text/Text';
import { useTheme } from '../../theme';
import { createSectionAddButtonStyles } from './SectionAddButton.styles';
import type { SectionAddButtonProps } from './SectionAddButton.types';

export function SectionAddButton({
  onPress,
  label,
  disabled = false,
  testID,
  ...viewProps
}: SectionAddButtonProps): ReactElement {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = createSectionAddButtonStyles(theme, disabled);

  const handlePress = useCallback(() => {
    if (!disabled) {
      onPress?.();
    }
  }, [disabled, onPress]);

  const buttonLabel = label ?? t('sections.addSection', 'Add Section');

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && !disabled && styles.pressed]}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={buttonLabel}
      accessibilityState={{ disabled }}
      testID={testID}
      {...viewProps}
    >
      <View style={styles.icon}>
        <Icon icon={FolderPlus} size="sm" color={theme.colors.mutedForeground} />
      </View>
      <Text style={styles.label}>{buttonLabel}</Text>
    </Pressable>
  );
}
