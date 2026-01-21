/**
 * SortingControls Molecule Component
 *
 * Controls for changing sort/group options in list views.
 * Used in Inbox, Notes, Lists screens.
 */

import React, { type ReactElement, useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { ArrowDown, ArrowUp } from 'lucide-react-native';

import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createSortingControlsStyles } from './SortingControls.styles';
import type { SortingControlsProps, SortOption } from './SortingControls.types';

export function SortingControls<T extends string = string>({
  options,
  selectedValue,
  sortDirection,
  onSortChange,
  onDirectionToggle,
  label = 'Ordenar por',
  disabled = false,
  style,
  ...viewProps
}: SortingControlsProps<T>): ReactElement {
  const { theme } = useTheme();
  const styles = createSortingControlsStyles(theme);

  const handleOptionPress = useCallback(
    (option: SortOption<T>) => {
      if (!disabled && option.value !== selectedValue) {
        onSortChange(option.value);
      }
    },
    [disabled, selectedValue, onSortChange],
  );

  const handleDirectionToggle = useCallback(() => {
    if (!disabled) {
      onDirectionToggle();
    }
  }, [disabled, onDirectionToggle]);

  return (
    <View style={[styles.container, style]} {...viewProps}>
      <View style={styles.leftSection}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.optionsContainer}>
          {options.map((option) => {
            const isSelected = option.value === selectedValue;
            return (
              <Pressable
                key={option.value}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                  disabled && styles.optionButtonDisabled,
                ]}
                onPress={() => handleOptionPress(option)}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected, disabled }}
                accessibilityLabel={`Sort by ${option.label}`}
              >
                {option.icon && (
                  <Icon
                    icon={option.icon}
                    size="sm"
                    color={isSelected ? theme.colors.primaryForeground : theme.colors.foreground}
                  />
                )}
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable
        style={[styles.directionButton, disabled && styles.directionButtonDisabled]}
        onPress={handleDirectionToggle}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`Sort direction: ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
      >
        <Icon
          icon={sortDirection === 'asc' ? ArrowUp : ArrowDown}
          size="sm"
          color={theme.colors.foreground}
        />
      </Pressable>
    </View>
  );
}
