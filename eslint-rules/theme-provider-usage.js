/**
 * ESLint custom rule: theme-provider-usage
 *
 * Enforces that design system components use useTheme() hook
 * instead of directly importing theme objects.
 *
 * Only applies to component files (atoms, molecules, organisms, templates)
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce useTheme() hook usage in design system components',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      directThemeImport:
        'Do not import theme directly. Use useTheme() hook instead for dynamic theme switching',
      missingUseTheme: 'Component should use useTheme() hook to access theme tokens',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Only apply to component files in design system
    const isComponent =
      filename.includes('src/design-system/') &&
      (filename.includes('/atoms/') ||
        filename.includes('/molecules/') ||
        filename.includes('/organisms/') ||
        filename.includes('/templates/'));

    if (!isComponent) return {};

    // Skip test files and story files
    if (
      filename.endsWith('.test.tsx') ||
      filename.endsWith('.test.ts') ||
      filename.endsWith('.stories.tsx') ||
      filename.endsWith('.stories.ts') ||
      filename.endsWith('.types.ts')
    ) {
      return {};
    }

    let hasDirectThemeImport = false;
    let hasUseThemeImport = false;

    function checkImport(node) {
      const importPath = node.source.value;

      // Check for direct theme import
      if (
        importPath.includes('/theme/theme') ||
        importPath.includes('@design-system/theme/theme')
      ) {
        const specifiers = node.specifiers || [];
        const imports = specifiers
          .map((s) => {
            if (s.type === 'ImportSpecifier') return s.imported.name;
            if (s.type === 'ImportDefaultSpecifier') return 'default';
            return null;
          })
          .filter(Boolean);

        // Allow importing types but not actual theme objects
        const hasThemeImport = imports.some(
          (imp) => imp === 'darkTheme' || imp === 'lightTheme' || imp === 'default',
        );

        if (hasThemeImport) {
          hasDirectThemeImport = true;
          context.report({
            node,
            messageId: 'directThemeImport',
          });
        }
      }

      // Check for useTheme import
      if (importPath.includes('/theme') || importPath.includes('@design-system/theme')) {
        const specifiers = node.specifiers || [];
        const hasUseTheme = specifiers.some(
          (s) => s.type === 'ImportSpecifier' && s.imported.name === 'useTheme',
        );
        if (hasUseTheme) {
          hasUseThemeImport = true;
        }
      }
    }

    return {
      ImportDeclaration: checkImport,
      'Program:exit'(node) {
        // Only warn if component doesn't use useTheme (unless it's a types file)
        if (!hasUseThemeImport && !hasDirectThemeImport && !filename.endsWith('.types.ts')) {
          // Check if file actually uses style objects (heuristic: has StyleSheet or style props)
          const sourceCode = context.getSourceCode();
          const text = sourceCode.getText();

          const hasStyles =
            text.includes('StyleSheet') || text.includes('style=') || text.includes('styles.');

          if (hasStyles && !text.includes('useTheme')) {
            context.report({
              node,
              messageId: 'missingUseTheme',
            });
          }
        }
      },
    };
  },
};
