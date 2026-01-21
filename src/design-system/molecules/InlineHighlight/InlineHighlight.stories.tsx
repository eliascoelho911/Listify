/**
 * InlineHighlight Molecule Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { ThemeProvider } from '../../theme';
import { InlineHighlight } from './InlineHighlight';
import type { HighlightSegment } from './InlineHighlight.types';

const meta: Meta<typeof InlineHighlight> = {
  title: 'Molecules/InlineHighlight',
  component: InlineHighlight,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    text: { control: 'text' },
    selectable: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof InlineHighlight>;

export const Default: Story = {
  args: {
    text: 'Leite 2L R$8,50 @Mercado',
    highlights: [
      { type: 'quantity', start: 6, end: 8, value: '2L' },
      { type: 'price', start: 9, end: 16, value: 'R$8,50' },
      { type: 'list', start: 17, end: 25, value: '@Mercado' },
    ] as HighlightSegment[],
  },
};

export const ListOnly: Story = {
  args: {
    text: 'Item @Mercado',
    highlights: [{ type: 'list', start: 5, end: 13, value: '@Mercado' }] as HighlightSegment[],
  },
};

export const WithSection: Story = {
  args: {
    text: 'Pão @Mercado:Padaria',
    highlights: [
      { type: 'list', start: 4, end: 20, value: '@Mercado:Padaria' },
    ] as HighlightSegment[],
  },
};

export const StandaloneSection: Story = {
  args: {
    text: 'Item :Urgente',
    highlights: [{ type: 'section', start: 5, end: 13, value: ':Urgente' }] as HighlightSegment[],
  },
};

export const PriceOnly: Story = {
  args: {
    text: 'Item R$10,50',
    highlights: [{ type: 'price', start: 5, end: 12, value: 'R$10,50' }] as HighlightSegment[],
  },
};

export const QuantityOnly: Story = {
  args: {
    text: 'Arroz 5kg',
    highlights: [{ type: 'quantity', start: 6, end: 9, value: '5kg' }] as HighlightSegment[],
  },
};

export const NoHighlights: Story = {
  args: {
    text: 'Simple text without highlights',
    highlights: [],
  },
};

export const AllHighlightTypes: Story = {
  args: {
    text: 'Leite Integral 2L R$8,50 @Mercado:Laticínios',
    highlights: [
      { type: 'quantity', start: 15, end: 17, value: '2L' },
      { type: 'price', start: 18, end: 25, value: 'R$8,50' },
      { type: 'list', start: 26, end: 44, value: '@Mercado:Laticínios' },
    ] as HighlightSegment[],
  },
};
