/**
 * Configuration file for eslint-plugin-local-rules
 *
 * This file exports all custom ESLint rules for the Design System.
 * The plugin expects this file to be named exactly "eslint-local-rules.js"
 * and located at the project root.
 */

module.exports = {
  'no-hardcoded-values': require('./eslint-rules/no-hardcoded-values'),
  'atomic-design-imports': require('./eslint-rules/atomic-design-imports'),
  'theme-provider-usage': require('./eslint-rules/theme-provider-usage'),
  'no-raw-text-import': require('./eslint-rules/no-raw-text-import'),
};
