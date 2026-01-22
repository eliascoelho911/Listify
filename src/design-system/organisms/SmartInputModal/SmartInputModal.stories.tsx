/**
 * SmartInputModal Organism Stories
 */

import React, { useState } from 'react';
import { Button, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import type { ParsedInput } from '@domain/common';

import { ThemeProvider } from '../../theme';
import { SmartInputModal } from './SmartInputModal';
import type { SmartInputModalProps } from './SmartInputModal.types';

const mockParsedEmpty: ParsedInput = {
  title: '',
  listName: null,
  sectionName: null,
  quantity: null,
  price: null,
  rawText: '',
  highlights: [],
};

const mockParsedWithList: ParsedInput = {
  title: 'Comprar leite',
  listName: 'Mercado',
  sectionName: null,
  quantity: null,
  price: null,
  rawText: '@Mercado Comprar leite',
  highlights: [{ start: 0, end: 8, type: 'list', value: '@Mercado' }],
};

const mockParsedWithSection: ParsedInput = {
  title: 'Arroz',
  listName: 'Mercado',
  sectionName: 'Grãos',
  quantity: null,
  price: null,
  rawText: '@Mercado:Grãos Arroz',
  highlights: [{ start: 0, end: 14, type: 'list', value: '@Mercado:Grãos' }],
};

const mockParsedWithPrice: ParsedInput = {
  title: 'Leite',
  listName: 'Mercado',
  sectionName: null,
  quantity: '2L',
  price: 8.99,
  rawText: '@Mercado Leite 2L R$8,99',
  highlights: [
    { start: 0, end: 8, type: 'list', value: '@Mercado' },
    { start: 15, end: 17, type: 'quantity', value: '2L' },
    { start: 18, end: 25, type: 'price', value: 'R$8,99' },
  ],
};

const mockListSuggestions = [
  { id: '1', name: 'Mercado', listType: 'shopping' as const },
  { id: '2', name: 'Meus Filmes', listType: 'movies' as const },
  { id: '3', name: 'Minhas Notas', listType: 'notes' as const },
];

function SmartInputModalWrapper(props: Partial<SmartInputModalProps>) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Abrir Modal" onPress={() => setVisible(true)} />
      <SmartInputModal
        visible={visible}
        onClose={() => setVisible(false)}
        onSubmit={() => {
          setValue('');
          setVisible(false);
        }}
        value={value}
        onChangeText={setValue}
        parsed={mockParsedEmpty}
        listSuggestions={[]}
        showSuggestions={false}
        onSelectList={() => {}}
        {...props}
      />
    </View>
  );
}

const meta: Meta<typeof SmartInputModal> = {
  title: 'Organisms/SmartInputModal',
  component: SmartInputModal,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ flex: 1, minHeight: 400 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SmartInputModal>;

export const Default: Story = {
  render: () => <SmartInputModalWrapper />,
};

export const WithListReference: Story = {
  render: () => (
    <SmartInputModalWrapper value="@Mercado Comprar leite" parsed={mockParsedWithList} />
  ),
};

export const WithSectionReference: Story = {
  render: () => (
    <SmartInputModalWrapper value="@Mercado:Grãos Arroz" parsed={mockParsedWithSection} />
  ),
};

export const WithPriceAndQuantity: Story = {
  render: () => (
    <SmartInputModalWrapper value="@Mercado Leite 2L R$8,99" parsed={mockParsedWithPrice} />
  ),
};

export const WithSuggestions: Story = {
  render: () => (
    <SmartInputModalWrapper
      value="@Mer"
      parsed={mockParsedEmpty}
      listSuggestions={mockListSuggestions}
      showSuggestions
    />
  ),
};

export const WithCreateOption: Story = {
  render: () => (
    <SmartInputModalWrapper
      value="@Nova Lista"
      parsed={mockParsedEmpty}
      listSuggestions={[]}
      showSuggestions
      onCreateList={(name) => console.log('Create list:', name)}
    />
  ),
};
