/**
 * InlineHighlight Molecule Component
 *
 * Renders text with colored highlights for different segments (list, section, price, quantity).
 * Used in the SmartInputModal to show parsed elements inline.
 */

import React, { type ReactElement, useMemo } from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../../theme';
import { createInlineHighlightStyles, type InlineHighlightStyles } from './InlineHighlight.styles';
import type { HighlightSegment, HighlightType, InlineHighlightProps } from './InlineHighlight.types';

interface TextSegment {
  text: string;
  highlight?: HighlightType;
}

function getHighlightStyle(
  type: HighlightType,
  styles: InlineHighlightStyles
): InlineHighlightStyles['highlightList'] {
  switch (type) {
    case 'list':
      return styles.highlightList;
    case 'section':
      return styles.highlightSection;
    case 'price':
      return styles.highlightPrice;
    case 'quantity':
      return styles.highlightQuantity;
    default:
      return styles.highlightList;
  }
}

function buildSegments(text: string, highlights: HighlightSegment[]): TextSegment[] {
  if (highlights.length === 0) {
    return [{ text }];
  }

  // Sort highlights by start position
  const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
  const segments: TextSegment[] = [];
  let currentIndex = 0;

  for (const highlight of sortedHighlights) {
    // Add normal text before this highlight
    if (currentIndex < highlight.start) {
      const normalText = text.slice(currentIndex, highlight.start);
      if (normalText) {
        segments.push({ text: normalText });
      }
    }

    // Add highlighted text
    segments.push({
      text: highlight.value,
      highlight: highlight.type,
    });

    currentIndex = highlight.end;
  }

  // Add remaining text after last highlight
  if (currentIndex < text.length) {
    const remainingText = text.slice(currentIndex);
    if (remainingText) {
      segments.push({ text: remainingText });
    }
  }

  return segments;
}

export function InlineHighlight({
  text,
  highlights,
  style,
  textStyle,
  selectable = false,
  ...viewProps
}: InlineHighlightProps): ReactElement {
  const { theme } = useTheme();
  const styles = createInlineHighlightStyles(theme);

  const segments = useMemo(() => buildSegments(text, highlights), [text, highlights]);

  return (
    <View style={[styles.container, style]} {...viewProps}>
      <Text selectable={selectable}>
        {segments.map((segment, index) => (
          <Text
            key={`${index}-${segment.text}`}
            style={[
              styles.baseText,
              textStyle,
              segment.highlight && getHighlightStyle(segment.highlight, styles),
            ]}
          >
            {segment.text}
          </Text>
        ))}
      </Text>
    </View>
  );
}
