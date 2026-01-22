/**
 * MarkdownEditor Molecule Component
 *
 * A simple markdown editor with optional formatting toolbar.
 * Uses monospace font for better markdown editing experience.
 */

import React, { type ReactElement, useCallback, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import {
  Bold,
  Code,
  Heading,
  Italic,
  Link,
  List,
  Strikethrough,
} from 'lucide-react-native';

import { Icon } from '../../atoms/Icon/Icon';
import { useTheme } from '../../theme';
import { createMarkdownEditorStyles } from './MarkdownEditor.styles';
import type { MarkdownEditorProps, MarkdownFormatAction } from './MarkdownEditor.types';

interface Selection {
  start: number;
  end: number;
}

function insertFormat(
  text: string,
  selection: Selection,
  wrapper: string,
  prefix?: string,
): { newText: string; newSelection: Selection } {
  const { start, end } = selection;
  const selectedText = text.slice(start, end);
  const hasSelection = start !== end;

  if (prefix) {
    // Line-based formatting (lists, headers)
    const beforeLine = text.lastIndexOf('\n', start - 1) + 1;
    const lineStart = text.slice(beforeLine, start);
    const fullPrefix = prefix + ' ';

    if (lineStart.startsWith(fullPrefix)) {
      // Remove prefix if already present
      const newText = text.slice(0, beforeLine) + text.slice(beforeLine + fullPrefix.length);
      return {
        newText,
        newSelection: { start: start - fullPrefix.length, end: end - fullPrefix.length },
      };
    }

    // Add prefix
    const newText = text.slice(0, beforeLine) + fullPrefix + text.slice(beforeLine);
    return {
      newText,
      newSelection: { start: start + fullPrefix.length, end: end + fullPrefix.length },
    };
  }

  // Inline formatting
  if (hasSelection) {
    const newText = text.slice(0, start) + wrapper + selectedText + wrapper + text.slice(end);
    return {
      newText,
      newSelection: {
        start: start + wrapper.length,
        end: end + wrapper.length,
      },
    };
  }

  // No selection - insert wrapper pair and position cursor in middle
  const newText = text.slice(0, start) + wrapper + wrapper + text.slice(start);
  return {
    newText,
    newSelection: {
      start: start + wrapper.length,
      end: start + wrapper.length,
    },
  };
}

function insertLink(
  text: string,
  selection: Selection,
): { newText: string; newSelection: Selection } {
  const { start, end } = selection;
  const selectedText = text.slice(start, end);
  const hasSelection = start !== end;

  if (hasSelection) {
    const newText = text.slice(0, start) + '[' + selectedText + '](url)' + text.slice(end);
    return {
      newText,
      newSelection: {
        start: end + 3, // Position at 'url'
        end: end + 6,
      },
    };
  }

  const newText = text.slice(0, start) + '[text](url)' + text.slice(start);
  return {
    newText,
    newSelection: {
      start: start + 1, // Position at 'text'
      end: start + 5,
    },
  };
}

export function MarkdownEditor({
  value,
  onChangeText,
  placeholder = 'Start writing...',
  editable = true,
  autoFocus = false,
  minHeight = 200,
  showToolbar = true,
  textStyle,
  style,
  onBlur,
  onFocus,
  ...viewProps
}: MarkdownEditorProps): ReactElement {
  const { theme } = useTheme();
  const styles = createMarkdownEditorStyles(theme, minHeight);
  const inputRef = useRef<TextInput>(null);
  const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 });

  const handleFormat = useCallback(
    (action: MarkdownFormatAction) => {
      let result: { newText: string; newSelection: Selection };

      switch (action) {
        case 'bold':
          result = insertFormat(value, selection, '**');
          break;
        case 'italic':
          result = insertFormat(value, selection, '*');
          break;
        case 'strikethrough':
          result = insertFormat(value, selection, '~~');
          break;
        case 'code':
          result = insertFormat(value, selection, '`');
          break;
        case 'link':
          result = insertLink(value, selection);
          break;
        case 'list':
          result = insertFormat(value, selection, '', '-');
          break;
        case 'heading':
          result = insertFormat(value, selection, '', '##');
          break;
        default:
          return;
      }

      onChangeText(result.newText);
      // Note: Selection update is best-effort due to React Native TextInput limitations
      setTimeout(() => {
        inputRef.current?.setNativeProps({ selection: result.newSelection });
      }, 0);
    },
    [value, selection, onChangeText],
  );

  const handleSelectionChange = useCallback(
    (event: { nativeEvent: { selection: Selection } }) => {
      setSelection(event.nativeEvent.selection);
    },
    [],
  );

  const toolbarButtons: Array<{ action: MarkdownFormatAction; icon: typeof Bold }> = [
    { action: 'bold', icon: Bold },
    { action: 'italic', icon: Italic },
    { action: 'strikethrough', icon: Strikethrough },
    { action: 'code', icon: Code },
    { action: 'link', icon: Link },
    { action: 'list', icon: List },
    { action: 'heading', icon: Heading },
  ];

  return (
    <View style={[styles.container, style]} {...viewProps}>
      {showToolbar && editable && (
        <View style={styles.toolbar}>
          {toolbarButtons.map((button, index) => (
            <React.Fragment key={button.action}>
              {index === 4 && <View style={styles.toolbarSeparator} />}
              <Pressable
                style={({ pressed }) => [
                  styles.toolbarButton,
                  pressed && styles.toolbarButtonPressed,
                ]}
                onPress={() => handleFormat(button.action)}
                accessibilityLabel={`Format ${button.action}`}
                accessibilityRole="button"
              >
                <Icon
                  icon={button.icon}
                  size="sm"
                  color={theme.colors.mutedForeground}
                />
              </Pressable>
            </React.Fragment>
          ))}
        </View>
      )}

      <View style={styles.editorContainer}>
        <TextInput
          ref={inputRef}
          style={[styles.textInput, textStyle]}
          value={value}
          onChangeText={onChangeText}
          onSelectionChange={handleSelectionChange}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.mutedForeground}
          multiline
          editable={editable}
          autoFocus={autoFocus}
          textAlignVertical="top"
          onBlur={onBlur}
          onFocus={onFocus}
          autoCapitalize="sentences"
          autoCorrect
        />
      </View>
    </View>
  );
}
