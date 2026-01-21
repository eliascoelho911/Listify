/**
 * SortingControls Molecule Stories
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar, Type } from 'lucide-react-native';

import { ThemeProvider } from '../../theme';
import { SortingControls } from './SortingControls';
import type { SortDirection, SortOption } from './SortingControls.types';

const dateSortOptions: SortOption[] = [
  { value: 'createdAt', label: 'Data', icon: Calendar },
  { value: 'title', label: 'Nome', icon: Type },
];

const inboxSortOptions: SortOption[] = [
  { value: 'createdAt', label: 'Recentes' },
  { value: 'list', label: 'Lista' },
  { value: 'type', label: 'Tipo' },
];

const meta: Meta<typeof SortingControls> = {
  title: 'Molecules/SortingControls',
  component: SortingControls,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20, gap: 16 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SortingControls>;

export const Default: Story = {
  args: {
    options: dateSortOptions,
    selectedValue: 'createdAt',
    sortDirection: 'desc',
    onSortChange: () => {},
    onDirectionToggle: () => {},
  },
};

export const WithIcons: Story = {
  args: {
    options: dateSortOptions,
    selectedValue: 'title',
    sortDirection: 'asc',
    onSortChange: () => {},
    onDirectionToggle: () => {},
  },
};

export const InboxStyle: Story = {
  args: {
    options: inboxSortOptions,
    selectedValue: 'createdAt',
    sortDirection: 'desc',
    label: 'Agrupar por',
    onSortChange: () => {},
    onDirectionToggle: () => {},
  },
};

export const Disabled: Story = {
  args: {
    options: dateSortOptions,
    selectedValue: 'createdAt',
    sortDirection: 'desc',
    disabled: true,
    onSortChange: () => {},
    onDirectionToggle: () => {},
  },
};

function InteractiveSortingControls(): React.ReactElement {
  const [selectedValue, setSelectedValue] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  return (
    <SortingControls
      options={inboxSortOptions}
      selectedValue={selectedValue}
      sortDirection={sortDirection}
      onSortChange={setSelectedValue}
      onDirectionToggle={() => setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveSortingControls />,
};
