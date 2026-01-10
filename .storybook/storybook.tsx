/**
 * Storybook Generator
 *
 * Generates the Storybook view component
 */

import { getStorybookUI } from '@storybook/react-native';
import './main';

export const view = getStorybookUI({
  storage: {
    getItem: async () => null,
    setItem: async () => {},
  },
  enableWebsockets: false,
  shouldPersistSelection: false,
  shouldDisableKeyboardAvoidingView: false,
});
