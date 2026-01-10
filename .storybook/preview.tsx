/**
 * Storybook Preview Configuration
 *
 * Wraps all stories with ThemeProvider and provides theme switching toolbar
 */

import React from 'react';
import type { Preview } from '@storybook/react';
import { View } from 'react-native';

import { ThemeProvider } from '../src/design-system/theme';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ flex: 1, padding: 16, backgroundColor: '#16191d' }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#16191d' },
        { name: 'light', value: '#f8f9fa' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
