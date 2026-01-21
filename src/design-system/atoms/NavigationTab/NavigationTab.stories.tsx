/**
 * NavigationTab Atom Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Inbox, List, Search as SearchIcon, StickyNote } from 'lucide-react-native';

import { NavigationTab } from './NavigationTab';
import type { NavigationTabProps } from './NavigationTab.types';

const meta: Meta<NavigationTabProps> = {
  title: 'Atoms/NavigationTab',
  component: NavigationTab,
  argTypes: {
    isActive: {
      control: 'boolean',
      description: 'Whether the tab is currently active',
    },
    label: {
      control: 'text',
      description: 'Tab label text',
    },
  },
};

export default meta;

type Story = StoryObj<NavigationTabProps>;

export const Default: Story = {
  args: {
    icon: Inbox,
    label: 'Inbox',
    isActive: false,
  },
};

export const Active: Story = {
  args: {
    icon: Inbox,
    label: 'Inbox',
    isActive: true,
  },
};

export const SearchTab: Story = {
  args: {
    icon: SearchIcon,
    label: 'Buscar',
    isActive: false,
  },
};

export const Notes: Story = {
  args: {
    icon: StickyNote,
    label: 'Notas',
    isActive: false,
  },
};

export const Lists: Story = {
  args: {
    icon: List,
    label: 'Listas',
    isActive: false,
  },
};
