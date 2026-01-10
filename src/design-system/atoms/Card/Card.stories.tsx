/**
 * Card Atom Stories
 */

import React from 'react';
import { Text, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeProvider } from '../../theme';
import { Button } from '../Button/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Atoms/Card',
  component: Card,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ padding: 20 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <Text>This is the card content area.</Text>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card with Footer</CardTitle>
        <CardDescription>This card has a footer section</CardDescription>
      </CardHeader>
      <CardContent>
        <Text>Card content with action buttons in footer.</Text>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm">Confirm</Button>
      </CardFooter>
    </Card>
  ),
};

export const OnlyTitle: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Text>Card with only a title and content.</Text>
      </CardContent>
    </Card>
  ),
};

export const FullComposition: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Complete Card Example</CardTitle>
        <CardDescription>
          This card demonstrates all available sections working together
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Text>
          Cards are versatile containers that can hold any type of content. They provide visual
          hierarchy and grouping for related information.
        </Text>
        <Text style={{ marginTop: 8 }}>
          Use them to organize complex layouts into digestible sections.
        </Text>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm">
          Learn More
        </Button>
        <Button size="sm">Get Started</Button>
      </CardFooter>
    </Card>
  ),
};
