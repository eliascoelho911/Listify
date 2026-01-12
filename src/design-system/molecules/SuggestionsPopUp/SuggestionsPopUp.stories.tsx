/**
 * SuggestionsPopUp Molecule Stories
 */

import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Hash } from 'lucide-react-native';

import { Text } from '../../atoms';
import { ThemeProvider, useTheme } from '../../theme';
import { SuggestionsPopUp } from './SuggestionsPopUp';
import type { SuggestionItem } from './SuggestionsPopUp.types';

function StoryDecorator({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'flex-end', padding: 20, paddingBottom: 100 }}>
      <View style={{ position: 'relative' }}>
        {children}
        <View
          style={{
            height: 50,
            backgroundColor: theme.colors.muted,
            borderRadius: theme.radii.md,
            justifyContent: 'center',
            paddingHorizontal: theme.spacing.lg,
          }}
        >
          <Text style={{ color: theme.colors.mutedForeground }}>Input placeholder...</Text>
        </View>
      </View>
    </View>
  );
}

const meta: Meta<typeof SuggestionsPopUp> = {
  title: 'Molecules/SuggestionsPopUp',
  component: SuggestionsPopUp,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <StoryDecorator>
          <Story />
        </StoryDecorator>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SuggestionsPopUp>;

const sampleItems: SuggestionItem[] = [
  { id: '1', label: '#compras', description: '5 uses' },
  { id: '2', label: '#mercado', description: '3 uses' },
  { id: '3', label: '#urgente', description: '2 uses' },
];

const manyItems: SuggestionItem[] = [
  { id: '1', label: '#compras', description: '10 uses' },
  { id: '2', label: '#mercado', description: '8 uses' },
  { id: '3', label: '#urgente', description: '7 uses' },
  { id: '4', label: '#casa', description: '5 uses' },
  { id: '5', label: '#trabalho', description: '4 uses' },
  { id: '6', label: '#pessoal', description: '3 uses' },
  { id: '7', label: '#lazer', description: '2 uses' },
];

export const Default: Story = {
  args: {
    items: sampleItems,
    visible: true,
    onSelect: (item) => console.log('Selected:', item),
  },
};

export const Empty: Story = {
  args: {
    items: [],
    visible: true,
    onSelect: () => {},
    emptyMessage: 'No matching tags found',
  },
};

export const Loading: Story = {
  args: {
    items: [],
    visible: true,
    isLoading: true,
    onSelect: () => {},
  },
};

export const ManyItems: Story = {
  args: {
    items: manyItems,
    visible: true,
    onSelect: (item) => console.log('Selected:', item),
    maxItems: 5,
  },
};

function CustomRenderItem(item: SuggestionItem) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Hash size={16} color={theme.colors.primary} />
      <Text style={{ color: theme.colors.foreground }}>{item.label.replace('#', '')}</Text>
    </View>
  );
}

export const CustomRender: Story = {
  args: {
    items: sampleItems,
    visible: true,
    onSelect: (item) => console.log('Selected:', item),
    renderItem: CustomRenderItem,
  },
};

export const Hidden: Story = {
  args: {
    items: sampleItems,
    visible: false,
    onSelect: () => {},
  },
};
