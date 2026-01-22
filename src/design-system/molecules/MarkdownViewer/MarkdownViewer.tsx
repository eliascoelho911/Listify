/**
 * MarkdownViewer Molecule Component
 *
 * Renders markdown content in read-only mode.
 * Supports: headers (h1-h3), bold, italic, strikethrough, inline code,
 * links, unordered lists, ordered lists, blockquotes, code blocks, and horizontal rules.
 */

import React, { type ReactElement, useCallback, useMemo } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

import { useTheme } from '../../theme';
import { createMarkdownViewerStyles } from './MarkdownViewer.styles';
import type { MarkdownViewerProps } from './MarkdownViewer.types';

type MarkdownNode =
  | { type: 'paragraph'; content: InlineNode[] }
  | { type: 'h1' | 'h2' | 'h3'; content: InlineNode[] }
  | { type: 'ul'; items: InlineNode[][] }
  | { type: 'ol'; items: InlineNode[][] }
  | { type: 'blockquote'; content: InlineNode[] }
  | { type: 'codeBlock'; content: string }
  | { type: 'hr' };

type InlineNode =
  | { type: 'text'; content: string }
  | { type: 'bold'; content: string }
  | { type: 'italic'; content: string }
  | { type: 'strikethrough'; content: string }
  | { type: 'code'; content: string }
  | { type: 'link'; text: string; url: string };

function parseInlineMarkdown(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Check for bold (**text** or __text__)
    const boldMatch = remaining.match(/^\*\*(.+?)\*\*|^__(.+?)__/);
    if (boldMatch) {
      nodes.push({ type: 'bold', content: boldMatch[1] || boldMatch[2] });
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Check for italic (*text* or _text_)
    const italicMatch = remaining.match(/^\*([^*]+?)\*|^_([^_]+?)_/);
    if (italicMatch) {
      nodes.push({ type: 'italic', content: italicMatch[1] || italicMatch[2] });
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Check for strikethrough (~~text~~)
    const strikeMatch = remaining.match(/^~~(.+?)~~/);
    if (strikeMatch) {
      nodes.push({ type: 'strikethrough', content: strikeMatch[1] });
      remaining = remaining.slice(strikeMatch[0].length);
      continue;
    }

    // Check for inline code (`code`)
    const codeMatch = remaining.match(/^`([^`]+?)`/);
    if (codeMatch) {
      nodes.push({ type: 'code', content: codeMatch[1] });
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Check for links ([text](url))
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      nodes.push({ type: 'link', text: linkMatch[1], url: linkMatch[2] });
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Find next special character or take rest as plain text
    const nextSpecial = remaining.search(/[*_~`\[]/);
    if (nextSpecial === -1) {
      nodes.push({ type: 'text', content: remaining });
      break;
    } else if (nextSpecial === 0) {
      // Special char but didn't match any pattern, treat as text
      nodes.push({ type: 'text', content: remaining[0] });
      remaining = remaining.slice(1);
    } else {
      nodes.push({ type: 'text', content: remaining.slice(0, nextSpecial) });
      remaining = remaining.slice(nextSpecial);
    }
  }

  return nodes;
}

function parseMarkdown(content: string): MarkdownNode[] {
  const lines = content.split('\n');
  const nodes: MarkdownNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Empty line - skip
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Horizontal rule (---, ***, ___)
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      nodes.push({ type: 'hr' });
      i++;
      continue;
    }

    // Headers
    const h1Match = line.match(/^# (.+)$/);
    if (h1Match) {
      nodes.push({ type: 'h1', content: parseInlineMarkdown(h1Match[1]) });
      i++;
      continue;
    }

    const h2Match = line.match(/^## (.+)$/);
    if (h2Match) {
      nodes.push({ type: 'h2', content: parseInlineMarkdown(h2Match[1]) });
      i++;
      continue;
    }

    const h3Match = line.match(/^### (.+)$/);
    if (h3Match) {
      nodes.push({ type: 'h3', content: parseInlineMarkdown(h3Match[1]) });
      i++;
      continue;
    }

    // Code block (```)
    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      nodes.push({ type: 'codeBlock', content: codeLines.join('\n') });
      i++; // Skip closing ```
      continue;
    }

    // Blockquote (>)
    if (line.startsWith('>')) {
      const quoteText = line.slice(1).trim();
      nodes.push({ type: 'blockquote', content: parseInlineMarkdown(quoteText) });
      i++;
      continue;
    }

    // Unordered list (- or *)
    if (/^[-*] /.test(line)) {
      const items: InlineNode[][] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        const itemText = lines[i].slice(2);
        items.push(parseInlineMarkdown(itemText));
        i++;
      }
      nodes.push({ type: 'ul', items });
      continue;
    }

    // Ordered list (1., 2., etc.)
    if (/^\d+\. /.test(line)) {
      const items: InlineNode[][] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        const itemText = lines[i].replace(/^\d+\. /, '');
        items.push(parseInlineMarkdown(itemText));
        i++;
      }
      nodes.push({ type: 'ol', items });
      continue;
    }

    // Regular paragraph
    nodes.push({ type: 'paragraph', content: parseInlineMarkdown(line) });
    i++;
  }

  return nodes;
}

