/**
 * ColorPicker Molecule Component
 *
 * A grid of color swatches for selecting a primary/accent color.
 * Displays predefined colors as circular buttons with selection indicator.
 */

import React, { type ReactElement, useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { Icon } from '../../atoms/Icon/Icon';
import { useTheme } from '../../theme';
import { createColorPickerStyles } from './ColorPicker.styles';
import type { ColorOption, ColorPickerProps } from './ColorPicker.types';

/**
 * Determines if white or black icon provides better contrast
 * Note: These are contrast colors for accessibility, not theme tokens
 */
function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance (simplified)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // eslint-disable-next-line local-rules/no-hardcoded-values -- Contrast colors for accessibility
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function ColorPicker({
  colors,
  selectedColor,
  onSelect,
  style,
  testID,
}: ColorPickerProps): ReactElement {
  const { theme } = useTheme();
  const styles = createColorPickerStyles(theme);

  const renderSwatch = useCallback(
    (colorOption: ColorOption) => {
      const isSelected = selectedColor === colorOption.value;
      const contrastColor = getContrastColor(colorOption.value);

      return (
        <Pressable
          key={colorOption.value}
          style={[styles.swatch, isSelected && styles.swatchSelected]}
          onPress={() => onSelect(colorOption.value)}
          accessibilityRole="radio"
          accessibilityState={{ selected: isSelected }}
          accessibilityLabel={colorOption.label}
          testID={testID ? `${testID}-${colorOption.value.replace('#', '')}` : undefined}
        >
          <View style={[styles.swatchInner, { backgroundColor: colorOption.value }]}>
            {isSelected && (
              <View style={styles.checkmark}>
                <Icon icon={Check} size="sm" color={contrastColor} />
              </View>
            )}
          </View>
        </Pressable>
      );
    },
    [selectedColor, onSelect, styles, testID],
  );

  return (
    <View style={[styles.container, style]} testID={testID} accessibilityRole="radiogroup">
      {colors.map(renderSwatch)}
    </View>
  );
}
