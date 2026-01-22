/**
 * DraggableList Organism Stories
 */

import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import { DragHandle } from '../../atoms/DragHandle/DragHandle';
import { Text } from '../../atoms/Text/Text';
import { ThemeProvider, useTheme } from '../../theme';
import { DraggableList } from './DraggableList';
import type { DraggableListItem, DraggableListRenderItemParams } from './DraggableList.types';

interface SampleItem extends DraggableListItem {
  title: string;
}

const createSampleData = (): SampleItem[] => [
  { id: '1', sortOrder: 0, title: 'Item 1' },
  { id: '2', sortOrder: 1, title: 'Item 2' },
  { id: '3', sortOrder: 2, title: 'Item 3' },
  { id: '4', sortOrder: 3, title: 'Item 4' },
  { id: '5', sortOrder: 4, title: 'Item 5' },
];

function SampleItemComponent({ item, drag, isActive }: DraggableListRenderItemParams<SampleItem>) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onLongPress={drag}
      disabled={isActive}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        marginVertical: theme.spacing.xs,
        marginHorizontal: theme.spacing.md,
        backgroundColor: isActive ? theme.colors.accent : theme.colors.card,
        borderRadius: theme.radii.md,
        gap: theme.spacing.md,
      }}
    >
      <DragHandle isDragging={isActive} />
      <Text style={{ color: theme.colors.foreground, fontSize: theme.typography.sizes.base }}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
}

function DraggableListExample() {
  const [data, setData] = useState(createSampleData);

  return (
    <View style={{ height: 400 }}>
      <DraggableList
        data={data}
        onDragEnd={setData}
        renderItem={(params) => <SampleItemComponent {...params} />}
      />
    </View>
  );
}

function DisabledReorderExample() {
  const [data] = useState(createSampleData);

  return (
    <View style={{ height: 400 }}>
      <DraggableList
        data={data}
        onDragEnd={() => {}}
        isReorderEnabled={false}
        renderItem={(params) => <SampleItemComponent {...params} />}
      />
    </View>
  );
}

const meta: Meta<typeof DraggableList> = {
  title: 'Organisms/DraggableList',
  component: DraggableList,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ flex: 1 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof DraggableList>;

export const Default: Story = {
  render: () => <DraggableListExample />,
};

export const DisabledReorder: Story = {
  render: () => <DisabledReorderExample />,
};
