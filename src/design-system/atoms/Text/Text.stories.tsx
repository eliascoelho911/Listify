/**
 * Text Atom Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Atoms/Text',
  component: Text,
  decorators: [
    (Story) => (
      <View style={{ padding: 20, gap: 16 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'body',
        'bodySmall',
        'bodyLarge',
        'caption',
        'label',
        'mono',
      ],
    },
    color: {
      control: { type: 'select' },
      options: [
        'foreground',
        'mutedForeground',
        'cardForeground',
        'primaryForeground',
        'secondaryForeground',
        'destructiveForeground',
        'primary',
        'destructive',
        'muted',
      ],
    },
    weight: {
      control: { type: 'select' },
      options: ['regular', 'medium', 'semibold', 'bold'],
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'justify'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    children: 'Default body text using Fira Sans',
    variant: 'body',
  },
};

export const Heading1: Story = {
  args: {
    children: 'Heading 1',
    variant: 'h1',
  },
};

export const Heading2: Story = {
  args: {
    children: 'Heading 2',
    variant: 'h2',
  },
};

export const Heading3: Story = {
  args: {
    children: 'Heading 3',
    variant: 'h3',
  },
};

export const Heading4: Story = {
  args: {
    children: 'Heading 4',
    variant: 'h4',
  },
};

export const Body: Story = {
  args: {
    children: 'Regular body text for paragraphs and general content.',
    variant: 'body',
  },
};

export const BodySmall: Story = {
  args: {
    children: 'Smaller body text for secondary information.',
    variant: 'bodySmall',
  },
};

export const BodyLarge: Story = {
  args: {
    children: 'Larger body text for emphasis or lead paragraphs.',
    variant: 'bodyLarge',
  },
};

export const Caption: Story = {
  args: {
    children: 'Caption text for image descriptions and fine print',
    variant: 'caption',
  },
};

export const LabelVariant: Story = {
  args: {
    children: 'Label text for form fields',
    variant: 'label',
  },
};

export const Monospace: Story = {
  args: {
    children: 'const code = "Fira Code";',
    variant: 'mono',
  },
};

export const MutedColor: Story = {
  args: {
    children: 'Muted foreground color for secondary text',
    color: 'mutedForeground',
  },
};

export const PrimaryColor: Story = {
  args: {
    children: 'Primary color for links and emphasis',
    color: 'primary',
  },
};

export const DestructiveColor: Story = {
  args: {
    children: 'Destructive color for errors and warnings',
    color: 'destructive',
  },
};

export const BoldBody: Story = {
  args: {
    children: 'Body text with bold weight override',
    variant: 'body',
    weight: 'bold',
  },
};

export const CenteredText: Story = {
  args: {
    children: 'Centered text alignment',
    align: 'center',
  },
};

export const AllHeadings: Story = {
  render: () => (
    <>
      <Text variant="h1">Heading 1 (48px Bold)</Text>
      <Text variant="h2">Heading 2 (36px Bold)</Text>
      <Text variant="h3">Heading 3 (30px Semibold)</Text>
      <Text variant="h4">Heading 4 (24px Semibold)</Text>
    </>
  ),
};

export const AllBodyVariants: Story = {
  render: () => (
    <>
      <Text variant="bodyLarge">Body Large (18px Regular)</Text>
      <Text variant="body">Body (16px Regular)</Text>
      <Text variant="bodySmall">Body Small (14px Regular)</Text>
    </>
  ),
};

export const AllUtilityVariants: Story = {
  render: () => (
    <>
      <Text variant="label">Label (14px Medium)</Text>
      <Text variant="caption">Caption (12px Regular)</Text>
      <Text variant="mono">Monospace (14px Fira Code)</Text>
    </>
  ),
};

export const AllColors: Story = {
  render: () => (
    <>
      <Text color="foreground">Foreground (default)</Text>
      <Text color="mutedForeground">Muted Foreground</Text>
      <Text color="primary">Primary</Text>
      <Text color="destructive">Destructive</Text>
    </>
  ),
};

export const AllWeights: Story = {
  render: () => (
    <>
      <Text weight="regular">Regular (400)</Text>
      <Text weight="medium">Medium (500)</Text>
      <Text weight="semibold">Semibold (600)</Text>
      <Text weight="bold">Bold (700)</Text>
    </>
  ),
};

export const AllAlignments: Story = {
  render: () => (
    <View style={{ width: '100%' }}>
      <Text align="left">Left aligned text</Text>
      <Text align="center">Center aligned text</Text>
      <Text align="right">Right aligned text</Text>
    </View>
  ),
};
