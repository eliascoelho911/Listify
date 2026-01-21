/**
 * FAB (Floating Action Button) Atom Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Camera, Pencil, Plus } from 'lucide-react-native';

import { FAB } from './FAB';
import type { FABProps } from './FAB.types';

const meta: Meta<FABProps> = {
  title: 'Atoms/FAB',
  component: FAB,
  argTypes: {
    size: {
      control: 'select',
      options: ['md', 'lg'],
      description: 'Size of the FAB',
    },
  },
};

export default meta;

type Story = StoryObj<FABProps>;

export const Default: Story = {
  args: {
    icon: Plus,
    size: 'lg',
    accessibilityLabel: 'Add new item',
  },
};

export const Medium: Story = {
  args: {
    icon: Plus,
    size: 'md',
    accessibilityLabel: 'Add new item',
  },
};

export const WithPencil: Story = {
  args: {
    icon: Pencil,
    size: 'lg',
    accessibilityLabel: 'Edit',
  },
};

export const WithCamera: Story = {
  args: {
    icon: Camera,
    size: 'lg',
    accessibilityLabel: 'Take photo',
  },
};
