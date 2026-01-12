/**
 * ContextMenu Molecule Stories
 *
 * Menu de opções contextual (long press). Inspirado no DropdownMenu do Shadcn.
 */

import React, { useState } from 'react';
import { Button, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Edit2, Share2, Trash2 } from 'lucide-react-native';

import { ThemeProvider } from '../../theme';
import { ContextMenu } from './ContextMenu';
import type { ContextMenuItem } from './ContextMenu.types';

const meta: Meta<typeof ContextMenu> = {
  title: 'Molecules/ContextMenu',
  component: ContextMenu,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ContextMenu>;

const defaultItems: ContextMenuItem[] = [
  { id: 'edit', label: 'Edit', icon: Edit2 },
  { id: 'share', label: 'Share', icon: Share2 },
  { id: 'delete', label: 'Delete', icon: Trash2, destructive: true },
];

function InteractiveContextMenu({ items, title }: { items: ContextMenuItem[]; title?: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button title="Open Menu" onPress={() => setVisible(true)} />
      <ContextMenu
        items={items}
        visible={visible}
        onClose={() => setVisible(false)}
        onSelect={(item) => console.log('Selected:', item.label)}
        title={title}
      />
    </>
  );
}

export const Default: Story = {
  render: () => <InteractiveContextMenu items={defaultItems} />,
};

export const WithTitle: Story = {
  render: () => <InteractiveContextMenu items={defaultItems} title="Actions" />,
};

export const WithIcons: Story = {
  render: () => <InteractiveContextMenu items={defaultItems} />,
};

export const Destructive: Story = {
  render: () => {
    const items: ContextMenuItem[] = [
      { id: 'delete', label: 'Delete permanently', icon: Trash2, destructive: true },
    ];
    return <InteractiveContextMenu items={items} />;
  },
};

export const ManyItems: Story = {
  render: () => {
    const items: ContextMenuItem[] = [
      { id: 'edit', label: 'Edit' },
      { id: 'duplicate', label: 'Duplicate' },
      { id: 'share', label: 'Share' },
      { id: 'archive', label: 'Archive' },
      { id: 'delete', label: 'Delete', destructive: true },
    ];
    return <InteractiveContextMenu items={items} />;
  },
};

export const WithDisabledItem: Story = {
  render: () => {
    const items: ContextMenuItem[] = [
      { id: 'edit', label: 'Edit', icon: Edit2 },
      { id: 'share', label: 'Share', icon: Share2, disabled: true },
      { id: 'delete', label: 'Delete', icon: Trash2, destructive: true },
    ];
    return <InteractiveContextMenu items={items} />;
  },
};
