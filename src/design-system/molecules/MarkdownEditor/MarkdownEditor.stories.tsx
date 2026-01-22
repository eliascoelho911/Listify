/**
 * MarkdownEditor Molecule Stories
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { MarkdownEditor } from './MarkdownEditor';

const meta: Meta<typeof MarkdownEditor> = {
  title: 'Molecules/MarkdownEditor',
  component: MarkdownEditor,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Current content value',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    showToolbar: {
      control: 'boolean',
      description: 'Whether to show formatting toolbar',
    },
    editable: {
      control: 'boolean',
      description: 'Whether the editor is editable',
    },
    minHeight: {
      control: 'number',
      description: 'Minimum height of the editor',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MarkdownEditor>;

const MarkdownEditorWithState = (
  props: Omit<React.ComponentProps<typeof MarkdownEditor>, 'value' | 'onChangeText'> & {
    initialValue?: string;
  },
) => {
  const [value, setValue] = useState(props.initialValue || '');
  return <MarkdownEditor {...props} value={value} onChangeText={setValue} />;
};

export const Default: Story = {
  render: () => <MarkdownEditorWithState placeholder="Start writing your note..." />,
};

export const WithContent: Story = {
  render: () => (
    <MarkdownEditorWithState
      initialValue={`# My Note

This is a sample note with **bold** and *italic* text.

## Shopping List
- Milk
- Bread
- Eggs

Check out [React Native](https://reactnative.dev) for more info.`}
    />
  ),
};

export const WithoutToolbar: Story = {
  render: () => (
    <MarkdownEditorWithState
      showToolbar={false}
      placeholder="Simple editor without toolbar..."
    />
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <MarkdownEditorWithState
      initialValue="This content is read-only and cannot be edited."
      editable={false}
    />
  ),
};

export const CustomMinHeight: Story = {
  render: () => (
    <MarkdownEditorWithState minHeight={400} placeholder="Tall editor..." />
  ),
};

export const AutoFocus: Story = {
  render: () => (
    <MarkdownEditorWithState autoFocus placeholder="This editor auto-focuses on mount..." />
  ),
};

export const Empty: Story = {
  render: () => <MarkdownEditorWithState />,
};
