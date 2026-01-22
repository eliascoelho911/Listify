/**
 * ThemeSelector Molecule Component
 *
 * Allows users to select between light, dark, and auto (system) theme modes.
 * Displays options in a radio-group style with icons and descriptions.
 */

import React, { type ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { Check, type LucideIcon, Moon, Smartphone, Sun } from 'lucide-react-native';

import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createThemeSelectorStyles } from './ThemeSelector.styles';
import type { ThemeOption, ThemeSelectorProps } from './ThemeSelector.types';

const THEME_ICONS: Record<ThemeOption, LucideIcon> = {
  light: Sun,
  dark: Moon,
  auto: Smartphone,
};

const THEME_ORDER: ThemeOption[] = ['light', 'dark', 'auto'];

export function ThemeSelector({
  selectedTheme,
  onSelect,
  style,
  testID,
}: ThemeSelectorProps): ReactElement {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const renderOption = useCallback(
    (themeOption: ThemeOption) => {
      const icon = THEME_ICONS[themeOption];
      const label = t(`settings.theme.options.${themeOption}`);
      const description = t(`settings.theme.descriptions.${themeOption}`);
      const isSelected = selectedTheme === themeOption;
      const styles = createThemeSelectorStyles(theme, isSelected);

      return (
        <Pressable
          key={themeOption}
          style={[styles.option, isSelected && styles.optionSelected]}
          onPress={() => onSelect(themeOption)}
          accessibilityRole="radio"
          accessibilityState={{ selected: isSelected }}
          accessibilityLabel={`${label}, ${description}`}
          testID={testID ? `${testID}-${themeOption}` : undefined}
        >
          <View style={styles.iconContainer}>
            <Icon
              icon={icon}
              size="md"
              color={isSelected ? theme.colors.primary : theme.colors.mutedForeground}
            />
          </View>
          <View style={styles.content}>
            <Text style={[styles.label, isSelected && styles.labelSelected]}>{label}</Text>
            <Text style={[styles.description, isSelected && styles.descriptionSelected]}>
              {description}
            </Text>
          </View>
          {isSelected && (
            <View style={styles.checkmark}>
              <Icon icon={Check} size="sm" color={theme.colors.primary} />
            </View>
          )}
        </Pressable>
      );
    },
    [selectedTheme, onSelect, theme, testID, t],
  );

  const baseStyles = createThemeSelectorStyles(theme, false);

  return (
    <View style={[baseStyles.container, style]} testID={testID} accessibilityRole="radiogroup">
      {THEME_ORDER.map(renderOption)}
    </View>
  );
}