export function MarkdownViewer({
  content,
  maxLines = 0,
  textStyle,
  style,
  onLinkPress,
  ...viewProps
}: MarkdownViewerProps): ReactElement {
  const { theme } = useTheme();
  const styles = createMarkdownViewerStyles(theme);

  const handleLinkPress = useCallback(
    (url: string) => {
      if (onLinkPress) {
        onLinkPress(url);
      } else {
        Linking.openURL(url).catch((err) => {
          console.debug('[MarkdownViewer] Failed to open link:', err);
        });
      }
    },
    [onLinkPress],
  );

  const nodes = useMemo(() => parseMarkdown(content), [content]);

  const renderInlineNodes = useCallback(
    (inlineNodes: InlineNode[], key: string): ReactElement => (
      <Text key={key} style={[styles.text, textStyle]}>
        {inlineNodes.map((node, idx) => {
          const nodeKey = `${key}-${idx}`;
          switch (node.type) {
            case 'text':
              return <Text key={nodeKey}>{node.content}</Text>;
            case 'bold':
              return (
                <Text key={nodeKey} style={styles.bold}>
                  {node.content}
                </Text>
              );
            case 'italic':
              return (
                <Text key={nodeKey} style={styles.italic}>
                  {node.content}
                </Text>
              );
            case 'strikethrough':
              return (
                <Text key={nodeKey} style={styles.strikethrough}>
                  {node.content}
                </Text>
              );
            case 'code':
              return (
                <Text key={nodeKey} style={styles.code}>
                  {node.content}
                </Text>
              );
            case 'link':
              return (
                <Text
                  key={nodeKey}
                  style={styles.link}
                  onPress={() => handleLinkPress(node.url)}
                  accessibilityRole="link"
                >
                  {node.text}
                </Text>
              );
            default:
              return null;
          }
        })}
      </Text>
    ),
    [styles, textStyle, handleLinkPress],
  );

  const renderNode = useCallback(
    (node: MarkdownNode, index: number): ReactElement | null => {
      const key = `node-${index}`;
      switch (node.type) {
        case 'paragraph':
          return (
            <View key={key} style={styles.paragraph}>
              {renderInlineNodes(node.content, key)}
            </View>
          );

        case 'h1':
          return (
            <Text key={key} style={styles.h1}>
              {node.content.map((n, i) =>
                n.type === 'text' ? n.content : renderInlineNodes([n], `${key}-${i}`),
              )}
            </Text>
          );

        case 'h2':
          return (
            <Text key={key} style={styles.h2}>
              {node.content.map((n, i) =>
                n.type === 'text' ? n.content : renderInlineNodes([n], `${key}-${i}`),
              )}
            </Text>
          );

        case 'h3':
          return (
            <Text key={key} style={styles.h3}>
              {node.content.map((n, i) =>
                n.type === 'text' ? n.content : renderInlineNodes([n], `${key}-${i}`),
              )}
            </Text>
          );

        case 'ul':
          return (
            <View key={key}>
              {node.items.map((item, idx) => (
                <View key={`${key}-item-${idx}`} style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <View style={styles.listContent}>
                    {renderInlineNodes(item, `${key}-item-${idx}`)}
                  </View>
                </View>
              ))}
            </View>
          );

        case 'ol':
          return (
            <View key={key}>
              {node.items.map((item, idx) => (
                <View key={`${key}-item-${idx}`} style={styles.listItem}>
                  <Text style={styles.listBullet}>{idx + 1}.</Text>
                  <View style={styles.listContent}>
                    {renderInlineNodes(item, `${key}-item-${idx}`)}
                  </View>
                </View>
              ))}
            </View>
          );

        case 'blockquote':
          return (
            <View key={key} style={styles.blockquote}>
              <Text style={[styles.text, styles.blockquoteText, textStyle]}>
                {node.content.map((n, i) =>
                  n.type === 'text' ? n.content : renderInlineNodes([n], `${key}-${i}`),
                )}
              </Text>
            </View>
          );

        case 'codeBlock':
          return (
            <View key={key} style={styles.codeBlock}>
              <Text style={styles.codeBlockText}>{node.content}</Text>
            </View>
          );

        case 'hr':
          return <View key={key} style={styles.horizontalRule} />;

        default:
          return null;
      }
    },
    [styles, textStyle, renderInlineNodes],
  );

  // Apply maxLines if specified (simplified - just limit nodes for now)
  const displayNodes = maxLines > 0 ? nodes.slice(0, maxLines) : nodes;

  return (
    <View style={[styles.container, style]} {...viewProps}>
      {displayNodes.map(renderNode)}
    </View>
  );
}
