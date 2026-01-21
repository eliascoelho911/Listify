/**
 * ParsePreview Molecule Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

import { ThemeProvider } from '../../theme';
import { ParsePreview } from './ParsePreview';
import type { ParsedElement } from './ParsePreview.types';

const meta: Meta<typeof ParsePreview> = {
  title: 'Molecules/ParsePreview',
  component: ParsePreview,
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
    showLabels: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof ParsePreview>;

export const Default: Story = {
  args: {
    elements: [
      { type: 'list', value: '@Mercado' },
      { type: 'quantity', value: '2L' },
      { type: 'price', value: 'R$8,50' },
    ] as ParsedElement[],
  },
};

export const WithLabels: Story = {
  args: {
    elements: [
      { type: 'list', value: '@Mercado' },
      { type: 'section', value: 'Laticínios' },
      { type: 'quantity', value: '2L' },
      { type: 'price', value: 'R$8,50' },
    ] as ParsedElement[],
    showLabels: true,
  },
};

export const ListOnly: Story = {
  args: {
    elements: [{ type: 'list', value: '@Mercado' }] as ParsedElement[],
  },
};

export const ListWithSection: Story = {
  args: {
    elements: [
      { type: 'list', value: '@Mercado' },
      { type: 'section', value: 'Padaria' },
    ] as ParsedElement[],
  },
};

export const SectionOnly: Story = {
  args: {
    elements: [{ type: 'section', value: ':Urgente' }] as ParsedElement[],
  },
};

export const PriceOnly: Story = {
  args: {
    elements: [{ type: 'price', value: 'R$150,00' }] as ParsedElement[],
  },
};

export const QuantityOnly: Story = {
  args: {
    elements: [{ type: 'quantity', value: '5kg' }] as ParsedElement[],
  },
};

export const Empty: Story = {
  args: {
    elements: [],
  },
};

export const AllTypes: Story = {
  args: {
    elements: [
      { type: 'list', value: '@Supermercado' },
      { type: 'section', value: 'Laticínios' },
      { type: 'quantity', value: '500ml' },
      { type: 'price', value: 'R$12,90' },
    ] as ParsedElement[],
    showLabels: true,
  },
};

export const CustomLabels: Story = {
  args: {
    elements: [
      { type: 'list', value: '@Mercado', label: 'Destino' },
      { type: 'price', value: 'R$25,00', label: 'Valor' },
    ] as ParsedElement[],
    showLabels: true,
  },
};
