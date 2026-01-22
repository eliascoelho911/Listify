/**
 * PriceBadge Atom Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { Text } from '../Text/Text';
import { ThemeProvider } from '../../theme';
import { PriceBadge } from './PriceBadge';

const meta: Meta<typeof PriceBadge> = {
  title: 'Atoms/PriceBadge',
  component: PriceBadge,
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

type Story = StoryObj<typeof PriceBadge>;

export const Default: Story = {
  args: {
    price: 8.5,
  },
};

export const LargePrice: Story = {
  args: {
    price: 1234.99,
  },
};

export const SmallPrice: Story = {
  args: {
    price: 0.99,
  },
};

export const WithBackground: Story = {
  args: {
    price: 25.0,
    showBackground: true,
  },
};

export const SmallSize: Story = {
  args: {
    price: 15.99,
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    price: 199.9,
    size: 'lg',
  },
};

function AllSizesExample(): React.ReactElement {
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text>sm:</Text>
        <PriceBadge price={8.5} size="sm" />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text>md:</Text>
        <PriceBadge price={8.5} size="md" />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text>lg:</Text>
        <PriceBadge price={8.5} size="lg" />
      </View>
    </View>
  );
}

export const AllSizes: Story = {
  render: () => <AllSizesExample />,
};

function WithBackgroundExample(): React.ReactElement {
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text>No background:</Text>
        <PriceBadge price={12.5} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text>With background:</Text>
        <PriceBadge price={12.5} showBackground />
      </View>
    </View>
  );
}

export const BackgroundComparison: Story = {
  render: () => <WithBackgroundExample />,
};
