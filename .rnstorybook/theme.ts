/**
 * Storybook Theme Customization
 *
 * Customizes Storybook UI colors to match Design System
 */

import { create } from '@storybook/theming/create';

export const storybookTheme = create({
  base: 'dark',

  // Brand
  brandTitle: 'Listify Design System',
  brandUrl: 'https://github.com/yourusername/listify',
  brandTarget: '_self',

  // Colors
  colorPrimary: '#06b6d4', // cyan-500
  colorSecondary: '#06b6d4',

  // UI
  appBg: '#16191d', // gray-950
  appContentBg: '#1a1e23',
  appBorderColor: '#2d3139',
  appBorderRadius: 12,

  // Text
  textColor: '#f8f9fa', // gray-50
  textInverseColor: '#16191d',

  // Toolbar
  barTextColor: '#f8f9fa',
  barSelectedColor: '#06b6d4',
  barBg: '#1a1e23',

  // Form
  inputBg: '#1a1e23',
  inputBorder: '#2d3139',
  inputTextColor: '#f8f9fa',
  inputBorderRadius: 8,
});

export default storybookTheme;
