/**
 * Storybook Preview Configuration
 *
 * Wraps all stories with ThemeProvider and provides theme switching toolbar
 */

import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import type { Preview } from '@storybook/react';
import { View } from 'react-native';


const preview: Preview = {
  decorators: [
    withBackgrounds,
    (Story) => (
        <View style={{ flex: 1 }}>
          <Story />
        </View>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'high-contrast',
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
