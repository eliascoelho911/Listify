/**
 * InlineEdit Atom Stories
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { InlineEdit } from './InlineEdit';

const meta: Meta<typeof InlineEdit> = {
  title: 'Atoms/InlineEdit',
  component: InlineEdit,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['title', 'subtitle', 'default'],
      description: 'Text variant for display mode',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether editing is disabled',
    },
    multiline: {
      control: 'boolean',
      description: 'Whether to allow multiline editing',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character length',
    },
  },
};

export default meta;
type Story = StoryObj<typeof InlineEdit>;

const InlineEditWithState = (
  props: Omit<React.ComponentProps<typeof InlineEdit>, 'value' | 'onChangeText'> & {
    initialValue?: string;
  },
) => {
  const [value, setValue] = useState(props.initialValue || '');
  return (
    <InlineEdit
      {...props}
      value={value}
      onChangeText={setValue}
      onSubmit={(val) => console.log('Submitted:', val)}
    />
  );
};

export const Default: Story = {
  render: () => <InlineEditWithState initialValue="Click to edit this text" />,
};

export const Title: Story = {
  render: () => <InlineEditWithState initialValue="Note Title" variant="title" />,
};

export const Subtitle: Story = {
  render: () => <InlineEditWithState initialValue="Section Header" variant="subtitle" />,
};

export const Empty: Story = {
  render: () => <InlineEditWithState placeholder="Enter text here..." />,
};

export const WithMaxLength: Story = {
  render: () => (
    <InlineEditWithState initialValue="Limited" maxLength={20} placeholder="Max 20 characters" />
  ),
};

export const Multiline: Story = {
  render: () => (
    <InlineEditWithState
      initialValue="This is a longer text that can span multiple lines when editing"
      multiline
    />
  ),
};

export const Disabled: Story = {
  render: () => <InlineEditWithState initialValue="Cannot edit this" disabled />,
};

const ControlledEditingExample = () => {
  const [value, setValue] = useState('Controlled editing state');
  const [isEditing, setIsEditing] = useState(true);

  return (
    <InlineEdit
      value={value}
      onChangeText={setValue}
      isEditing={isEditing}
      onEditingChange={setIsEditing}
    />
  );
};

export const ControlledEditing: Story = {
  render: () => <ControlledEditingExample />,
};

export const AllVariants: Story = {
  render: () => (
    <>
      <InlineEditWithState initialValue="Title Variant" variant="title" />
      <InlineEditWithState initialValue="Subtitle Variant" variant="subtitle" />
      <InlineEditWithState initialValue="Default Variant" variant="default" />
    </>
  ),
};
