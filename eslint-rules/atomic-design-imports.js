/**
 * ESLint custom rule: atomic-design-imports
 *
 * Enforces Atomic Design hierarchy in imports:
 * - Atoms can only import tokens and theme
 * - Molecules can only import atoms, tokens, and theme
 * - Organisms can only import atoms, molecules, tokens, and theme
 * - Templates can only import organisms, molecules, atoms, tokens, and theme
 * - Pages can import anything
 *
 * Only applies to files within src/design-system/
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce Atomic Design import hierarchy',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      invalidAtomImport:
        'Atoms can only import from tokens or theme. Found import from {{imported}}',
      invalidMoleculeImport:
        'Molecules can only import from atoms, tokens, or theme. Found import from {{imported}}',
      invalidOrganismImport:
        'Organisms can only import from atoms, molecules, tokens, or theme. Found import from {{imported}}',
      invalidTemplateImport:
        'Templates can only import from organisms, molecules, atoms, tokens, or theme. Found import from {{imported}}',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Only apply to files in src/design-system/
    if (!filename.includes('src/design-system/')) {
      return {};
    }

    // Determine component level from file path
    let componentLevel = null;
    if (filename.includes('/atoms/')) componentLevel = 'atom';
    else if (filename.includes('/molecules/')) componentLevel = 'molecule';
    else if (filename.includes('/organisms/')) componentLevel = 'organism';
    else if (filename.includes('/templates/')) componentLevel = 'template';
    else if (filename.includes('/pages/')) componentLevel = 'page';

    // Skip if not in a component directory
    if (!componentLevel) return {};

    // Pages can import anything
    if (componentLevel === 'page') return {};

    const allowedImports = {
      atom: ['tokens', 'theme', 'utils'],
      molecule: ['atoms', 'tokens', 'theme', 'utils'],
      organism: ['atoms', 'molecules', 'tokens', 'theme', 'utils'],
      template: ['atoms', 'molecules', 'organisms', 'tokens', 'theme', 'utils'],
    };

    function getImportLevel(importPath) {
      if (importPath.includes('/atoms')) return 'atoms';
      if (importPath.includes('/molecules')) return 'molecules';
      if (importPath.includes('/organisms')) return 'organisms';
      if (importPath.includes('/templates')) return 'templates';
      if (importPath.includes('/pages')) return 'pages';
      if (importPath.includes('/tokens')) return 'tokens';
      if (importPath.includes('/theme')) return 'theme';
      if (importPath.includes('/utils')) return 'utils';
      return null;
    }

    function checkImport(node) {
      const importPath = node.source.value;

      // Only check imports from design-system
      if (!importPath.includes('@design-system') && !importPath.startsWith('../')) {
        return;
      }

      const importLevel = getImportLevel(importPath);
      if (!importLevel) return;

      const allowed = allowedImports[componentLevel];

      if (!allowed.includes(importLevel)) {
        let messageId;
        switch (componentLevel) {
          case 'atom':
            messageId = 'invalidAtomImport';
            break;
          case 'molecule':
            messageId = 'invalidMoleculeImport';
            break;
          case 'organism':
            messageId = 'invalidOrganismImport';
            break;
          case 'template':
            messageId = 'invalidTemplateImport';
            break;
        }

        context.report({
          node,
          messageId,
          data: {
            imported: importLevel,
          },
        });
      }
    }

    return {
      ImportDeclaration: checkImport,
    };
  },
};
