/**
 * ParsePreview Molecule Component
 *
 * Displays parsed elements (list, section, price, quantity) as colored chips.
 * Used in SmartInputModal to show what was extracted from user input.
 */

import React, { type ReactElement } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '../../atoms/Text/Text';
import { useTheme } from '../../theme';
import { createParsePreviewStyles, type ParsePreviewStyles } from './ParsePreview.styles';
import type { ParsedElement, ParsePreviewProps } from './ParsePreview.types';

const TYPE_LABELS: Record<ParsedElement['type'], string> = {
  list: 'Lista',
  section: 'Seção',
  price: 'Preço',
  quantity: 'Qtd',
};

function getChipStyle(type: ParsedElement['type'], styles: ParsePreviewStyles) {
  switch (type) {
    case 'list':
      return styles.chipList;
    case 'section':
      return styles.chipSection;
    case 'price':
      return styles.chipPrice;
    case 'quantity':
      return styles.chipQuantity;
    default:
      return styles.chipList;
  }
}

function getValueStyle(type: ParsedElement['type'], styles: ParsePreviewStyles) {
  switch (type) {
    case 'list':
      return styles.valueList;
    case 'section':
      return styles.valueSection;
    case 'price':
      return styles.valuePrice;
    case 'quantity':
      return styles.valueQuantity;
    default:
      return styles.valueList;
  }
}

export function ParsePreview({
  elements,
  style,
  onElementPress,
  showLabels = false,
  ...viewProps
}: ParsePreviewProps): ReactElement {
  const { theme } = useTheme();
  const styles = createParsePreviewStyles(theme);

  if (elements.length === 0) {
    return <View style={[styles.container, style]} {...viewProps} />;
  }

  return (
    <View style={[styles.container, style]} {...viewProps}>
      {elements.map((element, index) => {
        const chipStyle = [styles.chip, getChipStyle(element.type, styles)];
        const valueStyle = getValueStyle(element.type, styles);
        const label = element.label ?? TYPE_LABELS[element.type];

        const chipContent = (
          <>
            {showLabels && <Text style={styles.label}>{label}:</Text>}
            <Text style={valueStyle}>{element.value}</Text>
          </>
        );

        if (onElementPress) {
          return (
            <Pressable
              key={`${element.type}-${index}`}
              style={chipStyle}
              onPress={() => onElementPress(element)}
              accessibilityRole="button"
              accessibilityLabel={`${label}: ${element.value}`}
            >
              {chipContent}
            </Pressable>
          );
        }

        return (
          <View
            key={`${element.type}-${index}`}
            style={chipStyle}
            accessibilityLabel={`${label}: ${element.value}`}
          >
            {chipContent}
          </View>
        );
      })}
    </View>
  );
}
