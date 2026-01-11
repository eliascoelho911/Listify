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
    (Story, context) => {
      const backgroundColor = context.globals?.backgrounds?.value || '#16191d';

      return (
        <ThemeProvider>
          <View style={{ flex: 1, padding: 16, backgroundColor }}>
            <Story />
          </View>
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#16191d' },
        { name: 'light', value: '#f8f9fa' },
        { name: 'white', value: '#ffffff' },
        { name: 'black', value: '#000000' },
        { name: 'gray', value: '#808080' },
        { name: 'high-contrast', value: '#ffff00' },
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
