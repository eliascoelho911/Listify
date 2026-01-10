/**
 * Icon Atom Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Check, Heart, Home, Settings, Star, User, X } from 'lucide-react-native';

import { ThemeProvider } from '../../theme';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    icon: Home,
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    icon: Star,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    icon: Heart,
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    icon: Settings,
    size: 'xl',
  },
};

export const CommonIcons: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
      <Icon icon={Home} />
      <Icon icon={User} />
      <Icon icon={Settings} />
      <Icon icon={Heart} />
      <Icon icon={Star} />
      <Icon icon={Check} />
      <Icon icon={X} />
    </View>
  ),
};
