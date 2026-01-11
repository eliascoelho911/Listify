/**
 * ESLint Rule: no-raw-text-import
 *
 * Disallows importing Text directly from react-native.
 * Use Text from @design-system/atoms instead.
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow importing Text directly from react-native',
    },
    messages: {
      noRawText: 'Use Text from @design-system/atoms instead of react-native',
    },
  },
  create(context) {
    const filename = context.getFilename();

    // Allow in the Text component implementation itself
    if (filename.includes('design-system/atoms/Text/')) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value === 'react-native') {
          const textImport = node.specifiers.find(
            (spec) => spec.type === 'ImportSpecifier' && spec.imported.name === 'Text',
          );
          if (textImport) {
            context.report({ node: textImport, messageId: 'noRawText' });
          }
        }
      },
    };
  },
};
