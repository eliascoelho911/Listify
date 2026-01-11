/**
 * ESLint custom rule: no-hardcoded-values
 *
 * Enforces that design system components use tokens instead of hard-coded values.
 * Detects:
 * - Hard-coded color values (hex, rgb, rgba, hsl, hsla, named colors)
 * - Hard-coded spacing values (numbers in px/rem/em)
 * - Hard-coded font sizes
 * - Hard-coded border radius values
 *
 * Only applies to files within src/design-system/
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hard-coded values in design system components',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      hardcodedColor:
        'Hard-coded color value detected. Use theme tokens instead (e.g., theme.colors.primary)',
      hardcodedSpacing:
        'Hard-coded spacing value detected. Use spacing tokens instead (e.g., theme.spacing.md)',
      hardcodedFontSize:
        'Hard-coded font size detected. Use typography tokens instead (e.g., theme.typography.sizes.md)',
      hardcodedRadius:
        'Hard-coded border radius detected. Use radius tokens instead (e.g., theme.radii.lg)',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Only apply to files in src/design-system/
    if (!filename.includes('src/design-system/')) {
      return {};
    }

    // Skip token definition files
    if (
      filename.includes('src/design-system/tokens/') ||
      filename.includes('src/design-system/theme/theme.ts')
    ) {
      return {};
    }

    const colorPatterns = [
      /#[0-9a-fA-F]{3,8}\b/, // Hex colors
      /\brgb\(/, // rgb()
      /\brgba\(/, // rgba()
      /\bhsl\(/, // hsl()
      /\bhsla\(/, // hsla()
    ];

    const namedColors = [
      'black',
      'white',
      'red',
      'blue',
      'green',
      'yellow',
      'purple',
      'pink',
      'orange',
      'gray',
      'grey',
      'brown',
      'cyan',
      'magenta',
      'transparent',
    ];

    const spacingPattern = /\b\d+(?:px|rem|em)\b/;

    function checkLiteral(node) {
      const value = node.value;

      if (typeof value === 'string') {
        // Check for color values
        for (const pattern of colorPatterns) {
          if (pattern.test(value)) {
            context.report({
              node,
              messageId: 'hardcodedColor',
            });
            return;
          }
        }

        // Check for named colors (only if the string is exactly a color name)
        if (namedColors.includes(value.toLowerCase())) {
          context.report({
            node,
            messageId: 'hardcodedColor',
          });
          return;
        }

        // Check for spacing values
        if (spacingPattern.test(value)) {
          context.report({
            node,
            messageId: 'hardcodedSpacing',
          });
        }
      }
    }

    function checkProperty(node) {
      if (!node.key || !node.value) return;

      const key = node.key.name || node.key.value;
      const valueNode = node.value;

      // Check fontSize property
      if (
        key === 'fontSize' &&
        valueNode.type === 'Literal' &&
        typeof valueNode.value === 'number'
      ) {
        context.report({
          node: valueNode,
          messageId: 'hardcodedFontSize',
        });
      }

      // Check borderRadius property
      if (
        (key === 'borderRadius' ||
          key === 'borderTopLeftRadius' ||
          key === 'borderTopRightRadius' ||
          key === 'borderBottomLeftRadius' ||
          key === 'borderBottomRightRadius') &&
        valueNode.type === 'Literal' &&
        typeof valueNode.value === 'number'
      ) {
        context.report({
          node: valueNode,
          messageId: 'hardcodedRadius',
        });
      }

      // Check color properties
      const colorProps = ['color', 'backgroundColor', 'borderColor', 'shadowColor'];
      if (colorProps.includes(key) && valueNode.type === 'Literal') {
        checkLiteral(valueNode);
      }
    }

    return {
      Literal: checkLiteral,
      Property: checkProperty,
    };
  },
};
