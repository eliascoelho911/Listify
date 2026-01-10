/**
 * Storybook Main Configuration
 */

import type { StorybookConfig } from '@storybook/react-native';

const config: StorybookConfig = {
  stories: [
    '../src/design-system/atoms/**/*.stories.?(ts|tsx|js|jsx)',
    '../src/design-system/molecules/**/*.stories.?(ts|tsx|js|jsx)',
    '../src/design-system/organisms/**/*.stories.?(ts|tsx|js|jsx)',
    '../src/design-system/templates/**/*.stories.?(ts|tsx|js|jsx)',
  ],
  addons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-backgrounds',
  ],
};

export default config;
