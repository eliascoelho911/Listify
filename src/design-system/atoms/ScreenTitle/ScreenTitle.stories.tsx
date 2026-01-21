/**
 * ScreenTitle Atom Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider, useTheme } from '../../theme';
import { ScreenTitle } from './ScreenTitle';

function StoryContainer({ children }: { children: React.ReactNode }): React.ReactElement {
  const { theme } = useTheme();
  return (
    <View style={{ padding: theme.spacing.lg, backgroundColor: theme.colors.background }}>
      {children}
    </View>
  );
}

const meta: Meta<typeof ScreenTitle> = {
  title: 'Atoms/ScreenTitle',
  component: ScreenTitle,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <StoryContainer>
          <Story />
        </StoryContainer>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ScreenTitle>;

export const Default: Story = {
  args: {
    title: 'Inbox',
  },
};

export const WithSubtitle: Story = {
  args: {
    title: 'Inbox',
    subtitle: '12 items',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'My Shopping List for the Week',
    subtitle: 'Updated today',
  },
};
