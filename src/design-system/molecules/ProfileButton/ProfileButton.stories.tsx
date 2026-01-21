/**
 * ProfileButton Molecule Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider, useTheme } from '../../theme';
import { ProfileButton } from './ProfileButton';

function StoryContainer({ children }: { children: React.ReactNode }): React.ReactElement {
  const { theme } = useTheme();
  return (
    <View style={{ padding: theme.spacing.lg, backgroundColor: theme.colors.background }}>
      {children}
    </View>
  );
}

const meta: Meta<typeof ProfileButton> = {
  title: 'Molecules/ProfileButton',
  component: ProfileButton,
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

type Story = StoryObj<typeof ProfileButton>;

export const Default: Story = {
  args: {
    displayName: 'John Doe',
    onPress: () => console.debug('Profile pressed'),
  },
};

export const SingleName: Story = {
  args: {
    displayName: 'Admin',
    onPress: () => console.debug('Profile pressed'),
  },
};

export const NoName: Story = {
  args: {
    onPress: () => console.debug('Profile pressed'),
  },
};

export const SmallSize: Story = {
  args: {
    displayName: 'Jane Smith',
    size: 'sm',
    onPress: () => console.debug('Profile pressed'),
  },
};

export const LargeSize: Story = {
  args: {
    displayName: 'Jane Smith',
    size: 'lg',
    onPress: () => console.debug('Profile pressed'),
  },
};

export const AllSizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
      <ProfileButton displayName="John Doe" size="sm" />
      <ProfileButton displayName="John Doe" size="md" />
      <ProfileButton displayName="John Doe" size="lg" />
    </View>
  ),
};
