/**
 * Storybook Preview Configuration
 *
 * Wraps all stories with ThemeProvider and provides theme switching via global args control
 */

import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import type { Preview } from '@storybook/react-native';

import type { ThemeMode } from '../src/design-system/theme/theme';
import { darkTheme, lightTheme } from '../src/design-system/theme/theme';
import { ThemeProvider } from '../src/design-system/theme/ThemeProvider';

const preview: Preview = {
  // Global args pattern for theme control (works in React Native Storybook v10)
  argTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for all components',
      options: ['light', 'dark'],
      control: { type: 'radio' },
      table: {
        category: 'Global',
        defaultValue: { summary: 'dark' },
      },
    },
  },
  args: {
    theme: 'dark',
  },
  decorators: [
    withBackgrounds,
    (Story, context) => {
      const themeMode: ThemeMode = (context.args.theme as ThemeMode) || 'dark';

      return (
        <ThemeProvider initialMode={themeMode}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    backgrounds: {
      default: 'dark-background',
      values: [
        { name: 'dark-background', value: darkTheme.colors.background },
        { name: 'light-background', value: lightTheme.colors.background },
        { name: 'dark-card', value: darkTheme.colors.card },
        { name: 'light-card', value: lightTheme.colors.card },
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
